// 初始化门店SaaS数据库
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async () => {
  const db = cloud.database();
  const results = [];
  
  // Create stores collection
  try {
    await db.createCollection('stores');
    results.push('stores: created');
  } catch(e) { results.push('stores: ' + (e.message.includes('exist') ? 'exists' : e.message)); }

  // Create store_products collection
  try {
    await db.createCollection('store_products');
    results.push('store_products: created');
  } catch(e) { results.push('store_products: ' + (e.message.includes('exist') ? 'exists' : e.message)); }

  // Create store_orders collection
  try {
    await db.createCollection('store_orders');
    results.push('store_orders: created');
  } catch(e) { results.push('store_orders: ' + (e.message.includes('exist') ? 'exists' : e.message)); }

  // Insert demo store
  try {
    await db.collection('stores').add({
      data: {
        _id: 'store_demo',
        name: 'Demo宠物生活馆',
        logo: '', banner: '',
        intro: '示例门店-开发测试用',
        phone: '13800000000',
        address: '深圳市南山区',
        hours: '09:00-21:00',
        color: '#8B5E3C',
        status: 'active',
        ownerId: 'demo_owner',
        plan: 'premium',
        createdAt: new Date()
      }
    });
    results.push('demo store: inserted');
  } catch(e) { results.push('demo store: ' + (e.message.includes('duplicate') ? 'exists' : e.message)); }

  return { success: true, results };
};
