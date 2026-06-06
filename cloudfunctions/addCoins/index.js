const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const { amount, reason } = event

  await db.collection('users').where({ _openid: wxContext.OPENID }).update({
    data: { coins: db.command.inc(amount), totalEarned: db.command.inc(amount) }
  })

  // If invite, update invite count
  if (reason === 'invite') {
    await db.collection('users').where({ _openid: wxContext.OPENID }).update({
      data: { inviteCount: db.command.inc(1), commission: db.command.inc(10) }
    })
  }

  return { success: true, amount }
}
