const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const [usersRes, ordersRes, productsRes] = await Promise.all([
    db.collection('users').count(),
    db.collection('orders').count(),
    db.collection('products').get()
  ])

  const recentOrders = await db.collection('orders')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get()

  return {
    userCount: usersRes.total,
    orderCount: ordersRes.total,
    productCount: productsRes.data.length,
    recentOrders: recentOrders.data
  }
}
