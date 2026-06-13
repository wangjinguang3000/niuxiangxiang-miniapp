// 草原爱宠营 - 牛香香微信小程序
const configReader = require('./utils/config-reader');

App({
  globalData: {
    userInfo: null,
    isLogin: false,
    coins: 0,
    config: { ugc_enabled: false, h5_base: configReader.H5_BASE, partner_enabled: true, review_mode: false },
    cloudReady: false
  },

  onLaunch() {
    this.initCloud();
    this.loadAppConfig();
  },
  onShow(options) {
    // Handle store QR code entry
    if (options && options.query && options.query.sid) {
      wx.navigateTo({ url: '/pages/store/index/index?sid=' + options.query.sid });
    }
  },

  // 初始化云开发
  initCloud() {
    try {
      if (typeof wx !== 'undefined' && wx.cloud) {
        wx.cloud.init({
          env: 'cloudbase-4gvjj5qn247cd61a',
          traceUser: true
        });
        this.globalData.cloudReady = true;
        console.log('[App] Cloud init success');
      }
    } catch (e) {
      console.log('[App] Cloud not available:', e.message);
    }
  },

  // 加载远程配置（审核开关）
  async loadAppConfig() {
    try {
      const config = await configReader.loadConfig();
      this.globalData.config = config;
      console.log('[App] Config loaded:', config);
    } catch (e) {
      console.log('[App] Config load failed, using defaults:', e.message);
    }
  }
});
