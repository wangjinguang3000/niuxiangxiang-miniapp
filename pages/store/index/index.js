const app = getApp();

Page({
  data: {
    storeId: '',
    store: null,
    products: [],
    loading: true,
    isOwner: false
  },
  onLoad(options) {
    const sid = options.sid || options.storeId || wx.getStorageSync('currentStore') || '';
    if (!sid) {
      // No store param - show store list
      wx.redirectTo({ url: '/pages/store/list/list' });
      return;
    }
    this.setData({ storeId: sid });
    wx.setStorageSync('currentStore', sid);
    this.loadStore();
  },
  onShow() { if (this.data.storeId) this.loadStore(); },
  
  async loadStore() {
    this.setData({ loading: true });
    try {
      const db = wx.cloud.database();
      const res = await db.collection('stores').doc(this.data.storeId).get();
      const store = res.data;
      if (!store || store.status !== 'active') {
        wx.showToast({ title: '门店暂未开放', icon: 'none' });
        this.setData({ loading: false });
        return;
      }
      // Load products
      const prodRes = await db.collection('store_products')
        .where({ storeId: this.data.storeId, status: 'on' })
        .limit(20).get();
      
      // Check if current user is store owner
      const user = app.globalData.userInfo || wx.getStorageSync('user') || {};
      const isOwner = user._id === store.ownerId || user._openid === store.ownerId;
      
      this.setData({ store, products: prodRes.data, loading: false, isOwner });
      wx.setNavigationBarTitle({ title: store.name });
    } catch(e) {
      console.error('[Store] Load failed:', e);
      this.setData({ loading: false });
      // Fallback data
      this.setData({ store: {
        _id: this.data.storeId,
        name: 'Demo宠物生活馆',
        logo: '', banner: '',
        intro: '欢迎光临本店',
        phone: '13800000000',
        address: '深圳市南山区',
        hours: '09:00-21:00',
        color: '#8B5E3C'
      }});
      wx.setNavigationBarTitle({ title: 'Demo宠物生活馆' });
    }
  },
  onCall() {
    if (this.data.store.phone) {
      wx.makePhoneCall({ phoneNumber: this.data.store.phone });
    }
  },
  onNavigate() {
    const s = this.data.store;
    if (s.latitude && s.longitude) {
      wx.openLocation({ latitude: s.latitude, longitude: s.longitude, name: s.name, address: s.address });
    }
  },
  onProduct(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id + '&storeId=' + this.data.storeId });
  },
  onShareAppMessage() {
    return {
      title: this.data.store ? this.data.store.name + ' - 草原爱宠营' : '草原爱宠营门店',
      path: '/pages/store/index/index?sid=' + this.data.storeId
    };
  }
});
