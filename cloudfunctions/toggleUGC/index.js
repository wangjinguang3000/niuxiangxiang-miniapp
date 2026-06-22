const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
exports.main = async (event, context) => {
  const db = cloud.database();
  try {
    await db.collection('config').doc('app').update({
      data: { ugc_enabled: true, review_mode: false, updatedAt: new Date() }
    });
    return { success: true, message: 'UGC已开启' };
  } catch(e) {
    return { success: false, error: e.message };
  }
};
