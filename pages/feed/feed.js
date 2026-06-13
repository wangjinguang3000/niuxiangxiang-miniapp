const app = getApp()

Page({
  data: { isReviewMode: true },
  onLoad(options) {
    const config = app.globalData.config || {};
    this.setData({ isReviewMode: !config.ugc_enabled });
    if (config.ugc_enabled) {
      wx.redirectTo({ url: '/pages/webview/webview?page=feed' });
    }
  },
  onGoEvent() { wx.switchTab({ url: '/pages/event/event' }); },
  onGoShop() { wx.switchTab({ url: '/pages/products/products' }); },
  onShareAppMessage() {
    return { title: '草原爱宠营 - 带狗来草原撒野！', path: '/pages/index/index' };
  }
})