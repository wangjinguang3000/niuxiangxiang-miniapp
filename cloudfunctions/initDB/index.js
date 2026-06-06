const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async () => {
  // Seed products
  const products = [
    { name: '风干牛肝干 80g', price: 16.00, marketPrice: 29.90, emoji: '\u{1F969}', bgColor: '#8B5E3C', category: 'dog', tagType: 'hot', tagText: '热卖', desc: '犬猫通用 | 高原散养 | 0添加', stock: 999, sales: 1520, commission: 10 },
    { name: '风干牛肝干 240g', price: 48.00, marketPrice: 79.90, emoji: '\u{1F381}', bgColor: '#8B5E3C', category: 'dog', tagType: 'new', tagText: '推荐', desc: '家庭装 | 训练奖励最佳', stock: 500, sales: 890, commission: 10 },
    { name: '风干牛肝干 480g 礼盒', price: 88.00, marketPrice: 149.00, emoji: '\u{1F4E6}', bgColor: '#8B5E3C', category: 'gift', tagType: 'new', tagText: '礼盒', desc: '送礼佳品 | 草原直供', stock: 200, sales: 340, commission: 12 },
    { name: '牛香香风干牛肉干', price: 68.00, marketPrice: null, emoji: '\u{1F402}', bgColor: '#5C8A45', category: 'human', tagType: 'new', tagText: '新品', desc: '人食级 | 草原黄牛 | 香辣/五香', stock: 300, sales: 120, commission: 10 },
    { name: '赛事能量包', price: 128.00, marketPrice: null, emoji: '\u{1F3C6}', bgColor: '#5C8A45', category: 'event', tagType: 'event', tagText: '赛事限定', desc: '牛肝干240g+牛肉干+水碗+纪念章', stock: 100, sales: 45, commission: 12 }
  ]

  for (const p of products) {
    const exists = await db.collection('products').where({ name: p.name }).get()
    if (exists.data.length === 0) {
      await db.collection('products').add({ data: p })
    }
  }

  return { message: 'Database initialized', productsSeeded: products.length }
}
