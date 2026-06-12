const app = getApp()
const api = require('../../utils/cloud-api')

Page({
  data: {
    contestId: '',
    videoPath: '',
    coverPath: '',
    videoDuration: 0,
    title: '',
    tags: [],
    tagInput: '',
    uploading: false,
    uploadProgress: 0,
    tagSuggestions: ['金毛', '哈士奇', '柯基', '边牧', '泰迪', '萨摩耶', '柴犬', '拉布拉多', '搞笑', '日常', '训练', '互动', '萌宠', '草原', '户外']
  },

  onLoad(options) {
    const config = (getApp().globalData.config) || {};
    if (config.ugc_enabled) {
      wx.redirectTo({ url: '/pages/webview/webview?page=upload' });
      return;
    }
    if (options.contestId) {
      this.setData({ contestId: options.contestId })
    }
  },

  onChooseVideo() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      success: (res) => {
        const tempFile = res.tempFiles[0]
        this.setData({
          videoPath: tempFile.tempFilePath,
          videoDuration: Math.round(tempFile.duration || 15)
        })
      }
    })
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onTagInput(e) {
    this.setData({ tagInput: e.detail.value })
  },

  onAddTag() {
    const tag = this.data.tagInput.trim()
    if (!tag) return
    if (this.data.tags.includes(tag)) {
      wx.showToast({ title: '标签已存在', icon: 'none' }); return
    }
    if (this.data.tags.length >= 5) {
      wx.showToast({ title: '最多5个标签', icon: 'none' }); return
    }
    this.setData({
      tags: [...this.data.tags, tag],
      tagInput: ''
    })
  },

  onSuggestTag(e) {
    const tag = e.currentTarget.dataset.tag
    if (this.data.tags.includes(tag)) return
    if (this.data.tags.length >= 5) {
      wx.showToast({ title: '最多5个标签', icon: 'none' }); return
    }
    this.setData({ tags: [...this.data.tags, tag] })
  },

  onRemoveTag(e) {
    const idx = e.currentTarget.dataset.index
    const tags = [...this.data.tags]
    tags.splice(idx, 1)
    this.setData({ tags })
  },

  async onSubmit() {
    if (!this.data.videoPath) {
      wx.showToast({ title: '请先选择视频', icon: 'none' }); return
    }
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请输入视频标题', icon: 'none' }); return
    }
    this.setData({ uploading: true, uploadProgress: 0 })

    try {
      // 1. 上传视频到云存储
      const videoResult = await this.uploadFile(this.data.videoPath, 'video')
      this.setData({ uploadProgress: 50 })

      // 2. 保存到数据库
      const result = await api.uploadVideo(
        this.data.title.trim(),
        videoResult.fileID,
        '',
        this.data.videoDuration,
        this.data.tags,
        this.data.contestId
      )

      if (result.error) {
        wx.showToast({ title: result.error, icon: 'none' })
        this.setData({ uploading: false })
        return
      }

      this.setData({ uploadProgress: 100 })
      wx.showToast({ title: '发布成功！+20金币', icon: 'success' })

      // 返回到上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch(e) {
      wx.showToast({ title: '上传失败，请重试', icon: 'none' })
      this.setData({ uploading: false })
    }
  },

  uploadFile(filePath, type) {
    return new Promise((resolve, reject) => {
      const cloudPath = type + '/' + Date.now() + '_' + Math.random().toString(36).slice(2) + '.mp4'
      const task = wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: resolve,
        fail: reject
      })
    })
  },

  onCancel() {
    if (this.data.videoPath) {
      wx.showModal({
        title: '放弃上传？',
        content: '已选择的视频将不会保存',
        success: (res) => { if (res.confirm) wx.navigateBack() }
      })
    } else {
      wx.navigateBack()
    }
  }
})
