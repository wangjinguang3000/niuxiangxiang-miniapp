const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { tab = 'hot', page = 1, pageSize = 10, contestId } = event
  try {
    let query = db.collection('videos').where({ status: 'active' })
    if (tab === 'mine') query = query.where({ _openid: OPENID, status: 'active' })
    if (contestId) query = query.where({ contestId, status: 'active' })
    const sortField = tab === 'new' ? 'createdAt' : 'views'
    const res = await query.orderBy(sortField, 'desc').skip((page - 1) * pageSize).limit(pageSize).get()
    return { success: true, videos: res.data, hasMore: res.data.length === pageSize }
  } catch (e) { return { error: e.message } }
}
