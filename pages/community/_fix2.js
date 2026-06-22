const fs = require('fs');
let js = fs.readFileSync('community.js', 'utf8');

// Replace the entire checkUGC block with a simpler, more aggressive version
const oldBlock = `checkUGC() {
    // Try cached config first (fast path)
    const cached = getApp().globalData.config || wx.getStorageSync('config') || {};
    if (cached.ugc_enabled) {
      wx.redirectTo({ url: '/pages/webview/webview?page=community' });
      return true;
    }
    // Fallback: direct CloudBase read (slower but reliable)
    this.checkUGCFromCloud();
    return false;
  },
  async checkUGCFromCloud() {
    try {
      const config = await configReader.loadConfig();
      if (config.ugc_enabled) {
        wx.redirectTo({ url: '/pages/webview/webview?page=community' });
      }
    } catch(e) {}
  }`;

const newBlock = `async checkUGC() {
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

js = js.replace(oldBlock, newBlock);
fs.writeFileSync('community.js', js, 'utf8');
console.log('OK: checkUGC now async + direct CloudBase');
console.log('Has checkUGCFromCloud:', js.includes('checkUGCFromCloud'));
