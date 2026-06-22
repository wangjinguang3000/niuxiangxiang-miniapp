const fs = require('fs');

const files = [
  { path: 'index/index.js', guardPath: '../store-guard.js' },
  { path: 'list/list.js', guardPath: '../store-guard.js' },
  { path: 'apply/apply.js', guardPath: '../store-guard.js' },
  { path: 'admin/dashboard/dashboard.js', guardPath: '../../store-guard.js' },
  { path: 'admin/orders/orders.js', guardPath: '../../store-guard.js' },
  { path: 'admin/products/products.js', guardPath: '../../store-guard.js' },
  { path: 'admin/settings/settings.js', guardPath: '../../store-guard.js' },
];

files.forEach(f => {
  if (!fs.existsSync(f.path)) { console.log('MISS:', f.path); return; }
  let js = fs.readFileSync(f.path, 'utf8');
  
  // Add import
  if (!js.includes('store-guard')) {
    js = "const storeGuard = require('" + f.guardPath + "');\n" + js;
  }
  
  // Add checkStore
  if (js.includes('Page({') && !js.includes('checkStore()')) {
    js = js.replace('onLoad(', 'async onLoad(');
    js = js.replace(
      /(async onLoad\([^)]+\)\s*\{)/,
      '$1\n    var ok = await storeGuard.checkStore(); if (!ok) return;'
    );
  }
  
  fs.writeFileSync(f.path, js, 'utf8');
  console.log('OK:', f.path);
});

console.log('\nDone ✅');
