const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { postId } = event;
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;
  
  try {
    const post = await db.collection('community_posts').doc(postId).get();
    const likeList = post.data.likeList || [];
    const index = likeList.indexOf(openId);
    const _ = db.command;
    
    if (index >= 0) {
      await db.collection('community_posts').doc(postId).update({
        data: { likes: _.inc(-1), likeList: _.pull(openId) }
      });
      return { success: true, liked: false };
    } else {
      await db.collection('community_posts').doc(postId).update({
        data: { likes: _.inc(1), likeList: _.push([openId]) }
      });
      return { success: true, liked: true };
    }
  } catch(e) {
    return { success: false, error: e.message };
  }
};
