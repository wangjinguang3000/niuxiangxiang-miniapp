// Store guard - 审核期间store_enabled=false时跳转首页
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
