const app = getApp()

Page({
  data: { isReviewMode: true },
  onLoad(options) {
    const config = app.globalData.config || {};
    this.setData({ isReviewMode: !config.ugc_enabled });
    if (config.ugc_enabled) {
      wx.redirectTo({ url: '/pages/webview/webview?page=upload' });
      return;
    }
  },
  onShareAppMessage() {
    return { title: '草原爱宠营', path: '/pages/index/index' };
  }
})