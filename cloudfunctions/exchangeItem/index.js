const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const items = [
  { name: '3元购物抵用券', cost: 100, val: 3 },
  { name: '牛肝干80g体验装', cost: 150, val: 15 },
  { name: '赛事报名30元抵扣', cost: 300, val: 30 },
  { name: '牛肝干240g正装', cost: 480, val: 48 }
]

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const { itemId } = event
  const item = items[itemId]
  if (!item) return { error: '商品不存在' }

  const userRes = await db.collection('users').where({ _openid: wxContext.OPENID }).get()
  if (userRes.data.length === 0) return { error: '请先登录' }
  const user = userRes.data[0]

  if (user.coins < item.cost) return { error: '金币不足', need: item.cost - user.coins }

  // Deduct coins
  await db.collection('users').doc(user._id).update({
    data: { coins: db.command.inc(-item.cost) }
  })

  // Create exchange order
  const orderId = 'EX' + Date.now().toString(36).toUpperCase()
  await db.collection('orders').add({
    data: {
      orderId,
      _openid: wxContext.OPENID,
      items: [{ name: item.name, price: item.val, emoji: '\u{1F381}' }],
      total: 0,
      status: '已兑换',
      createdAt: db.serverDate()
    }
  })

  return { success: true, item: item.name, cost: item.cost }
}
