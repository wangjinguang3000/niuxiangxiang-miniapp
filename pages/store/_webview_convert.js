const fs = require('fs');

const H5_BASE = 'https://cloudbase-4gvjj5qn247cd61a-1394227853.tcloudbaseapp.com/h5/';

const pages = [
  { dir: 'index', file: 'index', url: H5_BASE + 'store.html', title: '附近宠物门店' },
  { dir: 'list', file: 'list', url: H5_BASE + 'store.html', title: '门店列表' },
  { dir: 'apply', file: 'apply', url: H5_BASE + 'store-apply.html', title: '门店入驻' },
  { dir: 'admin/dashboard', file: 'dashboard', url: H5_BASE + 'store-admin.html', title: '门店管理' },
  { dir: 'admin/orders', file: 'orders', url: H5_BASE + 'store-admin.html#orders', title: '订单管理' },
  { dir: 'admin/products', file: 'products', url: H5_BASE + 'store-admin.html#products', title: '商品管理' },
  { dir: 'admin/settings', file: 'settings', url: H5_BASE + 'store-admin.html#settings', title: '门店设置' },
];

pages.forEach(p => {
  const dirPath = p.dir;
  
  // WXML - simple webview
  const wxml = '<view class="webview-container"><web-view src="{{src}}" bindmessage="onMessage"></web-view></view>';
  fs.writeFileSync(dirPath + '/' + p.file + '.wxml', wxml, 'utf8');
  
  // JS
  const js = 'Page({\n  data: { src: "' + p.url + '" },\n  onMessage(e) {\n    var d = e.detail.data || [];\n    if (d[0] && d[0].type === "navigate") wx.navigateTo({ url: d[0].url });\n  },\n  onShareAppMessage() { return { title: "' + p.title + '", path: "/pages/store/' + p.dir + '/' + p.file + '" }; }\n});\n';
  fs.writeFileSync(dirPath + '/' + p.file + '.js', js, 'utf8');
  
  // JSON
  const json = JSON.stringify({ navigationBarTitleText: p.title, enablePullDownRefresh: false }, null, 2);
  fs.writeFileSync(dirPath + '/' + p.file + '.json', json, 'utf8');
  
  // WXSS - minimal
  fs.writeFileSync(dirPath + '/' + p.file + '.wxss', '.webview-container{width:100%;height:100vh}', 'utf8');
  
  console.log('✅', dirPath);
});

// Remove store-guard.js (no longer needed)
if (fs.existsSync('store-guard.js')) {
  fs.unlinkSync('store-guard.js');
  console.log('🗑️ store-guard.js removed');
}

console.log('\n全部7个store页面已转为webview+H5 ✅');
