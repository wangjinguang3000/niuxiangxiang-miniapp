const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const wxContext = cloud.getWXContext()
  const userRes = await db.collection('users').where({ _openid: wxContext.OPENID }).get()
  if (userRes.data.length === 0) return { error: '请先登录' }
  const user = userRes.data[0]

  if (user.commission < 10) return { error: '佣金满10元才能转金币', commission: user.commission }

  const earned = Math.floor(user.commission)
  const bonusCoins = earned * 500

  await db.collection('users').doc(user._id).update({
    data: {
      commission: db.command.inc(-earned),
      coins: db.command.inc(bonusCoins),
      totalEarned: db.command.inc(bonusCoins)
    }
  })

  return { success: true, earned, bonusCoins, value: (bonusCoins / 100).toFixed(2) }
}
