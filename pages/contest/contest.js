const app = getApp()
const api = require('../../utils/cloud-api')

Page({
  data: {
    contests: [],
    currentContest: null,
    entries: [],
    showDetail: false,
    contestPhase: '',
    countdown: '',
    myVotedIds: [],
    todayVotes: 0,
    userTier: '普通会员',
    maxDailyVotes: 1,
    voteCost: 10
  },

  onLoad() {
    this.loadContests()
    this.updateTierInfo()
  },

  onShow() {
    this.updateTierInfo()
  },

  updateTierInfo() {
    const user = app.globalData.userInfo || wx.getStorageSync('user') || {}
    const coins = app.globalData.coins || user.coins || 0
    const tier = coins >= 5000 ? '钻石会员' : coins >= 2000 ? '金卡会员' : coins >= 500 ? '银卡会员' : '普通会员'
    const maxVotes = tier === '钻石会员' ? 5 : tier === '金卡会员' ? 3 : tier === '银卡会员' ? 2 : 1
    const voteCost = tier === '钻石会员' ? 3 : tier === '金卡会员' ? 5 : tier === '银卡会员' ? 8 : 10
    this.setData({ userTier: tier, maxDailyVotes: maxVotes, voteCost })
  },

  async loadContests() {
    wx.showLoading({ title: '加载中...' })
    try {
      const contests = await api.getContests()
      this.setData({ contests })
      if (contests.length > 0) {
        this.setCurrentContest(contests[0])
      }
    } catch(e) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
    wx.hideLoading()
  },

  setCurrentContest(contest) {
    const phase = contest.phase
    const phaseText = phase === 'submit' ? '投稿期' : phase === 'vote' ? '投票期' : '已结束'
    let targetDate
    if (phase === 'submit') targetDate = new Date(contest.submitEnd || new Date())
    else if (phase === 'vote') targetDate = new Date(contest.voteEnd || new Date())
    else targetDate = null
    this.setData({
      currentContest: contest,
      contestPhase: phaseText,
      phaseIcon: phase === 'submit' ? '📤' : phase === 'vote' ? '🗳️' : '🏆'
    })
    if (targetDate) this.startCountdown(targetDate)
    if (phase === 'vote') this.loadMyVotes(contest._id)
  },

  startCountdown(targetDate) {
    const update = () => {
      const now = new Date()
      const diff = new Date(targetDate) - now
      if (diff <= 0) { this.setData({ countdown: '已结束' }); return }
      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      this.setData({ countdown: days + '天' + hours + '小时' })
    }
    update()
    this.countdownTimer = setInterval(update, 60000)
  },

  onUnload() {
    if (this.countdownTimer) clearInterval(this.countdownTimer)
  },

  onContestTap(e) {
    const idx = e.currentTarget.dataset.index
    this.setCurrentContest(this.data.contests[idx])
  },

  async onViewEntries() {
    wx.showLoading({ title: '加载作品...' })
    const contestId = this.data.currentContest._id
    try {
      const result = await api.getContestDetail(contestId)
      const entries = (result.entries || []).map((e, i) => ({
        ...e,
        rank: i + 1,
        rankEmoji: i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1).toString(),
        displayLikes: this.formatCount(e.likes || 0)
      }))
      this.setData({ entries, showDetail: true })
    } catch(e) {
      // Fallback mock data
      const mockEntries = [
        { _id: 'e1', title: '金毛草原狂奔', author: { nickname: '草原爱犬者' }, likes: 234, rank: 1, rankEmoji: '🥇', displayLikes: '234' },
        { _id: 'e2', title: '二哈接飞盘失败集锦', author: { nickname: '二哈的日常' }, likes: 189, rank: 2, rankEmoji: '🥈', displayLikes: '189' },
        { _id: 'e3', title: '边牧超强服从性', author: { nickname: '边牧主人' }, likes: 156, rank: 3, rankEmoji: '🥉', displayLikes: '156' },
        { _id: 'e4', title: '柯基爬山记', author: { nickname: '柯基小短腿' }, likes: 128, rank: 4, rankEmoji: '4', displayLikes: '128' },
        { _id: 'e5', title: '萨摩耶的微笑', author: { nickname: '微笑天使' }, likes: 95, rank: 5, rankEmoji: '5', displayLikes: '95' }
      ]
      this.setData({ entries: mockEntries, showDetail: true })
    }
    wx.hideLoading()
  },

  onCloseDetail() { this.setData({ showDetail: false }) },

  async onVote(e) {
    const videoId = e.currentTarget.dataset.videoId
    const contestId = this.data.currentContest._id
    if (this.data.contestPhase !== '投票期') {
      wx.showToast({ title: '当前不在投票期', icon: 'none' }); return
    }
    if (this.data.myVotedIds.includes(videoId)) {
      wx.showToast({ title: '今天已投过此作品', icon: 'none' }); return
    }
    if (this.data.todayVotes >= this.data.maxDailyVotes) {
      wx.showModal({
        title: '今日免费票已用完',
        content: '是否用' + this.data.voteCost + '金币购买一张票？',
        success: async (res) => {
          if (res.confirm) {
            const user = app.globalData.userInfo || {}
            if ((user.coins || 0) < this.data.voteCost) {
              wx.showToast({ title: '金币不足', icon: 'none' }); return
            }
            try { await api.voteContest(contestId, videoId) } catch(e) {}
            this.doVoteSuccess(videoId)
          }
        }
      }); return
    }
    try { await api.voteContest(contestId, videoId) } catch(e) {}
    this.doVoteSuccess(videoId)
  },

  doVoteSuccess(videoId) {
    const entries = this.data.entries.map(e => {
      if (e._id === videoId) { e.likes++; e.displayLikes = this.formatCount(e.likes) }
      return e
    })
    entries.sort((a, b) => b.likes - a.likes)
    entries.forEach((e, i) => {
      e.rank = i + 1
      e.rankEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1).toString()
    })
    this.setData({
      entries,
      todayVotes: this.data.todayVotes + 1,
      myVotedIds: [...this.data.myVotedIds, videoId]
    })
    wx.showToast({ title: '投票成功！+1金币', icon: 'none' })
  },

  async loadMyVotes(contestId) {
    try {
      const result = await api.getMyDailyVotes(contestId)
      this.setData({ todayVotes: result.todayVotes || 0, myVotedIds: result.votedIds || [] })
    } catch(e) {}
  },

  onEnterContest() {
    const phase = this.data.currentContest ? this.data.currentContest.phase : ''
    if (phase !== 'submit') {
      wx.showToast({ title: '当前不在投稿期', icon: 'none' }); return
    }
    wx.navigateTo({ url: '/pages/upload/upload?contestId=' + (this.data.currentContest._id || '') })
  },

  onMyVideos() {
    wx.navigateTo({ url: '/pages/feed/feed?tab=mine' })
  },

  formatCount(n) {
    if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
    return n.toString()
  },

  getPrizes(rank) {
    if (rank === 1) return '5000金币+礼盒x2'
    if (rank === 2) return '3000金币+240gx2'
    if (rank === 3) return '1500金币+80gx3'
    if (rank <= 10) return '800金币+30元券'
    if (rank <= 50) return '300金币+10元券'
    return '100金币'
  },

  onShareAppMessage() {
    return {
      title: '人宠互动预选赛 | 来给毛孩子投票吧！',
      path: '/pages/contest/contest',
      imageUrl: ''
    }
  }
})
