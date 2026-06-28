const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { page = 1, pageSize = 20 } = event;
  try {
    const res = await db.collection('community_posts')
      .orderBy('createdAt', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();
    return { success: true, data: res.data, hasMore: res.data.length === pageSize };
  } catch(e) {
    return { success: false, error: e.message };
  }
};
