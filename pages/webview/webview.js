// WebView容器 - 承载H5页面
Page({
  data: { src: "", loaded: false },
  onLoad(options) {
    const H5 = "https://cloudbase-4gvjj5qn247cd61a-1304825656.tcloudbaseapp.com/h5/";
    const page = options.page || "community";
    let src = H5 + page + ".html?_t=" + Date.now();
    if (options.id) src += "&id=" + encodeURIComponent(options.id);
    if (options.action) src += "&action=" + options.action;
    this.setData({ src });
  },
  onMessage(e) {
    var d = e.detail.data || [];
    if (d[0] && d[0].type === "navigate") wx.navigateTo({ url: d[0].url });
  },
  onShareAppMessage() { return { title: "草原爱宠营", path: "/pages/index/index" }; }
});
