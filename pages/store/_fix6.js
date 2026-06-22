const fs = require('fs');

// Fix 1: list/list.js - onLoad() no params
let f = 'list/list.js';
let c = fs.readFileSync(f, 'utf8');
c = c.replace('onLoad() { this.loadStores(); }', 'async onLoad() {\n    var ok = await storeGuard.checkStore(); if (!ok) return;\n    this.loadStores();\n  }');
fs.writeFileSync(f, c, 'utf8');
console.log('OK: list/list.js');

// Fix 2: apply/apply.js - no onLoad, add one
f = 'apply/apply.js';
c = fs.readFileSync(f, 'utf8');
c = c.replace('Page({', 'Page({\n  async onLoad() {\n    var ok = await storeGuard.checkStore(); if (!ok) return;\n  },');
fs.writeFileSync(f, c, 'utf8');
console.log('OK: apply/apply.js');

// Fix 3-6: admin pages
['admin/dashboard/dashboard.js','admin/orders/orders.js','admin/products/products.js','admin/settings/settings.js'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace('onLoad() {', 'async onLoad() {\n    var ok = await storeGuard.checkStore(); if (!ok) return;');
  fs.writeFileSync(f, c, 'utf8');
  console.log('OK:', f);
});

console.log('\nDone ✅');
