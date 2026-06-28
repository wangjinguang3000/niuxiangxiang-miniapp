const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { postId, text } = event;
  if (!postId || !text || !text.trim()) return { success: false, error: '参数错误' };
  
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;
  
  try {
    const userRes = await db.collection('sys_user').where({ openId }).get();
    const user = userRes.data[0] || {};
    
    const comment = {
      id: Date.now().toString(),
      text: text.trim(),
      authorId: openId,
      authorName: user.nickName || '宠友',
      createdAt: new Date()
    };
    
    await db.collection('community_posts').doc(postId).update({
      data: { comments: _.inc(1), commentList: _.push([comment]) }
    });
    
    return { success: true, comment };
  } catch(e) {
    return { success: false, error: e.message };
  }
};
