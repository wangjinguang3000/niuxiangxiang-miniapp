const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
exports.main = async (event) => {
  const { name, phone, address, type } = event;
  if (!name || !phone) return { success: false, error: '名称和电话必填' };
  const db = cloud.database();
  try {
    const res = await db.collection('stores').add({ data: {
      name, phone, address: address||'', type: type||'综合', status: 'pending',
      ownerId: cloud.getWXContext().OPENID, createdAt: new Date()
    }});
    return { success: true, id: res._id };
  } catch(e) { return { success: false, error: e.message }; }
};
