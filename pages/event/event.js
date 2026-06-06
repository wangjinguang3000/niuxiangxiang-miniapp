Page({
  data: {
    packages: [
      { name: '早鸟参赛', price: '1,780', original: '1,980', desc: '限前20组', benefits: ['1人1狗3天2晚全包','4大互动项目参赛资格','冠军奖金8000','赠品价值超539'] },
      { name: '标准参赛', price: '1,980', original: '', benefits: ['1人1狗3天2晚全包','4大互动项目参赛资格','冠军奖金8000','赠品价值超539'] },
      { name: '观摩票', price: '1,280', original: '', desc: '纯享受草原假期', benefits: ['不参赛 纯享受','3天2晚住宿餐饮全包','含礼品 摄影师跟拍','欢迎带狗围观'] }
    ],
    sponsors: [
      { name: '冠名赞助', price: '50,000', limit: '限1席', benefits: '赛事冠名权 | 主舞台LOGO | 所有物料品牌露出 | 现场展位20m2 | 线上专题页品牌专区 | 颁奖嘉宾席位' },
      { name: '金牌赞助', price: '20,000', limit: '限3席', benefits: '分项赛事冠名 | 现场展位10m2 | 物料品牌露出 | 线上推广位 | 产品植入参赛包' },
      { name: '联合赞助', price: '8,000', limit: '限10席', benefits: '现场展位5m2 | 品牌Logo墙 | 参赛包产品植入 | 线上赞助商名录展示' }
    ],
    schedule: [
      { day: 'Day1 周五', title: '启程日', items: ['14:00 多伦集合接驳','16:00 蒙古包入住','18:00 烤全羊欢迎晚宴','20:00 篝火破冰+抽签分组'] },
      { day: 'Day2 周六', title: '正赛日', items: ['09:00 意志力挑战/定力赛','11:00 叼物接力','14:00 趣味障碍赛','16:00 才艺走秀','19:00 颁奖晚宴 冠军8000'] },
      { day: 'Day3 周日', title: '落幕日', items: ['09:00 草原自由活动 摄影师一对一','10:00 代言狗评选拍摄','11:00 闭幕 下季预告','12:00 接驳返回多伦'] }
    ]
  },
  onRegister() { wx.navigateTo({ url: '/pages/register/register' }) },
  onSponsor() { wx.showToast({ title: '赞助咨询已提交！我们会尽快联系您。', icon: 'none' }) },
  onOnlineContest() { wx.navigateTo({ url: '/pages/contest/contest' }) },
  onFeed() { wx.navigateTo({ url: '/pages/feed/feed' }) }
})