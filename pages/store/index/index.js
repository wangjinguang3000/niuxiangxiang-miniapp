var app = getApp()
Page({
  data: {storeEnabled:false,stores:[],loading:false},
  onLoad(){this.checkStore();this.loadStores()},
  onShow(){this.checkStore()},
  checkStore(){var t=this;wx.cloud.callFunction({name:'getConfig',data:{}}).then(function(r){if(r.result&&r.result.success&&r.result.data&&r.result.data.store_enabled===true){t.setData({storeEnabled:true})}}).catch(function(){})},
  loadStores(){var t=this;t.setData({loading:true});wx.cloud.callFunction({name:'getStores',data:{}}).then(function(r){if(r.result&&r.result.success){t.setData({stores:r.result.data||[],loading:false})}else{t.setData({loading:false})}}).catch(function(){t.setData({loading:false})})},
  goDetail(e){wx.navigateTo({url:'/pages/store/list/list?id='+e.currentTarget.dataset.id})},
  goApply(){wx.navigateTo({url:'/pages/store/apply/apply'})}
})