/**
 * 分享裂变引擎 v2.0 - 小程序增长核心
 * 
 * 机制说明：
 * 1. 用户分享 → 好友通过分享进入 → 双方各得金币
 * 2. 阶梯奖励：分享次数越多，单次奖励越高
 * 3. 群分享加成：分享到群比分享到个人奖励更高
 * 4. 连续分享奖励：连续分享天数越多，额外加成越高
 * 5. 排行榜：每周分享达人TOP10额外奖励
 * 6. 限时活动：可通过 EVENT_MODE 开启双倍/三倍奖励
 */

const app = getApp()

// ========== 限时活动开关 ==========
const EVENT_MODE = {
  active: false,          // 是否开启活动模式
  multiplier: 1,          // 奖励倍数 (1=正常, 2=双倍, 3=三倍)
  endDate: null           // 活动截止日期
}

// ========== 分享卡片配置 ==========
const SHARE_TEMPLATES = {
  // 首页分享
  home: {
    title: '🐂 草原爱宠营 | 遛狗就能赚金币，兑换纯肉零食',
    path: '/pages/index/index',
    imageUrl: '/images/thumb_tab-home.png'
  },
  // 赛事分享
  event: {
    title: '🏆 草原人宠互动季报名中！3天2晚蒙古包+烤全羊',
    path: '/pages/event/event',
    imageUrl: '/images/thumb_banner_event.jpg'
  },
  // 产品分享
  product: (product) => ({
    title: product ? `🐾 ${product.name} | 配料表只有肉，人食标准生产` : '🐾 牛香香宠物零食 | 配料表只有肉',
    path: `/pages/products/products?share=1`,
    imageUrl: '/images/thumb_product_80g.jpg'
  }),
  // 视频内容分享
  feed: (item) => ({
    title: item ? `🐕 ${item.title || '草原上的狗狗太快乐了！'}` : '🐕 来草原爱宠营看萌宠视频赚金币',
    path: `/pages/feed/feed`,
    imageUrl: '/images/thumb_banner_partner.jpg'
  }),
  // 金币邀请（主推）
  invite: (userId) => ({
    title: '🎁 送你200金币！来草原爱宠营一起遛狗赚金币换零食',
    path: `/pages/index/index?inviter=${userId}`,
    imageUrl: '/images/tab-event.png'
  }),
  // 日常互动
  daily: {
    title: '🌅 今天遛狗了吗？签到打卡赚金币，连续7天有惊喜！',
    path: '/pages/feed/feed',
    imageUrl: '/images/thumb_tab-event.png'
  },
  // 排行榜分享
  leaderboard: (userName) => ({
    title: `🏅 ${userName || '我'}在草原爱宠营本周邀请榜排第${userName ? 'X' : '前'}名！来挑战我`,
    path: '/pages/index/index',
    imageUrl: '/images/tab-event.png'
  })
}

// ========== 邀请奖励规则 v2.0 ==========
const INVITE_RULES = {
  baseReward: 80,                    // 基础邀请奖励 (原50→80)
  inviteeReward: 80,                 // 被邀请者奖励 (原100→80，拉大差距)
  dailyLimit: 20,                    // 每日邀请上限 (原10→20)
  groupShareBonus: 30,               // 群分享额外加成 +30
  consecutiveBonus: {                // 连续分享奖励
    3: 30,                           // 连续3天 +30
    5: 60,                           // 连续5天 +60
    7: 120                           // 连续7天 +120
  },
  tierBonus: [                       // 阶梯奖励
    { count: 1, bonus: 0 },           // 第1次：80
    { count: 3, bonus: 30 },          // 第3次起：110
    { count: 5, bonus: 80 },          // 第5次起：160
    { count: 10, bonus: 150 },        // 第10次起：230
    { count: 20, bonus: 300 }         // 第20次起：380
  ]
}

// ========== 连续分享追踪 ==========
function getConsecutiveDays() {
  try {
    const days = wx.getStorageSync('share_streak') || {}
    const today = new Date().toDateString()
    
    if (days.lastDate === today) {
      return days.count  // 今天已记过
    }
    
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (days.lastDate === yesterday) {
      return days.count  // 连续中
    }
    return 0  // 断了
  } catch(e) {
    return 0
  }
}

function updateConsecutiveDays() {
  try {
    const days = wx.getStorageSync('share_streak') || { count: 0, lastDate: '' }
    const today = new Date().toDateString()
    
    if (days.lastDate === today) {
      return days.count  // 今天已更新过
    }
    
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    let newCount = 1
    if (days.lastDate === yesterday) {
      newCount = (days.count || 0) + 1
    }
    
    wx.setStorageSync('share_streak', { count: newCount, lastDate: today })
    return newCount
  } catch(e) {
    return 1
  }
}

function getConsecutiveBonus(count) {
  const tiers = INVITE_RULES.consecutiveBonus
  let bonus = 0
  for (const [need, reward] of Object.entries(tiers)) {
    if (count >= parseInt(need)) {
      bonus = reward
    }
  }
  return bonus
}

// ========== 处理分享（统一入口，替代手动调用 trackShare）==========
function onShare(source, isGroup = false) {
  // 更新连续分享
  const streak = updateConsecutiveDays()
  
  // 基础奖励 (仅邀请类型有效)
  let reward = INVITE_RULES.baseReward
  
  // 群分享加成
  if (isGroup) {
    reward += INVITE_RULES.groupShareBonus
  }
  
  // 连续分享加成
  const conBonus = getConsecutiveBonus(streak)
  if (conBonus > 0) {
    reward += conBonus
  }
  
  // 限时活动倍数
  if (EVENT_MODE.active && EVENT_MODE.multiplier > 1) {
    reward = Math.floor(reward * EVENT_MODE.multiplier)
  }
  
  // 异步记录
  try {
    wx.cloud.callFunction({
      name: 'addCoins',
      data: { 
        type: 'share',
        source: source,
        isGroup: isGroup,
        streak: streak,
        streakBonus: conBonus,
        reward: reward,
        timestamp: Date.now()
      }
    })
  } catch(e) {}
  
  return reward
}

