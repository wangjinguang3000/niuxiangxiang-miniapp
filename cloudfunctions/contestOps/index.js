const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { action, contestId, videoId, page = 1, pageSize = 20 } = event
  try {
    if (action === 'list') {
      const res = await db.collection('contests').orderBy('createdAt', 'desc').get()
      return { success: true, contests: res.data }
    } else if (action === 'detail') {
      const contestRes = await db.collection('contests').doc(contestId).get()
      if (!contestRes.data) return { error: '赛事不存在' }
      // 获取参赛作品排名
      const entriesRes = await db.collection('videos')
        .where({ contestId, status: 'active' })
        .orderBy('likes', 'desc').limit(100).get()
      return { success: true, contest: contestRes.data, entries: entriesRes.data }
    } else if (action === 'vote') {
      if (!contestId || !videoId) return { error: '参数不全' }
      // 检查赛事阶段
      const contestRes = await db.collection('contests').doc(contestId).get()
      if (!contestRes.data) return { error: '赛事不存在' }
      const contest = contestRes.data
      if (contest.phase !== 'vote') return { error: '当前不在投票期' }
      const now = new Date()
      if (now < new Date(contest.voteStart) || now > new Date(contest.voteEnd)) return { error: '不在投票时间范围内' }
      // 检查今日是否已投过此作品
      const today = now.toISOString().split('T')[0]
      const existVote = await db.collection('votes').where({ _openid: OPENID, contestId, videoId, date: today }).get()
      if (existVote.data.length > 0) return { error: '今天已给此作品投过票' }
      // 记录投票
      await db.collection('votes').add({ data: { _openid: OPENID, contestId, videoId, date: today, createdAt: now } })
      // 更新视频点赞数（用likes作为票数）
      await db.collection('videos').doc(videoId).update({ data: { likes: _.inc(1) } })
      // 更新赛事总票数
      await db.collection('contests').doc(contestId).update({ data: { totalVotes: _.inc(1) } })
      // 投票者+1金币
      await db.collection('users').where({ _openid: OPENID }).update({
        data: { coins: _.inc(1), totalEarned: _.inc(1) }
      })
      return { success: true, message: '投票成功！+1金币' }
    } else if (action === 'enter') {
      // 将已有视频报名参赛
      if (!contestId || !videoId) return { error: '参数不全' }
      const contestRes = await db.collection('contests').doc(contestId).get()
      if (!contestRes.data) return { error: '赛事不存在' }
      const contest = contestRes.data
      if (contest.phase !== 'submit') return { error: '当前不在投稿期' }
      const videoRes = await db.collection('videos').doc(videoId).get()
      if (!videoRes.data || videoRes.data._openid !== OPENID) return { error: '视频不存在或非本人作品' }
      if (videoRes.data.contestId) return { error: '该视频已参赛' }
      await db.collection('videos').doc(videoId).update({ data: { contestId } })
      await db.collection('contests').doc(contestId).update({ data: { participantCount: _.inc(1) } })
      return { success: true, message: '报名成功！' }
    } else if (action === 'myDailyVotes') {
      const today = new Date().toISOString().split('T')[0]
      const res = await db.collection('votes').where({ _openid: OPENID, contestId, date: today }).get()
      return { success: true, todayVotes: res.data.length, votedIds: res.data.map(v => v.videoId) }
    }
    return { error: 'unknown action' }
  } catch (e) { return { error: e.message } }
}
