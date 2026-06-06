/**
 * 分享裂变引擎 - 小程序增长核心
 * 
 * 机制说明：
 * 1. 用户分享 → 好友通过分享进入 → 双方各得金币
 * 2. 阶梯奖励：分享次数越多，单次奖励越高
 * 3. 排行榜：每周分享达人TOP10额外奖励
 */

const app = getApp()

// ========== 分享卡片配置 ==========
const SHARE_TEMPLATES = {
  // 首页分享
  home: {
    title: '🐂 草原爱宠营 | 带狗来草原撒野！遛狗就能赚金币',
    path: '/pages/index/index',
    imageUrl: '/images/share-card.jpg'
  },
  // 赛事分享
  event: {
    title: '🏆 草原人宠互动季报名中！3天2晚蒙古包+烤全羊',
    path: '/pages/event/event',
    imageUrl: '/images/share-card.jpg'
  },
  // 产品分享
  product: (product) => ({
    title: `🐾 ${product.name || '牛肝干'} | 配料表只有新鲜牛肝，人食标准`,
    path: `/pages/products/products?id=${product._id || product.id || ''}`,
    imageUrl: product.image || '/images/share-card.jpg'
  }),
  // 视频内容分享
  feed: (item) => ({
    title: item.title || '草原上的狗狗太快乐了！',
    path: `/pages/feed/feed?videoId=${item._id || item.id || ''}`,
    imageUrl: item.coverUrl || '/images/share-card.jpg'
  }),
  // 金币邀请
  invite: (userId) => ({
    title: '🎁 送你500金币！来草原爱宠营一起遛狗赚金币',
    path: `/pages/index/index?inviter=${userId}`,
    imageUrl: '/images/share-card.jpg'
  }),
  // 日常互动
  daily: {
    title: '今天遛狗了吗？来草原爱宠营打卡赚金币！',
    path: '/pages/feed/feed',
    imageUrl: '/images/share-card.jpg'
  }
}

// ========== 邀请奖励规则 ==========
const INVITE_RULES = {
  baseReward: 50,        // 基础邀请奖励
  inviteeReward: 100,    // 被邀请者奖励
  dailyLimit: 10,        // 每日邀请上限
  tierBonus: [           // 阶梯奖励(0-based索引 = 第N次-1)
    { count: 1, bonus: 0 },      // 第1次：基础50
    { count: 3, bonus: 20 },     // 第3次起：50+20=70
    { count: 5, bonus: 50 },     // 第5次起：50+50=100
    { count: 10, bonus: 100 }    // 第10次起：50+100=150
  ]
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
  } catch(e) {
    console.log('Share tracking:', e)
  }
}

// ========== 处理邀请参数（在app.onLaunch或首页onLoad中调用）==========
function handleInvite(options) {
  if (!options || !options.inviter) return
  
  const inviterId = options.inviter
  const myId = app.globalData.userInfo?._id || wx.getStorageSync('openid')
  
  // 防止自己邀请自己
  if (inviterId === myId) return
  
  // 检查是否已经领过
  const invitedKey = `invited_${inviterId}`
  if (wx.getStorageSync(invitedKey)) return
  
  // 给邀请者加金币
  wx.cloud.callFunction({
    name: 'addCoins',
    data: {
      userId: inviterId,
      amount: INVITE_RULES.baseReward,
      type: 'invite_reward',
      description: '邀请好友奖励'
    }
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
  
  // 弹窗提示
  wx.showToast({
    title: `获得${INVITE_RULES.inviteeReward}金币！`,
    icon: 'success',
    duration: 2000
  })
}

// ========== 计算阶梯奖励 ==========
function getInviteBonus(inviteCount) {
  let bonus = INVITE_RULES.baseReward
  for (let i = INVITE_RULES.tierBonus.length - 1; i >= 0; i--) {
    if (inviteCount >= INVITE_RULES.tierBonus[i].count) {
      bonus += INVITE_RULES.tierBonus[i].bonus
      break
    }
  }
  return bonus
}

// ========== 生成分享文案（随机避免审美疲劳）==========
const SHARE_TEXTS = [
  '一起来草原爱宠营遛狗赚金币！🐕',
  '我家狗子在这儿赚了好多金币，你也来！',
  '遛狗发视频就能换牛肝干，真香！',
  '草原上的狗狗大赛太好玩了，一起报名？',
  '配料表只有肉的宠物零食，我找到宝藏了！',
  '带狗来草原撒野，3天2晚才这个价...'
]

function randomShareText() {
  return SHARE_TEXTS[Math.floor(Math.random() * SHARE_TEXTS.length)]
}

module.exports = {
  SHARE_TEMPLATES,
  INVITE_RULES,
  trackShare,
  handleInvite,
  getInviteBonus,
  randomShareText
}