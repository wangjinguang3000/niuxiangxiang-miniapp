Page({
  data: {
    pkgNames: ["早鸟参赛 ¥1,780(限前20组)", "标准参赛 ¥1,980", "观摩票 ¥1,280"],
    prices: ["1780", "1980", "1280"],
    pkgIdx: 0,
    totalPrice: "1,780",
    name: "", phone: "", city: "", dogName: "", dogBreed: "", note: ""
  },
  onPackage(e) { var i = parseInt(e.detail.value); this.setData({ pkgIdx: i, totalPrice: this.data.prices[i] }); },
  onName(e) { this.setData({ name: e.detail.value }); },
  onPhone(e) { this.setData({ phone: e.detail.value }); },
  onCity(e) { this.setData({ city: e.detail.value }); },
  onDogName(e) { this.setData({ dogName: e.detail.value }); },
  onDogBreed(e) { this.setData({ dogBreed: e.detail.value }); },
  onNote(e) { this.setData({ note: e.detail.value }); },
  onSubmit() {
    if (!this.data.name || !this.data.phone) { wx.showToast({ title: "请填写姓名和手机号", icon: "none" }); return; }
    wx.showModal({
      title: "确认报名",
      content: "套餐:" + this.data.pkgNames[this.data.pkgIdx] + "\n姓名:" + this.data.name + "\n提交后我们会微信联系确认支付",
      success: (r) => {
        if (r.confirm) { wx.showToast({ title: "报名已提交!", icon: "success" });
          // Cloud function would save here
        }
      }
    });
  }
});