const app = getApp()

Page({
  data: { isReviewMode: true },
  onShow() { this.checkUGC(); },
  onLoad(options) {
    if (this.checkUGC()) return;

  },
  
  checkUGC() {
    const config = getApp().globalData.config || wx.getStorageSync('config') || {};
    if (config.ugc_enabled) {
      wx.redirectTo({ url: '/pages/webview/webview?page=upload' });
      return true;
    }
    return false;
  },
  onShareAppMessage() {
    return { title: '草原爱宠营', path: '/pages/index/index' };
  }
})