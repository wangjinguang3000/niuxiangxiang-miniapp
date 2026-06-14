const app = getApp()
const api = require('../../utils/cloud-api')
const viral = require('../../utils/viral-engine')

Page({
  data: {
    marqueeText: '签到领金币：每日签到+10 连续签到翻倍 | 推荐好友各得80~380金币 | 人宠互动赛报名中',
    banners: [
      { emoji: '\u{1F3C6}', title: '草原人宠互动季S1', sub: '火热报名中！仅剩17组', bg: 'linear-gradient(135deg,#FF6B35,#F7931E)', link: '/pages/event/event' },
      { emoji: '\u{1F415}', title: '互动赚金币', sub: '签到推荐都能赚', bg: 'linear-gradient(135deg,#1a1a2e,#0f3460)', link: '/pages/feed/feed' },
      { emoji: '\u{1F3C5}', title: '人宠互动预选赛', sub: '月度主题赛 评选赢大奖', bg: 'linear-gradient(135deg,#5C8A45,#3D6B2E)', link: '/pages/contest/contest' },
      { emoji: '\u{1F969}', title: '牛肝干系列', sub: '高原散养 0添加 犬猫通用', bg: 'linear-gradient(135deg,#C8963E,#8B5E3C)', link: '/pages/products/products' }
    ],
    categories: [
      { emoji: '\u{1F3C6}', name: '赛事报名', path: '/pages/event/event' },
      { emoji: '\u{1F415}', name: '爱宠互动', path: '/pages/feed/feed' },
      { emoji: '\u{1F3C5}', name: '预选赛', path: '/pages/contest/contest' },
      { emoji: '\u{1F969}', name: '牛肝干系列', path: '/pages/products/products' }
    ],
    earlyLeft: 17, hotProducts: []
  },
  onLoad(options) {
    this.loadProducts()
    // 处理推荐参数
    viral.handleInvite(options)
  },
  onShow() { this.loadProducts() },

  // ===== 推荐裂变 =====
  onShareAppMessage() {
    const userId = app.globalData.userInfo?._id || ''
    return viral.SHARE_TEMPLATES.invite(userId)
  },
  onShareTimeline() {
    return {
      title: viral.randomShareText(),
      query: '',
      imageUrl: '/images/thumb_tab-event.png'
    }
  },

  async loadProducts() {
    try {
      const products = await api.getProducts()
      if (products.length > 0) { this.setData({ hotProducts: products.slice(0, 4) }); return }
    } catch(e) {}
    this.setData({
      hotProducts: [
        { id: 1, name: '风干牛肝干 80g', price: '16.00', marketPrice: '29.90', emoji: '\u{1F969}', bgColor: '#8B5E3C', tagType: 'hot', tagText: '热卖', desc: '犬猫通用 | 高原散养 | 0添加' },
        { id: 2, name: '风干牛肝干 240g', price: '48.00', marketPrice: '79.90', emoji: '\u{1F381}', bgColor: '#8B5E3C', tagType: 'new', tagText: '推荐', desc: '家庭装 | 训练奖励最佳' },
        { id: 3, name: '风干牛肝干 480g 礼盒', price: '88.00', marketPrice: '149.00', emoji: '\u{1F4E6}', bgColor: '#8B5E3C', tagType: 'new', tagText: '礼盒', desc: '送礼佳品 | 草原直供' },
        { id: 4, name: '牛香香风干牛肉干', price: '68.00', marketPrice: '', emoji: '\u{1F402}', bgColor: '#5C8A45', tagType: 'new', tagText: '新品', desc: '人食级 | 草原黄牛 | 香辣/五香' }
      ]
    })
  },
  onBanner(e) {
    const link = e.currentTarget.dataset.link
    if (link.includes('/pages/event') || link.includes('/pages/products')) { wx.switchTab({ url: link }) }
    else { wx.navigateTo({ url: link }) }
  },
  onCate(e) {
    const path = e.currentTarget.dataset.path
    if (path.includes('/pages/event') || path.includes('/pages/products')) { wx.switchTab({ url: path }) }
    else { wx.navigateTo({ url: path }) }
  },
  onEvent() { wx.switchTab({ url: '/pages/event/event' }) },
  onDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }) },
  onPartner() { wx.navigateTo({ url: '/pages/partner/partner' }) },
  onWheel() { wx.switchTab({ url: '/pages/community/community' }); },
  onBargain() { wx.switchTab({ url: '/pages/event/event' }); },
  onFlash() { wx.switchTab({ url: '/pages/products/products' }); },
  onTask() { wx.navigateTo({ url: '/pages/community/community' }) }
})