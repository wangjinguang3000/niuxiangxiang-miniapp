Page({
  data: {},
  onLoad(options) {
    console.log("[Partner:tools] onLoad", options);
  },
  onShow() {
    this.loadData();
  },
  loadData() {
    const app = getApp();
    const user = app.globalData.userInfo || wx.getStorageSync("user") || {};
    this.setData({
      userInfo: user,
      partnerStatus: user.partnerStatus || "none",
      commission: user.commission || 0,
      inviteCount: user.inviteCount || 0
    });
  },
  onShareAppMessage() {
    const userId = getApp().globalData.userInfo?._id || "";
    return {
      title: "草原爱宠营 - 加入我们一起玩！",
      path: "/pages/index/index?ref=" + userId
    };
  }
});
