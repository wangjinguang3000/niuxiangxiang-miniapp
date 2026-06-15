Page({
  data: {
    product: null,
    showOrder: false,
    orderName: '',
    orderPhone: '',
    orderQuantity: 1
  },
  onLoad(options) {
    const id = options.id || 1;
    const products = {
      1: { id:1, name: '风干牛肝干 80g', price: '16.00', marketPrice: '29.90', image: '/images/product-80g.jpg', desc: '锡林郭勒新鲜牛肝·0添加·低温烘焙' },
      2: { id:2, name: '风干牛肝干 240g', price: '48.00', marketPrice: '58.00', image: '/images/product-240g.jpg', desc: '三袋装·回购首选·更省心' },
      3: { id:3, name: '风干牛肝干 480g 礼盒', price: '88.00', marketPrice: '108.00', image: '/images/product-480g.jpg', desc: '送礼首选·高端礼盒' },
      4: { id:4, name: '牛香香风干牛肉干', price: '68.00', marketPrice: '78.00', image: '/images/product-beef.jpg', desc: '草原牛肉·传统风干工艺' }
    };
    this.setData({ product: products[id] || products[1] });
  },
  onShowOrder() {
    this.setData({ showOrder: true });
  },
  onHideOrder() {
    this.setData({ showOrder: false });
  },
  onNameInput(e) { this.setData({ orderName: e.detail.value }); },
  onPhoneInput(e) { this.setData({ orderPhone: e.detail.value }); },
  onQtyChange(e) {
    const type = e.currentTarget.dataset.type;
    let qty = this.data.orderQuantity;
    if (type === 'plus') qty++;
    else if (type === 'minus' && qty > 1) qty--;
    this.setData({ orderQuantity: qty });
  },
  async onSubmit() {
    const { orderName, orderPhone, orderQuantity, product } = this.data;
    if (!orderName || !orderPhone) {
      wx.showToast({ title: '请填写姓名和电话', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '提交中' });
    try {
      const db = wx.cloud.database();
      await db.collection('orders').add({
        data: {
          items: [{ name: product.name, price: product.price, qty: orderQuantity }],
          total: (parseFloat(product.price) * orderQuantity).toFixed(2),
          customerName: orderName,
          customerPhone: orderPhone,
          status: '待确认',
          createdAt: new Date()
        }
      });
      wx.hideLoading();
      wx.showModal({
        title: '下单成功',
        content: '我们将尽快联系您确认订单。客服微信：13145294218',
        showCancel: false,
        success: () => { this.setData({ showOrder: false, orderName: '', orderPhone: '', orderQuantity: 1 }); }
      });
    } catch(e) {
      wx.hideLoading();
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
    }
  },
  onShare() {
    wx.showShareMenu({ withShareTicket: true });
  },
  onShareAppMessage() {
    return { title: this.data.product ? this.data.product.name + ' - 牛香香草原爱宠营' : '牛香香草原爱宠营' };
  }
})