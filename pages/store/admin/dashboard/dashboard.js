const storeGuard = require('../../store-guard.js');
const app = getApp();
Page({
  data: { store: null, stats: { productCount:0, orderCount:0, todayOrders:0, todayAmount:0 } },
  async onLoad() {
    var ok = await storeGuard.checkStore(); if (!ok) return;
    const user = app.globalData.userInfo || wx.getStorageSync('user') || {};
    const storeId = user.storeId || wx.getStorageSync('myStoreId');
    if (!storeId) { wx.redirectTo({ url: '/pages/store/apply/apply' }); return; }
    this.setData({ storeId });
    this.loadDashboard();
  },
  async loadDashboard() {
    try {
      const db = wx.cloud.database();
      const store = await db.collection('stores').doc(this.data.storeId).get();
      const prods = await db.collection('store_products').where({storeId:this.data.storeId}).count();
      const orders = await db.collection('store_orders').where({storeId:this.data.storeId}).count();
      this.setData({
        store: store.data,
        stats: { productCount: prods.total, orderCount: orders.total, todayOrders: 0, todayAmount: 0 }
      });
    } catch(e) { console.error(e); }
  },
  goProducts() { wx.navigateTo({ url: '/pages/store/admin/products/products' }); },
  goOrders() { wx.navigateTo({ url: '/pages/store/admin/orders/orders' }); },
  goSettings() { wx.navigateTo({ url: '/pages/store/admin/settings/settings' }); },
  goPreview() {
    wx.navigateTo({ url: '/pages/store/index/index?sid=' + this.data.storeId });
  }
});
