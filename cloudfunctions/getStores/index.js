const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
exports.main = async (event) => {
  const db = cloud.database();
  try {
    const res = await db.collection('stores').where({status:'active'}).limit(50).get();
    return { success: true, data: res.data };
  } catch(e) { return { success: false, error: e.message }; }
};
