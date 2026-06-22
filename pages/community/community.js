const api = require('../../utils/cloud-api')
const configReader = require('../../utils/config-reader')
const app = getApp()

Page({
  data: {
    isReviewMode: true,
    checkedToday: false, coins: 0, userTier: '普通',
    checkinDays: [
      { done: false, today: true, reward: 5 },
      { done: false, today: false, reward: 8 },
      { done: false, today: false, reward: 12 },
      { done: false, today: false, reward: 18 },
      { done: false, today: false, reward: 25 },
      { done: false, today: false, reward: 35 },
      { done: false, today: false, reward: 50 }
    ],
    exchanges: [
      { emoji: '🎫', name: '3元购物抵用券', desc: '100金币兑换 | 全场通用', cost: 100 },
      { emoji: '🎁', name: '牛肝干80g体验装', desc: '150金币兑换 | 包邮到家', cost: 150 },
      { emoji: '🏆', name: '赛事报名30元抵扣', desc: '300金币兑换 | 早鸟可用', cost: 300 },
      { emoji: '📦', name: '牛肝干240g正装', desc: '480金币免费兑换 | 包邮', cost: 480 },
      { emoji: '🎟', name: '赛事观摩票1张', desc: '600金币兑换 | 价值1280', cost: 600 }
    ]
  },
  onLoad(options) {
    this.checkUGC().then(function(skip) { if (!skip) this.loadUserData(); }.bind(this));
  },
  onShow() { this.checkUGC().then(function(skip) { if (!skip) this.loadUserData(); }.bind(this)); },
  loadUserData() {
    const user = app.globalData.userInfo || wx.getStorageSync('user') || {};
    const coins = app.globalData.coins || user.coins || 0;
    this.setData({ coins });
    this.updateTier(coins);
  },
  updateTier(coins) {
    const idx = coins >= 5000 ? 3 : coins >= 2000 ? 2 : coins >= 500 ? 1 : 0;
    const names = ['普通会员','银卡会员','金卡会员','钻石会员'];
    this.setData({ userTier: names[idx] });
  },
  async onCheckin() {
    if (this.data.checkedToday) return;
    try {
      const res = await api.checkin();
      if (res.error) { wx.showToast({ title: res.error, icon: 'none' }); return; }
      const days = this.data.checkinDays.map((d,i) => ({...d, done: i < res.streak, today: i === res.streak - 1}));
      this.setData({ checkinDays: days, checkedToday: true, coins: this.data.coins + res.reward });
      wx.showToast({ title: '连续' + res.streak + '天！+' + res.reward + '金币', icon: 'success' });
    } catch(e) {
      this.setData({ checkedToday: true, coins: this.data.coins + 10 });
      wx.showToast({ title: '签到成功！+10金币', icon: 'success' });
    }
  },
  async onExchange(e) {
    const idx = e.currentTarget.dataset.id;
    const ex = this.data.exchanges[idx];
    if (this.data.coins < ex.cost) {
      wx.showToast({ title: '金币不足！', icon: 'none' }); return;
    }
    wx.showModal({
      title: '确认兑换',
      content: '花费' + ex.cost + '金币兑换 ' + ex.name + ' ？',
      success: async (res) => {
        if (res.confirm) {
          try { await api.exchangeItem(idx); } catch(e) {}
          this.setData({ coins: this.data.coins - ex.cost });
          wx.showToast({ title: '兑换成功！', icon: 'success' });
        }
      }
    });
  },
  
  async checkUGC() {
    // 第1优先：本地存储（秒开，离线也能用）
    var storageKey = 'nx_ugc_enabled';
    var local = wx.getStorageSync(storageKey);
    if (local === true) {
      wx.redirectTo({ url: '/pages/webview/webview?page=community' });
      return true;
    }
    // 第2优先：CloudBase实时查，成功后写入本地存储
    try {
      var config = await configReader.loadConfig();
      if (config.ugc_enabled) {
        wx.setStorageSync(storageKey, true);
        wx.redirectTo({ url: '/pages/webview/webview?page=community' });
        return true;
      } else {
        wx.setStorageSync(storageKey, false);
      }
    } catch(e) {
      // CloudBase挂了的最后兜底
      var cached = getApp().globalData.config || {};
      if (cached.ugc_enabled) {
        wx.redirectTo({ url: '/pages/webview/webview?page=community' });
        return true;
      }
    }
    return false;
  },
  onShareAppMessage() {
    return { title: '草原爱宠营 | 签到领金币兑好礼！', path: '/pages/index/index' };
  }
})