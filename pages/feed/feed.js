const app = getApp()
const api = require('../../utils/cloud-api')

Page({
  data: {
    currentTab: 'hot',
    videos: [],
    currentIndex: 0,
    currentVideo: null,
    comments: [],
    showComments: false,
    commentText: '',
    dailyRewards: { views: 0, likes: 0, comments: 0, shares: 0 }
  },

  onLoad(options) {
    const config = (getApp().globalData.config) || {};
    if (config.ugc_enabled) {
      wx.redirectTo({ url: '/pages/webview/webview?page=feed' });
      return;
    }
    this.loadFeed()
    this.loadDailyStats()
  },

  async loadFeed() {
    wx.showLoading({ title: '加载中...' })
    try {
      const videos = await api.getFeed(this.data.currentTab, 1, 20)
      const enriched = videos.map(v => ({
        ...v,
        isLiked: false,
        displayTime: this.fmtDuration(v.duration),
        displayViews: this.fmtCount(v.views || 0),
        displayLikes: this.fmtCount(v.likes || 0),
        displayComments: this.fmtCount(v.comments || 0)
      }))
      if (enriched.length === 0) enriched.push(...this.mockVideos())
      this.setData({ videos: enriched, currentVideo: enriched[0], currentIndex: 0 })
    } catch(e) {
      this.setData({ videos: this.mockVideos(), currentVideo: this.mockVideos()[0] })
    }
    wx.hideLoading()
  },

  mockVideos() {
    return [
      { _id: 'd1', title: '我家金毛第一次去草原撒欢！', author: { nickname: '草原爱犬者', avatar: '草' }, duration: 28, views: 1256, likes: 89, comments: 12, tags: ['金毛','草原','撒欢'], displayTime: '00:28', displayViews: '1.2k', displayLikes: '89', displayComments: '12', videoUrl: '', coverUrl: '' },
      { _id: 'd2', title: '哈士奇接飞盘挑战', author: { nickname: '二哈的日常', avatar: '哈' }, duration: 35, views: 2340, likes: 167, comments: 28, tags: ['哈士奇','飞盘','搞笑'], displayTime: '00:35', displayViews: '2.3k', displayLikes: '167', displayComments: '28', videoUrl: '', coverUrl: '' },
      { _id: 'd3', title: '和边牧比智商我输了', author: { nickname: '边牧主人', avatar: '边' }, duration: 42, views: 890, likes: 56, comments: 8, tags: ['边牧','智商'], displayTime: '00:42', displayViews: '890', displayLikes: '56', displayComments: '8', videoUrl: '', coverUrl: '' },
      { _id: 'd4', title: '柯基小短腿爬山记', author: { nickname: '柯基小短腿', avatar: '柯' }, duration: 22, views: 3456, likes: 234, comments: 35, tags: ['柯基','爬山','可爱'], displayTime: '00:22', displayViews: '3.4k', displayLikes: '234', displayComments: '35', videoUrl: '', coverUrl: '' }
    ]
  },

  loadDailyStats() {
    const stats = wx.getStorageSync('feedDaily') || { date: '', views: 0, likes: 0, comments: 0, shares: 0 }
    const today = new Date().toISOString().split('T')[0]
    if (stats.date !== today) {
      const fresh = { date: today, views: 0, likes: 0, comments: 0, shares: 0 }
      this.setData({ dailyRewards: fresh })
      wx.setStorageSync('feedDaily', fresh)
    } else {
      this.setData({ dailyRewards: stats })
    }
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === this.data.currentTab) return
    this.setData({ currentTab: tab })
    this.loadFeed()
  },

  onSwiperChange(e) {
    const idx = e.detail.current
    const video = this.data.videos[idx]
    if (video) this.onViewReward(video._id)
    this.setData({ currentIndex: idx, currentVideo: video, showComments: false })
  },

  async onViewReward(videoId) {
    const stats = this.data.dailyRewards
    if (stats.views >= 50) return
    try { await api.interactVideo(videoId, 'view') } catch(e) {}
    stats.views++
    this.setData({ dailyRewards: stats })
    this.saveStats(stats)
  },

  async onLike() {
    const video = this.data.currentVideo
    if (!video || video.isLiked) return
    const stats = this.data.dailyRewards
    if (stats.likes >= 30) { wx.showToast({ title: '今日点赞已达上限', icon: 'none' }); return }
    try { await api.interactVideo(video._id, 'like') } catch(e) {}
    video.isLiked = true
    video.likes++
    video.displayLikes = this.fmtCount(video.likes)
    const videos = this.data.videos
    videos[this.data.currentIndex] = video
    stats.likes++
    this.setData({ videos, currentVideo: video, dailyRewards: stats })
    this.saveStats(stats)
    wx.showToast({ title: '点赞成功！+1金币', icon: 'none' })
  },

  onComment() {
    this.setData({ showComments: true })
    this.loadComments()
  },

  async loadComments() {
    try {
      const comments = await api.getComments(this.data.currentVideo._id)
      this.setData({ comments })
    } catch(e) { this.setData({ comments: [] }) }
  },

  async onSendComment() {
    const text = this.data.commentText.trim()
    if (!text || text.length < 5) { wx.showToast({ title: '评论至少5个字', icon: 'none' }); return }
    const stats = this.data.dailyRewards
    if (stats.comments >= 20) { wx.showToast({ title: '今日评论已达上限', icon: 'none' }); return }
    try { await api.addComment(this.data.currentVideo._id, text) } catch(e) {}
    stats.comments++
    const video = this.data.currentVideo
    video.comments++
    video.displayComments = this.fmtCount(video.comments)
    const videos = this.data.videos
    videos[this.data.currentIndex] = video
    this.setData({ commentText: '', videos, currentVideo: video, dailyRewards: stats })
    this.saveStats(stats)
    wx.showToast({ title: '评论成功！+2金币', icon: 'none' })
    this.loadComments()
  },

  onCommentInput(e) { this.setData({ commentText: e.detail.value }) },
  onCloseComments() { this.setData({ showComments: false }) },

  onShare() {
    const stats = this.data.dailyRewards
    if (stats.shares >= 5) { wx.showToast({ title: '今日分享已达上限', icon: 'none' }); return }
    try { api.interactVideo(this.data.currentVideo._id, 'share') } catch(e) {}
    stats.shares++
    this.setData({ dailyRewards: stats })
    this.saveStats(stats)
  },

  onUpload() { wx.navigateTo({ url: '/pages/upload/upload' }) },

  saveStats(stats) {
    stats.date = new Date().toISOString().split('T')[0]
    wx.setStorageSync('feedDaily', stats)
  },

  fmtDuration(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0')
    const s = (sec % 60).toString().padStart(2, '0')
    return m + ':' + s
  },

  fmtCount(n) {
    if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
    return n.toString()
  },

  onShareAppMessage() {
    const v = this.data.currentVideo
    return { title: (v ? v.title : '草原爱宠营') + ' | 看视频赚金币', path: '/pages/feed/feed', imageUrl: v ? v.coverUrl : '' }
  }
})
