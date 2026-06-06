// Cloud API - direct database fallback when cloud functions not deployed
function getDB() { try { if (wx.cloud) return wx.cloud.database() } catch(e) { console.log('DB not ready:', e.message) } return null }
const app = getApp()

const api = {
  async login(nickname) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      const res = await db.collection('users').where({ _openid: '{openid}' }).get()
      if (res.data.length === 0) {
        const newUser = {
          nickname: nickname || '草原爱犬者',
          coins: 500, totalEarned: 500,
          commission: 0, inviteCount: 0,
          tier: '普通会员', petInfo: null,
          addresses: [], createdAt: new Date()
        }
        await db.collection('users').add({ data: newUser })
        app.globalData.userInfo = { ...newUser, _openid: '{openid}' }
        app.globalData.coins = 500
        app.globalData.isLogin = true
        wx.setStorageSync('user', app.globalData.userInfo)
        return { isNew: true, coins: 500 }
      }
      app.globalData.userInfo = res.data[0]
      app.globalData.coins = res.data[0].coins || 0
      app.globalData.isLogin = true
      wx.setStorageSync('user', res.data[0])
      return { isNew: false, user: res.data[0] }
    } catch(e) { return { error: e.message } }
  },

  async getProducts(category, search) {
    const db = getDB(); if (!db) return []
    try {
      let query = db.collection('products')
      if (category && category !== 'all') query = query.where({ category })
      const res = await query.get()
      let products = res.data
      if (search) {
        const s = search.toLowerCase()
        products = products.filter(p => p.name.toLowerCase().includes(s) || (p.desc||'').toLowerCase().includes(s))
      }
      return products
    } catch(e) { return [] }
  },

  async createOrder(items, total, address, coinUsed, vipDiscount) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      const orderId = 'NX' + Date.now().toString(36).toUpperCase()
      await db.collection('orders').add({
        data: { orderId, items, total, address, coinUsed, vipDiscount, status: '待发货', createdAt: new Date() }
      })
      return { success: true, orderId }
    } catch(e) { return { error: e.message } }
  },

  async getOrders() {
    const db = getDB(); if (!db) return []
    try {
      const res = await db.collection('orders').orderBy('createdAt', 'desc').limit(50).get()
      return res.data
    } catch(e) { return [] }
  },

  async checkin() {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      const today = new Date().toISOString().split('T')[0]
      const existRes = await db.collection('checkins').where({ date: today }).get()
      if (existRes.data.length > 0) return { error: '今天已签到', checkedToday: true }
      const recentRes = await db.collection('checkins').orderBy('date', 'desc').limit(7).get()
      let streak = 0
      const checkDate = new Date(today)
      for (let i = 0; i < 7; i++) {
        const d = new Date(checkDate); d.setDate(d.getDate() - i)
        const ds = d.toISOString().split('T')[0]
        if (recentRes.data.find(r => r.date === ds)) streak++
        else break
      }
      streak = Math.min(streak + 1, 7)
      const rewards = [0, 5, 8, 12, 18, 25, 35, 50]
      const reward = rewards[streak]
      await db.collection('checkins').add({ data: { date: today, streak, reward, createdAt: new Date() } })
      return { success: true, streak, reward }
    } catch(e) { return { error: e.message } }
  },

  async addCoins(amount, reason) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      if (reason === 'invite') {
        await db.collection('users').where({ _openid: '{openid}' }).update({
          data: { inviteCount: db.command.inc(1), commission: db.command.inc(10), coins: db.command.inc(amount), totalEarned: db.command.inc(amount) }
        })
      }
      return { success: true, amount }
    } catch(e) { return { error: e.message } }
  },

  async exchangeItem(itemId) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    const items = [
      { name: '3元购物抵用券', cost: 100, val: 3 },
      { name: '牛肝干80g体验装', cost: 150, val: 15 },
      { name: '赛事报名30元抵扣', cost: 300, val: 30 },
      { name: '牛肝干240g正装', cost: 480, val: 48 }
    ]
    const item = items[itemId]
    if (!item) return { error: '商品不存在' }
    try {
      await db.collection('users').where({ _openid: '{openid}' }).update({
        data: { coins: db.command.inc(-item.cost) }
      })
      const orderId = 'EX' + Date.now().toString(36).toUpperCase()
      await db.collection('orders').add({
        data: { orderId, items: [{ name: item.name, price: item.val }], total: 0, status: '已兑换', createdAt: new Date() }
      })
      return { success: true, item: item.name, cost: item.cost }
    } catch(e) { return { error: e.message } }
  },

  async commissionToCoins() {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      const userRes = await db.collection('users').where({ _openid: '{openid}' }).get()
      if (userRes.data.length === 0) return { error: '请先登录' }
      const user = userRes.data[0]
      if ((user.commission||0) < 10) return { error: '佣金满10元才能转金币' }
      const earned = Math.floor(user.commission)
      const bonusCoins = earned * 500
      await db.collection('users').doc(user._id).update({
        data: { commission: db.command.inc(-earned), coins: db.command.inc(bonusCoins), totalEarned: db.command.inc(bonusCoins) }
      })
      return { success: true, earned, bonusCoins }
    } catch(e) { return { error: e.message } }
  },

  async getLeaderboard() {
    const db = getDB(); if (!db) return []
    try {
      const res = await db.collection('users').orderBy('inviteCount', 'desc').limit(20).field({ nickname: true, inviteCount: true }).get()
      return res.data
    } catch(e) { return [] }
  },

  async saveAddress(name, phone, detail) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      await db.collection('users').where({ _openid: '{openid}' }).update({
        data: { addresses: [{ name, phone, detail }] }
      })
      return { success: true }
    } catch(e) { return { error: e.message } }
  },

  async savePet(name, breed, age) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      await db.collection('users').where({ _openid: '{openid}' }).update({
        data: { petInfo: { name, breed, age } }
      })
      return { success: true }
    } catch(e) { return { error: e.message } }
  },

  async getAdminStats() {
    const db = getDB(); if (!db) return {}
    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        db.collection('users').count(),
        db.collection('orders').count(),
        db.collection('products').get()
      ])
      const recentOrders = await db.collection('orders').orderBy('createdAt', 'desc').limit(10).get()
      return { userCount: usersRes.total, orderCount: ordersRes.total, productCount: productsRes.data.length, recentOrders: recentOrders.data }
    } catch(e) { return {} }
  },

  async initDatabase() {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    const products = [
      { name: '风干牛肝干 80g', price: 16.00, marketPrice: 29.90, category: 'dog', tagType: 'hot', tagText: '热卖', desc: '犬猫通用 | 高原散养 | 0添加', stock: 999, sales: 1520, commission: 10 },
      { name: '风干牛肝干 240g', price: 48.00, marketPrice: 79.90, category: 'dog', tagType: 'new', tagText: '推荐', desc: '家庭装 | 训练奖励最佳', stock: 500, sales: 890, commission: 10 },
      { name: '风干牛肝干 480g 礼盒', price: 88.00, marketPrice: 149.00, category: 'gift', tagType: 'new', tagText: '礼盒', desc: '送礼佳品 | 草原直供', stock: 200, sales: 340, commission: 12 },
      { name: '牛香香风干牛肉干', price: 68.00, category: 'human', tagType: 'new', tagText: '新品', desc: '人食级 | 草原黄牛 | 香辣/五香', stock: 300, sales: 120, commission: 10 },
      { name: '赛事能量包', price: 128.00, category: 'event', tagType: 'event', tagText: '赛事限定', desc: '牛肝干240g+牛肉干+水碗+纪念章', stock: 100, sales: 45, commission: 12 }
    ]
    try {
      for (const p of products) {
        const exists = await db.collection('products').where({ name: p.name }).get()
        if (exists.data.length === 0) await db.collection('products').add({ data: p })
      }
      return { message: '商品数据初始化成功', count: products.length }
    } catch(e) { return { error: e.message } }
  },

  // ===== 遛狗狗广场 & 预选赛 API =====
  async uploadVideo(title, videoUrl, coverUrl, duration, tags, contestId) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    const user = app.globalData.userInfo || {}
    try {
      const doc = {
        _openid: '{openid}',
        author: { nickname: user.nickname || '草原爱犬者', avatar: user.avatar || '' },
        title: title || '分享我的毛孩子', videoUrl: videoUrl || '', coverUrl: coverUrl || '',
        duration: duration || 15, tags: tags || [],
        views: 0, likes: 0, comments: 0, shares: 0, isFeatured: false,
        contestId: contestId || '', status: 'active', createdAt: new Date()
      }
      const res = await db.collection('videos').add({ data: doc })
      await db.collection('users').where({ _openid: '{openid}' }).update({
        data: { coins: db.command.inc(20), totalEarned: db.command.inc(20) }
      })
      if (contestId) {
        await db.collection('contests').doc(contestId).update({ data: { participantCount: db.command.inc(1) } })
      }
      return { success: true, videoId: res._id, coinsEarned: 20 }
    } catch(e) { return { error: e.message } }
  },

  async getFeed(tab, page, pageSize, contestId) {
    const db = getDB(); if (!db) return []
    try {
      let query = db.collection('videos').where({ status: 'active' })
      if (tab === 'mine') query = query.where({ _openid: '{openid}', status: 'active' })
      if (contestId) query = query.where({ contestId, status: 'active' })
      const sortField = tab === 'new' ? 'createdAt' : 'views'
      const res = await query.orderBy(sortField, 'desc').skip(((page||1)-1)*(pageSize||10)).limit(pageSize||10).get()
      return res.data
    } catch(e) { return [] }
  },

  async interactVideo(videoId, action) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      const videoRes = await db.collection('videos').doc(videoId).get()
      if (!videoRes.data) return { error: '视频不存在' }
      const video = videoRes.data
      let coinReward = 0; const updates = {}
      if (action === 'view') {
        updates.views = db.command.inc(1); coinReward = 1
        if ((video.views + 1) % 10 === 0) {
          await db.collection('users').where({ _openid: video._openid }).update({
            data: { coins: db.command.inc(1), totalEarned: db.command.inc(1) }
          })
        }
      } else if (action === 'like') {
        updates.likes = db.command.inc(1); coinReward = 1
        await db.collection('users').where({ _openid: video._openid }).update({
          data: { coins: db.command.inc(2), totalEarned: db.command.inc(2) }
        })
      } else if (action === 'share') { updates.shares = db.command.inc(1); coinReward = 5 }
      await db.collection('videos').doc(videoId).update({ data: updates })
      if (coinReward > 0) {
        await db.collection('users').where({ _openid: '{openid}' }).update({
          data: { coins: db.command.inc(coinReward), totalEarned: db.command.inc(coinReward) }
        })
      }
      return { success: true, coinReward }
    } catch(e) { return { error: e.message } }
  },

  async getComments(videoId, page, pageSize) {
    const db = getDB(); if (!db) return []
    try {
      const res = await db.collection('comments').where({ videoId })
        .orderBy('createdAt', 'desc').skip(((page||1)-1)*(pageSize||20)).limit(pageSize||20).get()
      return res.data
    } catch(e) { return [] }
  },

  async addComment(videoId, content) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    if (!content || content.length < 5) return { error: '评论至少5个字' }
    const user = app.globalData.userInfo || {}
    try {
      await db.collection('comments').add({
        data: { _openid: '{openid}', videoId,
          author: { nickname: user.nickname || '草原爱犬者', avatar: user.avatar || '' },
          content, likes: 0, createdAt: new Date() }
      })
      await db.collection('videos').doc(videoId).update({ data: { comments: db.command.inc(1) } })
      await db.collection('users').where({ _openid: '{openid}' }).update({
        data: { coins: db.command.inc(2), totalEarned: db.command.inc(2) }
      })
      return { success: true, coinsEarned: 2 }
    } catch(e) { return { error: e.message } }
  },

  async getContests() {
    const db = getDB(); if (!db) return []
    try {
      const res = await db.collection('contests').orderBy('createdAt', 'desc').get()
      if (res.data.length > 0) return res.data
    } catch(e) {}
    const now = new Date(); const day = now.getDate(); const month = now.getMonth() + 1
    const themes = [
      { title: '夏日戏水秀', theme: '狗狗玩水/游泳视频' },
      { title: '最佳接球手', theme: '狗狗接飞盘/球视频' },
      { title: '秋日漫步', theme: '人宠户外散步视频' },
      { title: '萌宠变装秀', theme: '宠物cosplay/装扮视频' },
      { title: '最佳默契', theme: '人宠配合互动挑战' },
      { title: '圣诞亲子装', theme: '人宠穿亲子装视频' }
    ]
    const themeIdx = (month - 1) % 6
    const phase = day <= 20 ? 'submit' : day <= 28 ? 'vote' : 'done'
    return [{
      _id: 'default', title: themes[themeIdx].title, theme: themes[themeIdx].theme, phase,
      submitEnd: new Date(now.getFullYear(), now.getMonth(), 20).toISOString(),
      voteStart: new Date(now.getFullYear(), now.getMonth(), 21).toISOString(),
      voteEnd: new Date(now.getFullYear(), now.getMonth(), 28).toISOString(),
      participantCount: 0, totalVotes: 0
    }]
  },

  async getContestDetail(contestId) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      const contestRes = await db.collection('contests').doc(contestId).get()
      const entriesRes = await db.collection('videos')
        .where({ contestId, status: 'active' }).orderBy('likes', 'desc').limit(100).get()
      return { contest: contestRes.data, entries: entriesRes.data }
    } catch(e) { return { error: e.message } }
  },

  async voteContest(contestId, videoId) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      const today = new Date().toISOString().split('T')[0]
      const existVote = await db.collection('votes').where({ _openid: '{openid}', contestId, videoId, date: today }).get()
      if (existVote.data.length > 0) return { error: '今天已给此作品投过票' }
      await db.collection('votes').add({ data: { _openid: '{openid}', contestId, videoId, date: today, createdAt: new Date() } })
      await db.collection('videos').doc(videoId).update({ data: { likes: db.command.inc(1) } })
      await db.collection('contests').doc(contestId).update({ data: { totalVotes: db.command.inc(1) } })
      await db.collection('users').where({ _openid: '{openid}' }).update({
        data: { coins: db.command.inc(1), totalEarned: db.command.inc(1) }
      })
      return { success: true, message: '投票成功！+1金币' }
    } catch(e) { return { error: e.message } }
  },

  async enterContest(contestId, videoId) {
    const db = getDB(); if (!db) return { error: 'cloud not ready' }
    try {
      const videoRes = await db.collection('videos').doc(videoId).get()
      if (!videoRes.data || videoRes.data._openid !== '{openid}') return { error: '视频不存在或非本人作品' }
      if (videoRes.data.contestId) return { error: '该视频已参赛' }
      await db.collection('videos').doc(videoId).update({ data: { contestId } })
      await db.collection('contests').doc(contestId).update({ data: { participantCount: db.command.inc(1) } })
      return { success: true, message: '报名成功！' }
    } catch(e) { return { error: e.message } }
  },

  async getMyDailyVotes(contestId) {
    const db = getDB(); if (!db) return { todayVotes: 0, votedIds: [] }
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await db.collection('votes').where({ _openid: '{openid}', contestId, date: today }).get()
      return { todayVotes: res.data.length, votedIds: res.data.map(v => v.videoId) }
    } catch(e) { return { todayVotes: 0, votedIds: [] } }
  }
}

module.exports = api
