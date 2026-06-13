const app = getApp()

Page({
  data: { isReviewMode: true },
  onShow() { this.checkUGC(); },
  onLoad(options) {
    if (this.checkUGC()) return;

  },
  onGoEvent() { wx.switchTab({ url: '/pages/event/event' }); },
  onGoShop() { wx.switchTab({ url: '/pages/products/products' }); },
  
  checkUGC() {
    const config = getApp().globalData.config || wx.getStorageSync('config') || {};
    if (config.ugc_enabled) {
      wx.redirectTo({ url: '/pages/webview/webview?page=feed' });
      return true;
    }
    return false;
  },
  onShareAppMessage() {
    return { title: '草原爱宠营 - 带狗来草原撒野！', path: '/pages/index/index' };
  }
})