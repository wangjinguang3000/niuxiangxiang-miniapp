// UGC开关配置读取器 - 明修栈道暗度陈仓
// 审核期间ugc_enabled=false，审核通过后云数据库开关启用H5功能
const H5_BASE = 'https://cloudbase-4gvjj5qn247cd61a-1394227853.tcloudbaseapp.com/h5/';

function getDB() {
  try { if (wx.cloud) return wx.cloud.database(); } catch(e) {}
  return null;
}

// 读取配置
async function loadConfig() {
  const db = getDB();
  if (!db) {
    console.log('[Config] Cloud not ready, using defaults');
    return { ugc_enabled: false, h5_base: H5_BASE };
  }
  try {
    const res = await db.collection('config').doc('app').get();
    const config = res.data || {};
    console.log('[Config] Loaded:', config);
    return {
      ugc_enabled: config.ugc_enabled === true,
      h5_base: config.h5_base || H5_BASE,
      partner_enabled: config.partner_enabled !== false,
      store_enabled: config.store_enabled === true,
      review_mode: config.review_mode === true
    };
  } catch(e) {
    console.log('[Config] Collection not ready:', e.message);
    return { ugc_enabled: false, h5_base: H5_BASE };
  }
}

// 检查UGC是否开启并跳转
async function checkUGC(pageName) {
  const config = await loadConfig();
  const app = getApp();
  app.globalData.config = config;
  
  if (config.ugc_enabled) {
    // UGC已开启 跳转到H5
    const url = '/pages/webview/webview?page=' + pageName;
    wx.redirectTo({ url: url });
    return false; // 不继续加载当前页面
  }
  return true; // 继续加载原生页面（审核模式）
}

// 获取H5 URL
function getH5Url(page, params) {
  const app = getApp();
  const base = (app.globalData.config && app.globalData.config.h5_base) || H5_BASE;
  let url = base + page + '.html?_t=' + Date.now();
  if (params) {
    Object.keys(params).forEach(function(k) {
      url += '&' + k + '=' + encodeURIComponent(params[k]);
    });
  }
  return url;
}

module.exports = { loadConfig: loadConfig, checkUGC: checkUGC, getH5Url: getH5Url, H5_BASE: H5_BASE };
