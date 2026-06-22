const storeGuard = require('../../store-guard.js');
const app = getApp();
Page({
  data: { orders: [], storeId: '' },
  async onLoad() {
    this.setData({ storeId: (app.globalData.userInfo||{}).storeId || wx.getStorageSync('myStoreId') });
    this.loadOrders();
  },
  async loadOrders() {
    try {
      const res = await wx.cloud.database().collection('store_orders').where({storeId:this.data.storeId}).orderBy('createdAt','desc').limit(20).get();
      this.setData({ orders: res.data });
    } catch(e) {}
  }
});
