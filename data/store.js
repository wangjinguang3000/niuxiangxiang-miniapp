// 牛香香·草原爱宠营 - 数据中心
module.exports = {
  // Banner轮播
  banners: [
    { image: '/images/banner-event.jpg', title: '草原人宠互动季 S1', link: '/pages/event/event' },
    { image: '/images/banner-product.jpg', title: '牛肝干新品上市', link: '/pages/products/products' },
    { image: '/images/banner-partner.jpg', title: '城市合伙人招募', link: '/pages/partner/partner' }
  ],

  // 首页分类入口
  homeCategories: [
    { name: '大赛报名', icon: '/images/icon-event.jpg', path: '/pages/event/event' },
    { name: '牛肝干系列', icon: '/images/icon-product.jpg', path: '/pages/products/products' },
    { name: '新人福利', icon: '/images/icon-gift.jpg', path: '/pages/community/community' },
    { name: '城市合伙人', icon: '/images/icon-partner.jpg', path: '/pages/partner/partner' }
  ],

  // 产品列表
  products: [
    { id: 1, name: '风干牛肝干 80g 袋装', price: '16.00', marketPrice: '19.90', image: '/images/product-80g.jpg', tag: 'hot', desc: '锡林郭勒新鲜牛肝·0添加·低温烘焙', category: '牛肝干系列', stock: 999, sales: 1256, commission: '10%' },
    { id: 2, name: '风干牛肝干 240g 盒装(3袋)', price: '48.00', marketPrice: '58.00', image: '/images/product-240g.jpg', tag: 'new', desc: '回购首选·一次3袋更省心', category: '牛肝干系列', stock: 999, sales: 689, commission: '10%' },
    { id: 3, name: '风干牛肝干 480g 礼盒装', price: '88.00', marketPrice: '108.00', image: '/images/product-480g.jpg', tag: 'new', desc: '送品牌围巾·高端送礼首选', category: '牛肝干系列', stock: 500, sales: 234, commission: '12%' },
    { id: 4, name: '牛香香风干牛肉干', price: '68.00', marketPrice: '78.00', image: '/images/product-beef.jpg', desc: '草原牛肉·传统风干工艺', category: '牛肝干系列', stock: 300, sales: 412, commission: '10%' }
  ],

  // 赛事信息
  eventInfo: {
    name: '草原人宠互动季 S1',
    date: '2026年7月',
    location: '内蒙古·锡林郭勒盟·多伦县',
    packages: [
      { name: '早鸟参赛', price: '1,780', original: '1,980', desc: '限前20组', benefits: ['1人1狗·3天2晚全包', '4大互动项目参赛资格', '冠军奖金¥8,000', '赠品价值超¥539'] },
      { name: '标准参赛', price: '1,980', desc: '', benefits: ['1人1狗·3天2晚全包', '4大互动项目参赛资格', '冠军奖金¥8,000', '赠品价值超¥539'] },
      { name: '观摩票', price: '1,280', desc: '纯享受草原假期', benefits: ['不参赛·纯享受', '3天2晚住宿餐饮全包', '含礼品+摄影师跟拍', '欢迎带狗围观'] }
    ],
    schedule: [
      { day: 'Day1 周五', title: '启程日', items: ['14:00 多伦集合接驳', '16:00 蒙古包入住', '18:00 烤全羊欢迎晚宴', '20:00 篝火破冰+抽签分组'] },
      { day: 'Day2 周六', title: '正赛日', items: ['09:00 意志力挑战（定力王）', '11:00 叼物接力', '14:00 趣味障碍赛', '16:00 才艺走秀', '19:00 颁奖晚宴·冠军¥8,000'] },
      { day: 'Day3 周日', title: '落幕日', items: ['09:00 草原自由活动·摄影师一对一', '10:00 代言狗评选拍摄', '11:00 闭幕·下季预告·大合影', '12:00 接驳返回多伦'] }
    ]
  },

  // 城市合伙人
  partnerInfo: {
    models: [
      { name: '城市合伙人', investment: '5K-20K', desc: '独家区域代理，线上分销+线下宠物店渠道' },
      { name: '线上分销', investment: '免费', desc: '生成专属链接/海报，推荐成交赚佣金' },
      { name: '达人合作', investment: '样品支持', desc: '宠物博主/KOL，提供样品+拍摄素材' }
    ],
    highlights: ['自有SC食品工厂', '人食标准做宠物零食', '0防腐剂0诱食剂', '配料表只有新鲜牛肝']
  },

  // 转盘奖品
  wheelPrizes: [
    { name: '牛肝干80g', icon: '/images/wheel-80g.jpg', prob: 15 },
    { name: '牛肝干240g', icon: '/images/wheel-240g.jpg', prob: 5 },
    { name: '牛肝干480g', icon: '/images/wheel-480g.jpg', prob: 2 },
    { name: '100金币', icon: '/images/wheel-coin100.jpg', prob: 20 },
    { name: '50金币', icon: '/images/wheel-coin50.jpg', prob: 25 },
    { name: '3元券', icon: '/images/wheel-coupon3.jpg', prob: 18 },
    { name: '5元券', icon: '/images/wheel-coupon5.jpg', prob: 10 },
    { name: '谢谢参与', icon: '/images/wheel-thanks.jpg', prob: 5 }
  ],

  // 任务
  tasks: [
    { id: 1, name: '每日签到', reward: '+10金币', icon: '✓' },
    { id: 2, name: '推荐给好友', reward: '+20金币', icon: '↗' },
    { id: 3, name: '推荐到朋友圈', reward: '+30金币', icon: '📱' },
    { id: 4, name: '下单任意商品', reward: '+50金币', icon: '🛒' },
    { id: 5, name: '推荐好友注册', reward: '+100金币', icon: '👥' },
    { id: 6, name: '晒单评价', reward: '+30金币', icon: '⭐' },
    { id: 7, name: '累计消费满100元', reward: '+200金币', icon: '💰' }
  ],

  // 攻略
  guides: [
    { title: '参赛流程', content: '1.小程序报名 → 2.选套餐 → 3.支付 → 4.收到确认 → 5.到锡林郭勒草原！' },
    { title: '喂食指南', content: '小型犬10-20g/天，中型犬20-40g，大型犬40-60g。可整块或掰碎喂食，训练奖励最佳。' },
    { title: '合作模式', content: '城市合伙人5K-20K、线上分销免费、达人合作样品支持。自有工厂，品牌直供。' },
    { title: '品牌故事', content: '锡林郭勒草原，自有SC食品工厂。一个人，一家厂，一群爱狗人的草原聚会。配料表只有新鲜牛肝——我们自己都吃。' }
  ],

  // 社群
  community: {
    wechat: '牛香香宠物零食',
    phone: '13145294218',
    remark: '备注"参赛"或"合作"'
  },

  // 分销佣金规则
  commission: {
    level1: '10%',
    level2: '12%',
    minWithdraw: 10,
    desc: '推荐好友下单即可获得佣金，满10元即可提现'
  }
}
