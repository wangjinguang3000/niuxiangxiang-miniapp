Page({
  data: {
    searchKey: '',
    activeCat: 'all',
    allProducts: [
      { id: 1, name: '风干牛肝干 80g', price: '16.00', marketPrice: '29.90', emoji: '🥩', image: '/images/products/product_80g.jpg', bgColor: '#8B5E3C', tagType: 'hot', tagText: '热卖', desc: '犬猫通用 | 训练奖励零食', cat: 'dog' },
      { id: 2, name: '风干牛肝干 240g', price: '48.00', marketPrice: '79.90', emoji: '🎁', image: '/images/products/product_240g.jpg', bgColor: '#8B5E3C', tagType: '', tagText: '', desc: '家庭装 | 性价比之选', cat: 'dog' },
      { id: 3, name: '风干牛肝干 480g 礼盒', price: '88.00', marketPrice: '149.00', emoji: '📦', image: '/images/products/product_480g.jpg', bgColor: '#8B5E3C', tagType: 'new', tagText: '礼盒', desc: '送礼佳品 | 精美包装', cat: 'gift' },
      { id: 4, name: '牛香香风干牛肉干', price: '68.00', marketPrice: '', emoji: '🐂', image: '/images/products/product_beef.jpg', bgColor: '#5C8A45', tagType: 'new', tagText: '新品', desc: '人食级 | 草原黄牛 | 独立包装', cat: 'human' },
      { id: 5, name: '赛事能量包', price: '128.00', marketPrice: '', emoji: '🏆', image: '/images/products/product_eventpack.jpg', bgColor: '#5C8A45', tagType: 'event', tagText: '赛事限定', desc: '牛肝干240g+牛肉干+水碗+纪念章', cat: 'event' }
    ],
    filteredProducts: []
  },
  onLoad() { this.filterProducts(); },
  onSearch(e) {
    this.setData({ searchKey: e.detail.value });
    this.filterProducts();
  },
  onCat(e) {
    this.setData({ activeCat: e.currentTarget.dataset.cat });
    this.filterProducts();
  },
  filterProducts() {
    const { searchKey, activeCat, allProducts } = this.data;
    const key = searchKey.toLowerCase();
    let list = allProducts.filter(p => {
      const matchSearch = !key || p.name.toLowerCase().includes(key) || p.desc.toLowerCase().includes(key);
      const matchCat = activeCat === 'all' || p.cat === activeCat;
      return matchSearch && matchCat;
    });
    this.setData({ filteredProducts: list });
  },
  onDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }); },
  onBargain() { wx.showToast({ title: '砍价功能开发中', icon: 'none' }); }
});