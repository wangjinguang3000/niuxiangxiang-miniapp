const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { nickname } = event

  // Check if user exists
  const res = await db.collection('users').where({ _openid: openid }).get()
  if (res.data.length === 0) {
    // New user - create with welcome bonus
    await db.collection('users').add({
      data: {
        _openid: openid,
        nickname: nickname || '草原爱犬者',
        avatar: (nickname || '草').charAt(0),
        coins: 500,
        totalEarned: 500,
        commission: 0,
        inviteCount: 0,
        tier: '普通会员',
        petInfo: null,
        addresses: [],
        createdAt: db.serverDate()
      }
    })
    return { isNew: true, coins: 500, message: '新人福利500金币已到账！' }
  }
  return { isNew: false, user: res.data[0] }
}
