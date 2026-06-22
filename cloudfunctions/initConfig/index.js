// 云函数: initConfig - 初始化配置集合
// 部署后在微信开发者工具中右键此函数 -> 上传并部署
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const db = cloud.database();
  
  try {
    // 检查config集合是否存在
    try {
      await db.collection('config').doc('app').get();
      // 已存在，更新
      await db.collection('config').doc('app').update({
        data: {
          ugc_enabled: true,
          review_mode: false,
          partner_enabled: true,
          h5_base: 'https://cloudbase-4gvjj5qn247cd61a-1394227853.tcloudbaseapp.com/h5/',
          updatedAt: new Date()
        }
      });
      return { success: true, message: '配置已更新', created: false };
    } catch(e) {
      // 不存在，创建
      await db.collection('config').add({
        data: {
          _id: 'app',
          ugc_enabled: false,
          review_mode: true,
          partner_enabled: true,
          h5_base: 'https://cloudbase-4gvjj5qn247cd61a-1394227853.tcloudbaseapp.com/h5/',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      return { success: true, message: '配置已创建', created: true };
    }
  } catch(e) {
    return { success: false, error: e.message };
  }
};
