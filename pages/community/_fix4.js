const fs = require('fs');
let js = fs.readFileSync('community.js', 'utf8');

// Replace checkUGC with foolproof version
const oldCheck = `async checkUGC() {
    // 直接读CloudBase，不依赖缓存
    try {
      const config = await configReader.loadConfig();
      if (config.ugc_enabled) {
        wx.redirectTo({ url: '/pages/webview/webview?page=community' });
        return true;
      }
    } catch(e) {
      // 回退到缓存
      const cached = getApp().globalData.config || {};
      if (cached.ugc_enabled) {
        wx.redirectTo({ url: '/pages/webview/webview?page=community' });
        return true;
      }
    }
    return false;
  },
  showCheckin() {
    this.loadUserData();
  }`;

const newCheck = `async checkUGC() {
    // 第1优先：本地存储（秒开，离线也能用）
    var storageKey = 'nx_ugc_enabled';
    var local = wx.getStorageSync(storageKey);
    if (local === true) {
      wx.redirectTo({ url: '/pages/webview/webview?page=community' });
      return true;
    }
    // 第2优先：CloudBase实时查，成功后写入本地存储
    try {
      var config = await configReader.loadConfig();
      if (config.ugc_enabled) {
        wx.setStorageSync(storageKey, true);
        wx.redirectTo({ url: '/pages/webview/webview?page=community' });
        return true;
      } else {
        wx.setStorageSync(storageKey, false);
      }
    } catch(e) {
      // CloudBase挂了的最后兜底
      var cached = getApp().globalData.config || {};
      if (cached.ugc_enabled) {
        wx.redirectTo({ url: '/pages/webview/webview?page=community' });
        return true;
      }
    }
    return false;
  }`;

js = js.replace(oldCheck, newCheck);
fs.writeFileSync('community.js', js, 'utf8');
console.log('OK');
