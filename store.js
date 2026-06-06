// Global state store
App({
  globalData: {
    userInfo: {
      nickname: '',
      avatar: '',
      tierName: '普通会员',
      coins: 0,
      coinValue: '0.00',
      totalEarned: 0,
      commission: '0.00',
      inviteCount: 0
    },
    petInfo: {
      emoji: '🐶',
      name: '',
      breed: '',
      age: ''
    },
    orders: [],
    addresses: [],
    cart: [],
    loggedIn: false
  },

  // Login
  login(nickname) {
    this.globalData.loggedIn = true;
    this.globalData.userInfo.nickname = nickname || '草原爱犬者';
    this.globalData.userInfo.avatar = this.globalData.userInfo.nickname.charAt(0);
    // New user bonus
    this.globalData.userInfo.coins += 500;
    this.globalData.userInfo.totalEarned += 500;
    this.globalData.userInfo.coinValue = (this.globalData.userInfo.coins / 100).toFixed(2);
    this.updateTier();
  },

  // Update member tier
  updateTier() {
    const coins = this.globalData.userInfo.coins;
    if (coins >= 5000) this.globalData.userInfo.tierName = '钻石会员';
    else if (coins >= 2000) this.globalData.userInfo.tierName = '金卡会员';
    else if (coins >= 500) this.globalData.userInfo.tierName = '银卡会员';
    else this.globalData.userInfo.tierName = '普通会员';
  },

  // Add coins
  addCoins(amount) {
    this.globalData.userInfo.coins += amount;
    this.globalData.userInfo.totalEarned += amount;
    this.globalData.userInfo.coinValue = (this.globalData.userInfo.coins / 100).toFixed(2);
    this.updateTier();
  },

  // Add commission
  addCommission(amount) {
    this.globalData.userInfo.commission = (parseFloat(this.globalData.userInfo.commission) + amount).toFixed(2);
  },

  // Get VIP discount rate
  getVipDiscount() {
    const tier = this.globalData.userInfo.tierName;
    if (tier === '钻石会员') return 0.9;
    if (tier === '金卡会员') return 0.95;
    if (tier === '银卡会员') return 0.98;
    return 1;
  },

  // Coin-to-cash rate
  coinToCash(coins) {
    return (coins / 300).toFixed(2); // 300 coins = 1 yuan for cash deduction
  },

  coinToValue(coins) {
    return (coins / 100).toFixed(2); // 100 coins = 1 yuan for product exchange
  }
});