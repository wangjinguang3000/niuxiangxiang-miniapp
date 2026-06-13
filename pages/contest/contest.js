const app = getApp()
const api = require('../../utils/cloud-api')

Page({
  data: { isReviewMode: true, currentContest: null, countdown: '' },
  onShow() { this.checkUGC(); },
  onLoad(options) {
    if (this.checkUGC()) return;
    this.loadContests();
  },
  async loadContests() {
    try {
      const contests = await api.getContests();
      if (contests.length > 0) {
        this.setData({ currentContest: contests[0] });
        if (contests[0].submitEnd) this.startCountdown(new Date(contests[0].submitEnd));
      }
    } catch(e) {}
  },
  startCountdown(target) {
    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { this.setData({ countdown: '已开始' }); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      this.setData({ countdown: d + '天' + h + '小时' });
    };
    tick();
    setInterval(tick, 60000);
  },
  
  checkUGC() {
    const config = getApp().globalData.config || wx.getStorageSync('config') || {};
    if (config.ugc_enabled) {
      wx.redirectTo({ url: '/pages/webview/webview?page=contest' });
      return true;
    }
    return false;
  },
  onShareAppMessage() {
    return { title: '草原人宠互动季S1 - 火热报名中！', path: '/pages/event/event' };
  }
})