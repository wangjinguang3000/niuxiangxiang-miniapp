Page({
  data: { product: {} },
  onLoad(opt) {
    var products = [
      { id: 1, name: "风干牛肝干 80g 袋装", price: "16.00", marketPrice: "19.90", image: "/images/product-80g.jpg", desc: "新鲜牛肝·0添加·低温烘焙", commission: "10%" },
      { id: 2, name: "风干牛肝干 240g 盒装(3袋)", price: "48.00", marketPrice: "58.00", image: "/images/product-240g.jpg", desc: "回购首选·一次3袋更省心", commission: "10%" },
      { id: 3, name: "风干牛肝干 480g 礼盒装", price: "88.00", marketPrice: "108.00", image: "/images/product-480g.jpg", desc: "送品牌围巾·高端送礼首选", commission: "12%" },
      { id: 4, name: "牛香香风干牛肉干", price: "68.00", marketPrice: "78.00", image: "/images/product-beef.jpg", desc: "草原牛肉·传统风干工艺", commission: "10%" }
    ];
    var p = products.find(function(p) { return p.id == opt.id; });
    if (p) this.setData({ product: p });
  },
  onShare() { wx.showShareMenu({ withShareTicket: true }); },
  onBuy() { wx.switchTab({ url: "/pages/products/products" }); }
});