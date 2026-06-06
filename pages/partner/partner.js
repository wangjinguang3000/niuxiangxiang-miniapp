Page({
  data: {
    tiers: [
      {
        name: '青铜合伙人',
        icon: '🥉',
        target: '月销3单',
        commission: '8%',
        benefits: ['基础佣金8%', '专属推广海报', '社群培训资料'],
        color: '#CD7F32'
      },
      {
        name: '白银合伙人',
        icon: '🥈',
        target: '月销10单',
        commission: '12%',
        benefits: ['佣金提升至12%', '新品优先体验', '赛事门票折扣', '专属客服'],
        color: '#A0A0A0',
        recommended: true
      },
      {
        name: '黄金合伙人',
        icon: '🥇',
        target: '月销30单',
        commission: '15%',
        benefits: ['最高15%佣金', '区域独家代理权', '品牌联名授权', '赛事赞助名额', '年终分红奖励'],
        color: '#C8963E'
      }
    ],
    faq: [
      { q: '怎么成为合伙人？', a: '点击下方申请按钮，填写信息，客服24小时内联系您开通' },
      { q: '佣金怎么结算？', a: '月结，每月5号结算上月佣金。满10元即可提现。也可1:500转金币兑换商品更划算' },
      { q: '需要囤货吗？', a: '不需要！一件代发，0库存0风险。工厂直发包邮到客户手中' },
      { q: '有区域限制吗？', a: '青铜/白银不限区域，黄金合伙人享受指定区域独家保护' },
      { q: '产品售后怎么办？', a: '7天无理由退换，工厂承担售后。您只管推广，我们负责产品' }
    ],
    showForm: false,
    formData: { name: '', phone: '', channel: '' }
  },

  onApply() {
    this.setData({ showForm: true })
  },

  onCloseForm() {
    this.setData({ showForm: false })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ ['formData.' + field]: e.detail.value })
  },

  onSubmit() {
    const { name, phone, channel } = this.data.formData
    if (!name || !phone) {
      wx.showToast({ title: '请填写姓名和电话', icon: 'none' })
      return
    }
    this.setData({ showForm: false })
    wx.showToast({ title: '申请已提交！24小时内联系您', icon: 'success' })
  },

  onShareAppMessage() {
    return {
      title: '草原爱宠营城市合伙人招募！0库存0风险，佣金高达15%',
      path: '/pages/partner/partner'
    }
  }
})