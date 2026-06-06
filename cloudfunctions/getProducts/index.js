const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { category, search } = event
  let query = db.collection('products')
  if (category && category !== 'all') {
    query = query.where({ category: category })
  }
  const res = await query.get()
  let products = res.data
  if (search) {
    const s = search.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(s) || 
      (p.desc || '').toLowerCase().includes(s)
    )
  }
  return { products }
}
