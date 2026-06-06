const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { title, videoUrl, coverUrl, duration, tags, contestId } = event
  try {
    const doc = {
      _openid: OPENID,
      author: event.author || { nickname: '草原爱犬者', avatar: '' },
      title: title || '分享我的毛孩子',
      videoUrl: videoUrl || '',
      coverUrl: coverUrl || '',
      duration: duration || 15,
      tags: tags || [],
      views: 0, likes: 0, comments: 0, shares: 0,
      isFeatured: false,
      contestId: contestId || '',
      status: 'active',
      createdAt: new Date()
    }
    const res = await db.collection('videos').add({ data: doc })
    await db.collection('users').where({ _openid: OPENID }).update({
      data: { coins: _.inc(20), totalEarned: _.inc(20) }
    })
    if (contestId) {
      await db.collection('contests').doc(contestId).update({
        data: { participantCount: _.inc(1) }
      })
    }
    return { success: true, videoId: res._id, coinsEarned: 20 }
  } catch (e) { return { error: e.message } }
}
