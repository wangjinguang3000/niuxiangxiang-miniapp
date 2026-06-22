const storeGuard = require('../../store-guard.js');
const app = getApp();
Page({
  data: { store: { name:'',intro:'',phone:'',address:'',hours:'09:00-21:00',color:'#8B5E3C' }, storeId: '' },
  async onLoad() {
    var ok = await storeGuard.checkStore(); if (!ok) return;
    const user = app.globalData.userInfo || wx.getStorageSync('user') || {};
    const sid = user.storeId || wx.getStorageSync('myStoreId');
    if (!sid) { wx.redirectTo({ url: '/pages/store/apply/apply' }); return; }
    this.setData({ storeId: sid });
    this.loadSettings();
  },
  async loadSettings() {
    try {
      const res = await wx.cloud.database().collection('stores').doc(this.data.storeId).get();
      this.setData({ store: res.data });
    } catch(e) { console.error(e); }
  },
  onInput(e) { const f = e.currentTarget.dataset.field; this.setData({ ['store.'+f]: e.detail.value }); },
  async onSave() {
    wx.showLoading({title:'保存中'});
    try {
      await wx.cloud.database().collection('stores').doc(this.data.storeId).update({ data: this.data.store });
      wx.showToast({title:'保存成功'});
    } catch(e) { wx.showToast({title:'保存失败',icon:'none'}); }
    wx.hideLoading();
  }
});
