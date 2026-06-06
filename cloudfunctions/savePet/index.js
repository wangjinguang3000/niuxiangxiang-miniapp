const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const { name, breed, age } = event
  await db.collection('users').where({ _openid: wxContext.OPENID }).update({
    data: { petInfo: { name, breed, age } }
  })
  return { success: true }
}
