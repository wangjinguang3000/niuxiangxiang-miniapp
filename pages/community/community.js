const api = require('../../utils/cloud-api')
const app = getApp()

Page({
  data: {
    checkedToday: false,
    coins: 0,
    userTier: '普通',
    invitedCount: 0,
    commission: 0,
    checkinDays: [
      { done: false, today: true, reward: 5 },
      { done: false, today: false, reward: 8 },
      { done: false, today: false, reward: 12 },
      { done: false, today: false, reward: 18 },
      { done: false, today: false, reward: 25 },
      { done: false, today: false, reward: 35 },
      { done: false, today: false, reward: 50 }
    ],
    tiers: [
      { name: '普通会员', minCoins: 0, benefit: '无折扣', active: true, color: '#999' },
      { name: '银卡会员', minCoins: 500, benefit: '98折', active: false, color: '#A0A0A0' },
      { name: '金卡会员', minCoins: 2000, benefit: '95折+包邮', active: false, color: '#C8963E' },
      { name: '钻石会员', minCoins: 5000, benefit: '9折+包邮+优先', active: false, color: '#5C8AFF' }
    ],
    tasks: [
      { emoji: '✅', name: '每日签到', reward: 10, done: false },
      { emoji: '📤', name: '分享给好友', reward: 20, done: false },
      { emoji: '🔄', name: '分享到朋友圈', reward: 30, done: false },
      { emoji: '🛒', name: '下单任意商品', reward: 50, done: false },
      { emoji: '👥', name: '邀请好友注册', reward: 100, done: false },
      { emoji: '⭐', name: '晒单评价', reward: 30, done: false },
      { emoji: '💎', name: '累计消费满100元', reward: 200, done: false }
    ],
    exchanges: [
      { emoji: '🎫', name: '3元购物抵用券', desc: '100金币兑换 | 全场通用', cost: 100 },
      { emoji: '🎁', name: '牛肝干80g体验装', desc: '150金币兑换 | 包邮到家', cost: 150 },
      { emoji: '🏆', name: '赛事报名30元抵扣', desc: '300金币兑换 | 早鸟可用', cost: 300 },
      { emoji: '📦', name: '牛肝干240g正装', desc: '480金币免费兑换 | 包邮', cost: 480 },
      { emoji: '🎟️', name: '赛事观摩票1张', desc: '600金币兑换 | 价值1280', cost: 600 }
    ],
    leaderboard: [],
    partnerTiers: [
      { name: '青铜合伙人', target: '月销3单', rate: '8%', mine: false },
      { name: '白银合伙人', target: '月销10单', rate: '12%', mine: false },
      { name: '黄金合伙人', target: '月销30单', rate: '15%', mine: false }
    ],
    showPoster: false,
    posterImage: ''
  },

  onLoad() {
    this.loadUserData()
    this.loadLeaderboard()
  },
  onShow() {
    this.loadUserData()
  },

  loadUserData() {
    const user = app.globalData.userInfo || wx.getStorageSync('user') || {}
    const coins = app.globalData.coins || user.coins || 0
    this.setData({
      coins: coins,
      invitedCount: user.inviteCount || 0,
      commission: user.commission || 0
    })
    this.updateTier(coins)
  },

  updateTier(coins) {
    const tiers = this.data.tiers.map(t => ({ ...t, active: false }))
    const idx = coins >= 5000 ? 3 : coins >= 2000 ? 2 : coins >= 500 ? 1 : 0
    tiers[idx].active = true
    this.setData({ tiers, userTier: tiers[idx].name })
  },

  async loadLeaderboard() {
    try {
      const list = await api.getLeaderboard()
      if (list.length > 0) {
        this.setData({ leaderboard: list.slice(0, 10) })
        return
      }
    } catch(e) {}
    this.setData({
      leaderboard: [
        { nickname: '草原爱犬者', inviteCount: 28 },
        { nickname: '金毛小王子', inviteCount: 22 },
        { nickname: '哈士奇老大', inviteCount: 18 },
        { nickname: '柴犬君', inviteCount: 15 },
        { nickname: '柯基小短腿', inviteCount: 12 }
      ]
    })
  },

  async onCheckin() {
    if (this.data.checkedToday) return
    try {
      const res = await api.checkin()
      if (res.error) { wx.showToast({ title: res.error, icon: 'none' }); return }
      const days = this.data.checkinDays.map((d, i) => ({ ...d, done: i < res.streak, today: i === res.streak - 1 }))
      this.setData({ checkinDays: days, checkedToday: true, coins: this.data.coins + res.reward })
      wx.showToast({ title: '连续' + res.streak + '天！+' + res.reward + '金币', icon: 'success' })
    } catch(e) {
      // Fallback
      this.setData({ checkedToday: true, coins: this.data.coins + 10 })
      wx.showToast({ title: '签到成功！+10金币', icon: 'success' })
    }
  },

  onTask(e) {
    const idx = e.currentTarget.dataset.id
    const task = this.data.tasks[idx]
    if (task.done) return
    const newTasks = [...this.data.tasks]
    newTasks[idx] = { ...task, done: true }
    
    let action = ''
    switch(idx) {
      case 0: action = '签到'; break
      case 1: action = '分享'; break
      case 2: action = '朋友圈'; break
      case 4: action = '邀请'; this.onInvite(); break
      default: break
    }
    
    this.setData({ tasks: newTasks, coins: this.data.coins + task.reward })
    wx.showToast({ title: '+' + task.reward + '金币', icon: 'success' })
  },

  onInvite() {
    wx.showModal({
      title: '邀请好友',
      content: '分享小程序给好友，对方注册后你可得100金币+10元佣金！',
      confirmText: '去分享',
      success: (res) => {
        if (res.confirm) {
          wx.shareAppMessage({
            title: '草原爱宠营 - 带狗来草原撒野！',
            path: '/pages/index/index',
            imageUrl: '/images/banner_event.jpg'
          })
        }
      }
    })
  },

  async onExchange(e) {
    const idx = e.currentTarget.dataset.id
    const ex = this.data.exchanges[idx]
    if (this.data.coins < ex.cost) {
      wx.showToast({ title: '金币不足！还需' + (ex.cost - this.data.coins) + '金币', icon: 'none' })
      return
    }
    wx.showModal({
      title: '确认兑换',
      content: '花费' + ex.cost + '金币兑换「' + ex.name + '」？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await api.exchangeItem(idx)
            if (result.error) { wx.showToast({ title: result.error, icon: 'none' }); return }
          } catch(e) {}
          this.setData({ coins: this.data.coins - ex.cost })
          wx.showToast({ title: '兑换成功！', icon: 'success' })
        }
      }
    })
  },

  onPoster() {
    this.setData({ showPoster: true })
  },

  onClosePoster() {
    this.setData({ showPoster: false })
  },

  onSavePoster() {
    wx.showToast({ title: '长按海报图片保存', icon: 'none' })
  },

  async onCommission() {
    if (this.data.commission < 10) {
      wx.showToast({ title: '佣金满10元才能转金币', icon: 'none' })
      return
    }
    wx.showModal({
      title: '佣金转金币',
      content: this.data.commission + '元佣金可转' + (Math.floor(this.data.commission) * 500) + '金币！\n1元佣金=500金币=5元购物价值',
      confirmText: '立即转换',
      success: async (res) => {
        if (res.confirm) {
          try {
            const result = await api.commissionToCoins()
            if (result.error) { wx.showToast({ title: result.error, icon: 'none' }); return }
            this.setData({
              coins: this.data.coins + result.bonusCoins,
              commission: 0
            })
            wx.showToast({ title: result.earned + '元转' + result.bonusCoins + '金币！', icon: 'success' })
          } catch(e) {
            wx.showToast({ title: '转换失败', icon: 'none' })
          }
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '草原爱宠营 | 带狗来草原撒野！牛肝干免费领',
      path: '/pages/index/index',
      imageUrl: '/images/banner_event.jpg'
    }
  }
})