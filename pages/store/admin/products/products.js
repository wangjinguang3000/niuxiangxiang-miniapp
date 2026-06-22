const storeGuard = require('../../store-guard.js');
const app = getApp();
Page({
  data: { products: [], storeId: '' },
  async onLoad() {
    const user = app.globalData.userInfo || wx.getStorageSync('user') || {};
    this.setData({ storeId: user.storeId || wx.getStorageSync('myStoreId') });
    this.loadProducts();
  },
  onShow() { this.loadProducts(); },
  async loadProducts() {
    try {
      const db = wx.cloud.database();
      const res = await db.collection('store_products').where({storeId:this.data.storeId}).get();
      this.setData({ products: res.data });
    } catch(e) { wx.showToast({title:'加载失败',icon:'none'}); }
  },
  onAdd() {
    wx.showModal({ title: '添加产品', editable: true, placeholderText: '产品名称',
      success: (r) => { if(r.confirm && r.content) this.saveProduct(r.content); }
    });
  },
  async saveProduct(name) {
    const db = wx.cloud.database();
    await db.collection('store_products').add({ data: {
      storeId: this.data.storeId, name, price: 0, category: '其他',
      stock: 0, isOwn: true, status: 'on', createdAt: new Date()
    }});
    this.loadProducts();
  },
  async onToggle(e) {
    const idx = e.currentTarget.dataset.idx;
    const prod = this.data.products[idx];
    const db = wx.cloud.database();
    await db.collection('store_products').doc(prod._id).update({ data: { status: prod.status==='on'?'off':'on' }});
    this.loadProducts();
  },
  async onDelete(e) {
    const idx = e.currentTarget.dataset.idx;
    const prod = this.data.products[idx];
    wx.showModal({ title: '确认删除', content: '删除「'+prod.name+'」？',
      success: async (r) => { if(r.confirm) {
        await wx.cloud.database().collection('store_products').doc(prod._id).remove();
        this.loadProducts();
      }}
    });
  }
});
