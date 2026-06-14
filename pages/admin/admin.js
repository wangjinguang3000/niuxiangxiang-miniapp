const api = require('../../utils/cloud-api')

Page({
  data: { 
    stats: {},
    ugcEnabled: false,
    reviewMode: true
  },

  onLoad() { 
    this.refreshStats();
    this.loadUgcStatus();
  },

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
  },

  // ===== 暗度陈仓：UGC开关 =====
  async loadUgcStatus() {
    try {
      const config = await api.getConfig();
      if (config) {
        this.setData({ 
          ugcEnabled: config.ugc_enabled === true,
          reviewMode: config.review_mode !== false
        });
      }
    } catch(e) {
      console.log('[Admin] Config load failed:', e.message);
    }
  },

  async onToggleUGC(e) {
    const enabled = e.detail.value;
    wx.showModal({
      title: enabled ? '确认开启UGC？' : '确认关闭UGC？',
      content: enabled 
        ? '互动板块将切换到完整功能' 
        : '互动板块将切换到审核安全模式',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.toggleUGC(enabled);
            this.setData({ ugcEnabled: enabled });
            // 同步更新全局配置
            const app = getApp();
            if (app.globalData.config) {
              app.globalData.config.ugc_enabled = enabled;
            }
            wx.showToast({ title: 'UGC已' + (enabled ? '开启' : '关闭'), icon: 'success' });
          } catch(e) {
            wx.showToast({ title: '操作失败', icon: 'none' });
          }
        }
      }
    });
  },

  // 审核模式切换
  async onToggleReview(e) {
    const reviewMode = e.detail.value;
    try {
      await api.setConfig({ review_mode: reviewMode });
      this.setData({ reviewMode });
      wx.showToast({ title: '审核模式已' + (reviewMode ? '开启' : '关闭'), icon: 'success' });
    } catch(e) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  }
})