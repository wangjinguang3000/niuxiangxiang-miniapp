const storeGuard = require('../store-guard.js');
const app = getApp();
Page({
  data: { form: { name:'', phone:'', address:'', intro:'' }, submitting: false },
  onInput(e) { const f = e.currentTarget.dataset.field; this.setData({ ['form.'+f]: e.detail.value }); },
  async onSubmit() {
    const f = this.data.form;
    if (!f.name || !f.phone) { wx.showToast({ title: '请填写门店名称和电话', icon:'none' }); return; }
    this.setData({ submitting: true });
    try {
      const db = wx.cloud.database();
      const res = await db.collection('stores').add({ data: {
        name: f.name, phone: f.phone, address: f.address||'', intro: f.intro||'',
        status: 'pending', plan: 'free', ownerId: (app.globalData.userInfo||{})._id||'',
        hours: '09:00-21:00', color: '#8B5E3C', createdAt: new Date()
      }});
      // Save storeId to user
      const storeId = res._id;
      wx.setStorageSync('myStoreId', storeId);
      wx.showToast({ title: '申请已提交，审核中', icon:'success' });
      setTimeout(() => wx.redirectTo({ url: '/pages/store/admin/dashboard/dashboard' }), 1500);
    } catch(e) {
      wx.showToast({ title: '提交失败，请重试', icon:'none' });
    }
    this.setData({ submitting: false });
  }
});
