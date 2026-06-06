const app = getApp()

Page({
  data: {
    userInfo: {
      nickname: '草原爱犬者',
      avatar: '🐾',
      tierName: '普通会员',
      coins: 0,
      totalEarned: 0,
      commission: 0,
      inviteCount: 0
    },
    petInfo: { emoji: '🐶', name: '未设置', breed: '', age: '' },
    isLogin: false
  },

  onLoad() { this.refreshData() },
  onShow() { this.refreshData() },

  refreshData() {
    const user = app.globalData.userInfo || wx.getStorageSync('user') || {}
    const coins = app.globalData.coins || user.coins || 0
    const isLogin = app.globalData.isLogin || !!wx.getStorageSync('user')
    
    this.setData({
      isLogin: isLogin,
      userInfo: {
        nickname: user.nickname || '草原爱犬者',
        avatar: (user.nickname || '草').charAt(0),
        tierName: user.tier || (coins >= 5000 ? '钻石会员' : coins >= 2000 ? '金卡会员' : coins >= 500 ? '银卡会员' : '普通会员'),
        coins: coins,
        totalEarned: user.totalEarned || coins,
        commission: user.commission || 0,
        inviteCount: user.inviteCount || 0
      },
      petInfo: {
        emoji: '🐶',
        name: (user.petInfo && user.petInfo.name) || '未设置',
        breed: (user.petInfo && user.petInfo.breed) || '',
        age: (user.petInfo && user.petInfo.age) || ''
      }
    })
  },

  onLogin() {
    const that = this
    wx.showModal({
      title: '设置昵称',
      editable: true,
      placeholderText: '输入你的昵称',
      success: async (res) => {
        if (res.confirm && res.content) {
          app.globalData.isLogin = true
          app.globalData.userInfo = { ...app.globalData.userInfo, nickname: res.content }
          that.refreshData()
          wx.showToast({ title: '登录成功！500金币已到账', icon: 'success' })
        }
      }
    })
  },

  onPet() {
    const that = this
    wx.showActionSheet({
      itemList: ['设置宠物信息', '查看宠物档案'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '宠物信息',
            editable: true,
            placeholderText: '品种 名字 年龄 (如: 金毛 豆豆 2岁)',
            success: (r) => {
              if (r.confirm && r.content) {
                const parts = r.content.split(' ')
                const pet = { name: parts[1] || parts[0], breed: parts[0], age: parts[2] || '' }
                app.globalData.petInfo = pet
                that.refreshData()
                wx.showToast({ title: '宠物信息已保存', icon: 'success' })
              }
            }
          })
        }
      }
    })
  },

  onOrders() {
    wx.showToast({ title: '订单功能开发中，敬请期待', icon: 'none' })
  },

  onAddress() {
    wx.showToast({ title: '收货地址管理开发中', icon: 'none' })
  },

  onCommunity() { 
    wx.navigateTo({ url: '/pages/community/community' })
  },

  onPartner() { 
    wx.navigateTo({ url: '/pages/partner/partner' })
  },

  onEvent() {
    wx.switchTab({ url: '/pages/event/event' })
  },

  onService() {
    wx.showModal({
      title: '联系客服',
      content: '微信: 草原爱宠营宠物零食\n电话: 13145294218\n时间: 9:00-21:00',
      confirmText: '复制微信号',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({ data: '草原爱宠营宠物零食' })
          wx.showToast({ title: '微信号已复制', icon: 'success' })
        }
      }
    })
  },

  onAbout() {
    wx.showModal({
      title: '关于草原爱宠营',
      content: '锡林郭勒草原自有工厂\n人食标准做宠物零食\n草原人宠互动大赛主办方\n\n一个人在做，多包涵🐾',
      showCancel: false
    })
  }
})