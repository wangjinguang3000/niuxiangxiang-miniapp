var app = getApp()
Page({
  data: {name:'',phone:'',address:'',type:'综合'},
  onNameInput(e){this.setData({name:e.detail.value})},
  onPhoneInput(e){this.setData({phone:e.detail.value})},
  onAddrInput(e){this.setData({address:e.detail.value})},
  onTypePick(e){this.setData({type:['综合','医疗','美容','用品','寄养'][e.detail.value]})},
  onSubmit(){
    var d=this.data
    if(!d.name||!d.phone){wx.showToast({title:'名称和电话必填',icon:'none'});return}
    wx.cloud.callFunction({name:'createStore',data:{name:d.name,phone:d.phone,address:d.address,type:d.type}}).then(function(r){
      if(r.result&&r.result.success){wx.showToast({title:'申请已提交',icon:'success'});setTimeout(function(){wx.navigateBack()},1500)}
      else{wx.showToast({title:r.result.error||'提交失败',icon:'none'})}
    }).catch(function(){wx.showToast({title:'网络错误',icon:'none'})})
  }
})