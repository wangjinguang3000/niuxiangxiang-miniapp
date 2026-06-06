const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const res = await db.collection('users')
    .orderBy('inviteCount', 'desc')
    .limit(20)
    .field({ nickname: true, inviteCount: true })
    .get()
  return { leaderboard: res.data }
}
