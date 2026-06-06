// app.js - Cloud-enabled
App({
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloudbase-4gvjj5qn247cd61a',
        traceUser: true
      })
    }
    const user = wx.getStorageSync('user')
    if (user) {
      this.globalData.userInfo = user
      this.globalData.isLogin = true
    }
  },
  globalData: {
    userInfo: null,
    isLogin: false,
    coins: 0,
    invitedCount: 0
  },
  async loadUserData() {
    try {
      if (wx.cloud) {
        const res = await wx.cloud.callFunction({ name: 'login', data: {} })
        if (res.result && res.result.user) {
          this.globalData.userInfo = res.result.user
          this.globalData.coins = res.result.user.coins || 0
          wx.setStorageSync('user', res.result.user)
        }
      }
    } catch(e) { console.log('Load user data failed:', e) }
  },
  async cloudCall(name, data = {}) {
    try {
      const res = await wx.cloud.callFunction({ name, data })
      return res.result
    } catch(e) {
      console.error('Cloud call failed:', name, e)
      return { error: e.message }
    }
  },
  async login(nickname) {
    const res = await this.cloudCall('login', { nickname })
    if (!res.error) {
      this.globalData.isLogin = true
      this.globalData.coins = res.coins || 0
      this.globalData.userInfo = { nickname: nickname || '草原爱犬者', coins: res.coins || 500 }
      wx.setStorageSync('user', this.globalData.userInfo)
    }
    return res
  },
  getCoins() { return this.globalData.coins },
  addCoins(n) { this.globalData.coins += n }
})