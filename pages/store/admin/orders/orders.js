Page({
  data: { src: "https://cloudbase-4gvjj5qn247cd61a-1394227853.tcloudbaseapp.com/h5/store-admin.html#orders" },
  onMessage(e) {
    var d = e.detail.data || [];
    if (d[0] && d[0].type === "navigate") wx.navigateTo({ url: d[0].url });
  },
  onShareAppMessage() { return { title: "订单管理", path: "/pages/store/admin/orders/orders" }; }
});
