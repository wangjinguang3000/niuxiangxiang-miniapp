const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
exports.main = async () => {
  const db = cloud.database();
  try {
    const res = await db.collection('config').doc('app').get();
    return { success: true, data: res.data };
  } catch(e) {
    return { success: false, error: e.message };
  }
};