// ========== 邀请奖励计算（更新版）==========
function getInviteReward(inviteCount, isGroup = false) {
  // 基础奖励
  let reward = INVITE_RULES.baseReward
  
  // 阶梯奖励
  for (let i = INVITE_RULES.tierBonus.length - 1; i >= 0; i--) {
    if (inviteCount >= INVITE_RULES.tierBonus[i].count) {
      reward += INVITE_RULES.tierBonus[i].bonus
      break
    }
  }
  
  // 群分享加成
  if (isGroup) {
    reward += INVITE_RULES.groupShareBonus
  }
  
  // 限时活动倍数
  if (EVENT_MODE.active && EVENT_MODE.multiplier > 1) {
    reward = Math.floor(reward * EVENT_MODE.multiplier)
  }
  
  return reward
}

// ========== 分享埋点 ==========
function trackShare(source, success) {
  try {
    wx.cloud.callFunction({
      name: 'addCoins',
      data: { 
        type: 'share',
        source: source,
        success: success,
        timestamp: Date.now()
      }
    })
  } catch(e) {}
}

// ========== 处理邀请参数（在app.onLaunch或首页onLoad中调用）==========
function handleInvite(options) {
  if (!options || !options.inviter) return
  
  const inviterId = options.inviter
  const myId = app.globalData.userInfo?._id || wx.getStorageSync('openid')
  
  if (inviterId === myId) return
  
  const invitedKey = `invited_${inviterId}`
  if (wx.getStorageSync(invitedKey)) return
  
  // 查询邀请者的邀请次数，计算阶梯奖励
  wx.cloud.callFunction({
    name: 'getInviteCount',
    data: { userId: inviterId }
  }).then(res => {
    const inviteCount = res.result?.count || 0
    const reward = getInviteReward(inviteCount + 1)
    
    // 给邀请者加金币（含阶梯）
    wx.cloud.callFunction({
      name: 'addCoins',
      data: {
        userId: inviterId,
        amount: reward,
        type: 'invite_reward',
        description: '邀请好友奖励'
      }
    })
  }).catch(() => {
    // 降级：给基础奖励
    wx.cloud.callFunction({
      name: 'addCoins',
      data: {
        userId: inviterId,
        amount: INVITE_RULES.baseReward,
        type: 'invite_reward',
        description: '邀请好友奖励'
      }
    })
  })
  
  // 给被邀请者加金币
  wx.cloud.callFunction({
    name: 'addCoins',
    data: {
      userId: myId,
      amount: INVITE_RULES.inviteeReward,
      type: 'invitee_bonus',
      description: '通过好友邀请加入奖励'
    }
  })
  
  wx.setStorageSync(invitedKey, true)
  
  wx.showToast({
    title: `获得 ${INVITE_RULES.inviteeReward} 金币！`,
    icon: 'success',
    duration: 2000
  })
}

// ========== 生成分享文案（扩充版）==========
const SHARE_TEXTS = [
  '🎁 送你金币啦！来草原爱宠营遛狗赚金币换零食',
  '🐕 我家狗子在这儿赚了好多金币，你也快来！',
  '🐂 配料表只有肉的宠物零食，挖到宝藏了！',
  '🏆 草原狗狗大赛报名中，3天2晚蒙古包+烤全羊',
  '💰 遛狗发视频就能赚金币，真金白银换肉干',
  '🌅 每天签到领金币，连续7天送大礼包',
  '🔥 邀请好友各得200金币，多邀多得上不封顶',
  '🎯 每周邀请榜前10额外奖励，来挑战我！',
  '✨ 带狗来草原撒野，3天2晚才1780全包',
  '🐾 0添加0诱食剂，牛香香牛肝干狗狗超爱吃',
  '📸 晒出你家毛孩子，点赞越多金币越多',
  '💪 今日已赚50金币，你的狗子今天遛了吗？'
]

function randomShareText() {
  return SHARE_TEXTS[Math.floor(Math.random() * SHARE_TEXTS.length)]
}

// ========== 获取奖励说明文案（用于页面展示）==========
function getRewardDescription() {
  let desc = `邀请好友：每人得 ${INVITE_RULES.baseReward}~${INVITE_RULES.baseReward + INVITE_RULES.tierBonus[INVITE_RULES.tierBonus.length-1].bonus} 金币\n`
  desc += `被邀请好友得 ${INVITE_RULES.inviteeReward} 金币\n`
  desc += `分享到群额外 +${INVITE_RULES.groupShareBonus} 金币\n`
  desc += `连续分享 ${Object.keys(INVITE_RULES.consecutiveBonus).join('/')} 天额外奖励`
  if (EVENT_MODE.active) {
    desc += `\n🔥 活动期间 ${EVENT_MODE.multiplier} 倍奖励！`
  }
  return desc
}

module.exports = {
  SHARE_TEMPLATES,
  INVITE_RULES,
  EVENT_MODE,
  onShare,
  trackShare,
  handleInvite,
  getInviteReward,
  randomShareText,
  getRewardDescription,
  getConsecutiveDays
}
