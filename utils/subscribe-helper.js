/**
 * 订阅消息助手 - 用户召回神器
 * 
 * 微信小程序订阅消息规则：
 * 1. 用户主动点击按钮触发订阅
 * 2. 一次性订阅：用户授权一次，发送一条
 * 3. 长期订阅：需特殊类目审批
 * 
 * 模板ID需要在微信公众平台 → 小程序 → 订阅消息 → 选用模板后获得
 */

// ===== 订阅模板配置（需在微信公众平台选用模板后替换templateId）=====
const TEMPLATES = {
  // 签到提醒
  checkin: {
    templateId: '', // TODO: 微信公众平台选用"签到提醒"模板
    title: '每日签到提醒',
    fields: ['签到时间', '获得金币', '连续签到天数'],
    trigger: 'daily' // 每天触发
  },
  // 赛事通知
  eventNotice: {
    templateId: '', // TODO: 微信公众平台选用"活动通知"模板
    title: '赛事动态通知',
    fields: ['赛事名称', '通知内容', '通知时间'],
    trigger: 'manual'
  },
  // 订单状态
  orderUpdate: {
    templateId: '', // TODO: 微信公众平台选用"订单状态"模板
    title: '订单状态更新',
    fields: ['订单编号', '订单状态', '更新时间'],
    trigger: 'auto' // 自动触发
  },
  // 互动提醒
  interaction: {
    templateId: '', // TODO: 微信公众平台选用"互动提醒"模板
    title: '有人互动了你的内容',
    fields: ['互动类型', '互动用户', '互动时间'],
    trigger: 'auto'
  },
  // 金币到账
  coinEarned: {
    templateId: '', // TODO: 微信公众平台选用"收益到账"模板
    title: '金币到账通知',
    fields: ['获得金币', '获取方式', '到账时间'],
    trigger: 'auto'
  }
}

// ===== 订阅请求 =====
function requestSubscribe(scene) {
  const tmplIds = []
  
  switch(scene) {
    case 'checkin':
      tmplIds.push(TEMPLATES.checkin.templateId)
      break
    case 'event':
      tmplIds.push(TEMPLATES.eventNotice.templateId)
      break
    case 'product':
      tmplIds.push(TEMPLATES.orderUpdate.templateId, TEMPLATES.coinEarned.templateId)
      break
    case 'all':
      Object.values(TEMPLATES).forEach(t => {
        if (t.templateId) tmplIds.push(t.templateId)
      })
      break
  }
  
  const validIds = tmplIds.filter(id => id)
  if (validIds.length === 0) {
    console.log('No template IDs configured for scene:', scene)
    return Promise.resolve()
  }
  
  return new Promise((resolve) => {
    wx.requestSubscribeMessage({
      tmplIds: validIds,
      success(res) {
        // res[templateId] = 'accept' | 'reject' | 'ban'
        const accepted = Object.entries(res).filter(([_, v]) => v === 'accept').length
        console.log(`Subscribe result: ${accepted}/${validIds.length} accepted`)
        resolve(res)
      },
      fail(err) {
        console.log('Subscribe failed:', err)
        resolve(null)
      }
    })
  })
}

// ===== 在关键操作点触发订阅 =====

// 签到后弹出订阅
function subscribeAfterCheckin() {
  requestSubscribe('checkin')
}

// 报名赛事后弹出订阅
function subscribeAfterRegister() {
  requestSubscribe('event')
}

// 下单后弹出订阅
function subscribeAfterOrder() {
  requestSubscribe('product')
}

// 首次进入时引导（不要频繁弹出！每次会话最多1次）
let hasShownSubscribePrompt = false
function smartSubscribePrompt() {
  if (hasShownSubscribePrompt) return
  hasShownSubscribePrompt = true
  
  wx.showModal({
    title: '开启消息通知',
    content: '开启后可接收签到提醒、赛事通知、金币到账提醒。不会骚扰你，一天最多1条。',
    confirmText: '开启',
    cancelText: '暂不',
    success(res) {
      if (res.confirm) {
        requestSubscribe('all')
      }
    }
  })
}

module.exports = {
  TEMPLATES,
  requestSubscribe,
  subscribeAfterCheckin,
  subscribeAfterRegister,
  subscribeAfterOrder,
  smartSubscribePrompt
}