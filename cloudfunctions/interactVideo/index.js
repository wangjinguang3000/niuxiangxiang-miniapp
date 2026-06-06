const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { videoId, action } = event // action: 'view' | 'like' | 'share'
  try {
    const videoRes = await db.collection('videos').doc(videoId).get()
    if (!videoRes.data) return { error: '视频不存在' }
    const video = videoRes.data
    let coinReward = 0
    const updates = {}
    if (action === 'view') {
      updates.views = _.inc(1)
      coinReward = 1
      // 创作者被动收益：每10次观看+1金币
      if ((video.views + 1) % 10 === 0) {
        await db.collection('users').where({ _openid: video._openid }).update({
          data: { coins: _.inc(1), totalEarned: _.inc(1) }
        })
      }
    } else if (action === 'like') {
      updates.likes = _.inc(1)
      coinReward = 1
      await db.collection('users').where({ _openid: video._openid }).update({
        data: { coins: _.inc(2), totalEarned: _.inc(2) }
      })
    } else if (action === 'share') {
      updates.shares = _.inc(1)
      coinReward = 5
    }
    await db.collection('videos').doc(videoId).update({ data: updates })
    // 给互动者加金币
    if (coinReward > 0) {
      await db.collection('users').where({ _openid: OPENID }).update({
        data: { coins: _.inc(coinReward), totalEarned: _.inc(coinReward) }
      })
    }
    return { success: true, coinReward }
  } catch (e) { return { error: e.message } }
}
