const fs = require('fs');
const path = require('path');

// Create shared store guard
const storeGuard = `// Store guard - 审核期间store_enabled=false时跳转首页
const configReader = require('../../../utils/config-reader');
async function checkStore() {
  var storageKey = 'nx_store_enabled';
  var local = wx.getStorageSync(storageKey);
  if (local === true) return true;
  if (local === false) { wx.redirectTo({ url: '/pages/index/index' }); return false; }
  try {
    var config = await configReader.loadConfig();
    if (config.store_enabled) {
      wx.setStorageSync(storageKey, true);
      return true;
    } else {
      wx.setStorageSync(storageKey, false);
      wx.redirectTo({ url: '/pages/index/index' });
      return false;
    }
  } catch(e) { return true; }
}
module.exports = { checkStore };
`;

const guardPath = 'pages/store/store-guard.js';
fs.writeFileSync(guardPath, storeGuard, 'utf8');
console.log('Store guard created ✅');

// Patch each store page JS to use the guard
const storeDirs = [
  'pages/store/index',
  'pages/store/list',
  'pages/store/apply',
  'pages/store/admin/dashboard',
  'pages/store/admin/orders',
  'pages/store/admin/products',
  'pages/store/admin/settings'
];

storeDirs.forEach(dir => {
  const jsPath = dir + '/index.js';
  if (!fs.existsSync(jsPath)) { console.log('Missing:', jsPath); return; }
  let js = fs.readFileSync(jsPath, 'utf8');
  
  // Add guard import
  const guardImport = "const storeGuard = require('../store-guard.js');";
  const guardImport2 = "const storeGuard = require('../../store-guard.js');";
  const guardImport3 = "const storeGuard = require('../../../store-guard.js');";
  
  if (dir.includes('admin')) {
    if (!js.includes('store-guard')) {
      js = guardImport3 + '\n' + js;
    }
  } else {
    if (!js.includes('store-guard')) {
      js = guardImport2 + '\n' + js;
    }
  }
  
  // Add checkStore in onLoad
  if (js.includes('Page({') && !js.includes('checkStore()')) {
    js = js.replace(
      'onLoad(options) {',
      'async onLoad(options) {\n    var ok = await storeGuard.checkStore();\n    if (!ok) return;'
    );
  }
  
  fs.writeFileSync(jsPath, js, 'utf8');
  console.log('  Patched:', dir);
});

console.log('\nStore guard applied ✅');
