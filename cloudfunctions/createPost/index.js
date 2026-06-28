const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { text, images } = event;
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;
  
  if (!text || text.trim().length === 0) {
    return { success: false, error: '内容不能为空' };
  }
  
  try {
    const userRes = await db.collection('sys_user').where({ openId }).get();
    const user = userRes.data[0] || {};
    
    const post = {
      text: text.trim(),
      images: images || [],
      authorId: openId,
      authorName: user.nickName || '宠友',
      authorAvatar: user.avatarUrl || '',
      likes: 0,
      likeList: [],
      comments: 0,
      commentList: [],
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    };
    
    const res = await db.collection('community_posts').add({ data: post });
    return { success: true, postId: res._id, post };
  } catch(e) {
    return { success: false, error: e.message };
  }
};
