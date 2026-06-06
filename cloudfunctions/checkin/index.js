const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const today = new Date().toISOString().split('T')[0]

  // Check if already checked in today
  const todayCheck = await db.collection('checkins')
    .where({ _openid: openid, date: today }).get()
  if (todayCheck.data.length > 0) {
    return { error: '今天已签到', checkedToday: true }
  }

  // Get recent checkins to calculate streak
  const recent = await db.collection('checkins')
    .where({ _openid: openid })
    .orderBy('date', 'desc')
    .limit(7)
    .get()

  let streak = 0
  const checkDate = new Date(today)
  for (let i = 0; i < 7; i++) {
    const d = new Date(checkDate)
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().split('T')[0]
    if (recent.data.find(r => r.date === ds)) streak++
    else break
  }
  streak = Math.min(streak + 1, 7)

  // Rewards: [0, 5, 8, 12, 18, 25, 35, 50]
  const rewards = [0, 5, 8, 12, 18, 25, 35, 50]
  const reward = rewards[streak]

  // Save checkin
  await db.collection('checkins').add({
    data: { _openid: openid, date: today, streak, reward, createdAt: db.serverDate() }
  })

  // Add coins
  await db.collection('users').where({ _openid: openid }).update({
    data: { coins: db.command.inc(reward), totalEarned: db.command.inc(reward) }
  })

  return { success: true, streak, reward }
}
