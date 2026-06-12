// 合伙人追踪系统 - 邀请链接、二级分润、团队管理
const app = getApp();

// 分润比例：合伙人60%，平台40%
const PARTNER_SHARE = 0.6;

// 生成邀请参数
function getInviteParams() {
  const user = app.globalData.userInfo || wx.getStorageSync('user') || {};
  const userId = user._id || user._openid || '';
  return userId ? 'ref=' + userId : '';
}

// 处理邀请参数（新用户注册时调用）
function handleInvite(options) {
  if (!options || !options.ref) return null;
  const refUserId = options.ref;
  wx.setStorageSync('invitedBy', refUserId);
  console.log('[Partner] Invited by:', refUserId);
  return refUserId;
}

// 计算佣金
function calculateCommission(amount, rate) {
  rate = rate || 0.1; // 默认10%
  return Math.round(amount * rate * 100) / 100;
}

// 计算合伙人分润
function calculatePartnerShare(profit) {
  return {
    partner: Math.round(profit * PARTNER_SHARE * 100) / 100,
    platform: Math.round(profit * (1 - PARTNER_SHARE) * 100) / 100
  };
}

// 城市合伙人等级
const CITY_TIERS = {
  bronze: { name: '青铜合伙人', minSales: 0, share: 0.5 },
  silver: { name: '白银合伙人', minSales: 5000, share: 0.55 },
  gold: { name: '黄金合伙人', minSales: 20000, share: 0.6 },
  diamond: { name: '钻石合伙人', minSales: 50000, share: 0.65 },
  city: { name: '城市合伙人', minSales: 100000, share: 0.7 }
};

function getPartnerTier(totalSales) {
  var tiers = Object.keys(CITY_TIERS).reverse();
  for (var i = 0; i < tiers.length; i++) {
    var tier = CITY_TIERS[tiers[i]];
    if (totalSales >= tier.minSales) return { key: tiers[i], ...tier };
  }
  return { key: 'bronze', ...CITY_TIERS.bronze };
}

// 生成专属推广链接
function generatePromoLink(type) {
  const user = app.globalData.userInfo || {};
  const userId = user._id || user._openid || '';
  var path = '/pages/index/index?ref=' + userId;
  if (type === 'product') path = '/pages/products/products?ref=' + userId;
  if (type === 'event') path = '/pages/event/event?ref=' + userId;
  if (type === 'partner') path = '/pages/partner/partner?ref=' + userId;
  return path;
}

// 生成推广海报
function generatePoster(type) {
  // 返回海报生成参数，实际海报用Canvas生成
  var posters = {
    product: { bg: '/images/banner-product.jpg', qrPath: generatePromoLink('product') },
    event: { bg: '/images/banner-event.jpg', qrPath: generatePromoLink('event') },
    partner: { bg: '/images/banner-partner.jpg', qrPath: generatePromoLink('partner') }
  };
  return posters[type] || posters.product;
}

module.exports = {
  getInviteParams: getInviteParams,
  handleInvite: handleInvite,
  calculateCommission: calculateCommission,
  calculatePartnerShare: calculatePartnerShare,
  getPartnerTier: getPartnerTier,
  generatePromoLink: generatePromoLink,
  generatePoster: generatePoster,
  CITY_TIERS: CITY_TIERS,
  PARTNER_SHARE: PARTNER_SHARE
};
