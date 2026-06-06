const api = require('../../utils/cloud-api')

Page({
  data: { stats: {} },
  onLoad() { this.refreshStats() },

  async refreshStats() {
    wx.showLoading({ title: '加载中' })
    try {
      const stats = await api.getAdminStats()
      this.setData({ stats })
    } catch(e) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
    wx.hideLoading()
  },

  async initDB() {
    wx.showLoading({ title: '初始化中' })
    try {
      const res = await api.initDatabase()
      wx.showToast({ title: res.message || '初始化成功', icon: 'success' })
      this.refreshStats()
    } catch(e) {
      wx.showToast({ title: '初始化失败', icon: 'none' })
    }
    wx.hideLoading()
  }
})
