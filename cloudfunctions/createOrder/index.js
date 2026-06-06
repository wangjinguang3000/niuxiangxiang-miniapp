const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { items, total, address, coinUsed, vipDiscount } = event

  // Get user
  const userRes = await db.collection('users').where({ _openid: openid }).get()
  if (userRes.data.length === 0) return { error: '用户未登录' }
  const user = userRes.data[0]

  // Deduct coins
  if (coinUsed > 0) {
    await db.collection('users').doc(user._id).update({
      data: { coins: db.command.inc(-coinUsed) }
    })
  }

  // Add commission (10% of total)
  const commission = Math.floor(total * 0.1 * 100) / 100

  // Create order
  const orderId = 'NX' + Date.now().toString(36).toUpperCase()
  const order = {
    orderId,
    _openid: openid,
    items,
    total,
    address,
    coinUsed,
    vipDiscount,
    commission,
    status: '待发货',
    createdAt: db.serverDate()
  }
  await db.collection('orders').add({ data: order })

  // Update user coins
  const coinReward = Math.floor(total)
  await db.collection('users').doc(user._id).update({
    data: {
      coins: db.command.inc(coinReward),
      totalEarned: db.command.inc(coinReward)
    }
  })

  return { success: true, orderId, coinReward, commission }
}
