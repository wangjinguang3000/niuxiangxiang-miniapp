const api = require('../../utils/cloud-api')
var app = getApp()
Page({
  data: {ugcEnabled:false,checkedToday:false,coins:0,userTier:'',posts:[],postText:'',postImages:[],uploading:false,loading:false,
    commentText:'',commentPostId:'',
    checkinDays:[{done:false,today:true,reward:5},{done:false,today:false,reward:8},{done:false,today:false,reward:12},{done:false,today:false,reward:18},{done:false,today:false,reward:25},{done:false,today:false,reward:35},{done:false,today:false,reward:50}],
    exchanges:[{emoji:'*',name:'test',desc:'desc',cost:100}]
  },
  onLoad(){this.checkConfig();this.loadUserData()},
  onShow(){this.checkConfig()},
  checkConfig(){var t=this;wx.cloud.callFunction({name:'getConfig',data:{}}).then(function(r){if(r.result&&r.result.success&&r.result.data&&r.result.data.ugc_enabled===true){t.setData({ugcEnabled:true});t.loadPosts()}else{t.setData({ugcEnabled:false})}}).catch(function(){})},
  loadUserData(){var u=app.globalData.userInfo||{};var c=app.globalData.coins||0;var n=['A','B','C','D'];this.setData({coins:c,userTier:n[c>=5000?3:c>=2000?2:c>=500?1:0]})},
  loadPosts(){var t=this;t.setData({loading:true});wx.cloud.callFunction({name:'getPosts',data:{page:1}}).then(function(r){if(r.result&&r.result.success){t.setData({posts:r.result.data||[],loading:false})}else{t.setData({loading:false})}}).catch(function(){t.setData({loading:false})})},
  onTextInput(e){this.setData({postText:e.detail.value})},
  onChooseImage(){
    var t=this;if(t.data.uploading)return
    wx.chooseImage({count:9,sizeType:['compressed'],sourceType:['album','camera'],success:function(res){
      t.setData({uploading:true})
      var files=res.tempFilePaths;var urls=[];var done=0
      for(var i=0;i<files.length;i++){
        (function(idx){
          var name='post_img_'+Date.now()+'_'+idx+'.jpg'
          wx.cloud.uploadFile({cloudPath:name,filePath:files[idx],success:function(r2){urls.push(r2.fileID);done++;if(done===files.length){t.setData({postImages:t.data.postImages.concat(urls),uploading:false})}}})
        })(i)
      }
    }})
  },
  onRemoveImage(e){var i=e.currentTarget.dataset.idx;var imgs=this.data.postImages;imgs.splice(i,1);this.setData({postImages:imgs})},
  onCreatePost(){
    var t=this;var text=t.data.postText;if(!text||!text.trim())return
    t.setData({uploading:true})
    wx.cloud.callFunction({name:'createPost',data:{text:text,images:t.data.postImages}}).then(function(r){
      t.setData({postText:'',postImages:[],uploading:false})
      if(r.result&&r.result.success){t.loadPosts();wx.showToast({title:'发布成功',icon:'success'})}
      else{wx.showToast({title:r.result.error||'发布失败',icon:'none'})}
    }).catch(function(){t.setData({uploading:false});wx.showToast({title:'网络错误',icon:'none'})})
  },
  onLikePost(e){
    var id=e.currentTarget.dataset.id;var posts=this.data.posts
    for(var i=0;i<posts.length;i++){if(posts[i]._id===id){posts[i].isLiked=!posts[i].isLiked;posts[i].likes=(posts[i].likes||0)+(posts[i].isLiked?1:-1);break}}
    this.setData({posts:posts});wx.cloud.callFunction({name:'likePost',data:{postId:id}}).catch(function(){})
  },
  onCommentFocus(e){this.setData({commentPostId:e.currentTarget.dataset.id})},
  onCommentInput(e){this.setData({commentText:e.detail.value})},
  onAddComment(){
    var t=this;var id=t.data.commentPostId;var text=t.data.commentText
    if(!id||!text||!text.trim())return
    wx.cloud.callFunction({name:'addComment',data:{postId:id,text:text.trim()}}).then(function(r){
      if(r.result&&r.result.success){t.setData({commentText:'',commentPostId:''});t.loadPosts();wx.showToast({title:'评论成功',icon:'success'})}
      else{wx.showToast({title:r.result.error||'评论失败',icon:'none'})}
    }).catch(function(){wx.showToast({title:'网络错误',icon:'none'})})
  },
  onChooseVideo(){
    var t=this
    wx.chooseVideo({sourceType:['album','camera'],maxDuration:60,success:function(res){
      var name='post_video_'+Date.now()+'.mp4'
      wx.cloud.uploadFile({cloudPath:name,filePath:res.tempFilePath,success:function(r2){
        t.setData({postImages:t.data.postImages.concat(r2.fileID)})
      }})
    }})
  },
  onCheckin(){this.setData({checkedToday:true,coins:this.data.coins+10})},
  onExchange(e){wx.showToast({title:'ok',icon:'success'})}
})