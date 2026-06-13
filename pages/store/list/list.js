Page({
  data: { stores: [], loading: true },
  onLoad() { this.loadStores(); },
  async loadStores() {
    try {
      const res = await wx.cloud.database().collection('stores').where({status:'active'}).limit(20).get();
      this.setData({ stores: res.data, loading: false });
    } catch(e) { this.setData({ loading: false }); }
  },
  onStore(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/store/index/index?sid=' + id });
  }
});
