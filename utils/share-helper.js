/**
 * 统一分享配置工具
 * 所有页面引入此模块即可获得标准化分享卡片
 */
const SHARE_CONFIG = {
  title: '草原爱宠营 | 带狗来草原撒野！',
  path: '/pages/index/index',
  imageUrl: '/images/share-card.jpg', // 需要一张分享卡片图(5:4比例, <200KB)
  desc: '锡林郭勒草原人宠互动季 | 牛肝干宠物零食 | 遛狗赚金币'
}

/**
 * 为页面混入标准分享行为
 * @param {Object} pageObj - Page()的参数对象
 * @param {Object} customShare - 可选，自定义分享内容
 */
function withShare(pageObj, customShare = {}) {
  const config = { ...SHARE_CONFIG, ...customShare }
  
  pageObj.onShareAppMessage = function(options) {
    return {
      title: config.title,
      path: config.path,
      imageUrl: config.imageUrl
    }
  }
  
  pageObj.onShareTimeline = function() {
    return {
      title: config.title,
      query: '',
      imageUrl: config.imageUrl
    }
  }
  
  return pageObj
}

/**
 * 快捷：产品分享卡片
 */
function productShare(product) {
  return {
    title: `${product.name || '牛肝干'} | 配料表只有新鲜牛肝`,
    path: `/pages/products/products?id=${product.id || ''}`,
    imageUrl: product.image || '/images/share-card.jpg'
  }
}

/**
 * 快捷：赛事分享卡片
 */
function eventShare() {
  return {
    title: '草原人宠互动季报名中！3天2晚蒙古包+烤全羊',
    path: '/pages/event/event',
    imageUrl: '/images/share-card.jpg'
  }
}

/**
 * 快捷：内容分享（动态feed）
 */
function feedShare(item) {
  return {
    title: item.title || '草原爱宠营精彩内容',
    path: `/pages/feed/feed?id=${item.id || ''}`,
    imageUrl: item.image || '/images/share-card.jpg'
  }
}

module.exports = {
  SHARE_CONFIG,
  withShare,
  productShare,
  eventShare,
  feedShare
}