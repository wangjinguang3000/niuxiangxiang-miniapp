const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { videoId, action, content, page = 1, pageSize = 20, commentId } = event
  try {
    if (action === 'add') {
      if (!content || content.length < 5) return { error: '评论至少5个字' }
      const doc = {
        _openid: OPENID,
        videoId,
        author: event.author || { nickname: '草原爱犬者', avatar: '' },
        content, likes: 0,
        createdAt: new Date()
      }
      await db.collection('comments').add({ data: doc })
      await db.collection('videos').doc(videoId).update({ data: { comments: _.inc(1) } })
      // 评论者+2金币
      await db.collection('users').where({ _openid: OPENID }).update({
        data: { coins: _.inc(2), totalEarned: _.inc(2) }
      })
      return { success: true, coinsEarned: 2 }
    } else if (action === 'list') {
      const res = await db.collection('comments').where({ videoId })
        .orderBy('createdAt', 'desc').skip((page - 1) * pageSize).limit(pageSize).get()
      return { success: true, comments: res.data, hasMore: res.data.length === pageSize }
    } else if (action === 'delete') {
      await db.collection('comments').doc(commentId).remove()
      return { success: true }
    }
    return { error: 'unknown action' }
  } catch (e) { return { error: e.message } }
}
