const fs = require('fs');

// ========================================
// 2. store-apply.html - 门店入驻申请
// ========================================
const applyHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>门店入驻申请</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#F5F0E8;color:#333}
.header{background:linear-gradient(135deg,#5C8A45,#3D6B2E);color:#fff;padding:25px 20px;text-align:center}
.header h1{font-size:20px;margin-bottom:5px}
.header p{font-size:13px;opacity:0.85}
.benefits{display:flex;flex-wrap:wrap;gap:10px;padding:15px;background:#fff;margin-bottom:10px}
.benefit-item{flex:1;min-width:45%;text-align:center;padding:12px;background:#F5F0E8;border-radius:10px}
.benefit-emoji{font-size:24px;display:block;margin-bottom:5px}
.benefit-title{font-size:13px;font-weight:bold}
.benefit-desc{font-size:11px;color:#999}
.form-card{background:#fff;margin:0 15px 15px;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.form-title{font-size:16px;font-weight:bold;color:#5C8A45;margin-bottom:15px}
.form-group{margin-bottom:15px}
.form-group label{display:block;font-size:13px;font-weight:bold;margin-bottom:5px;color:#666}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;font-size:14px;outline:none}
.form-group textarea{height:80px;resize:vertical}
.form-group select{appearance:none;background:#fff url("data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'12\\' height=\\'12\\' viewBox=\\'0 0 12 12\\'><path fill=\\'%23999\\' d=\\'M6 8L1 3h10z\\'/></svg>") no-repeat right 12px center}
.submit-btn{width:100%;padding:15px;background:linear-gradient(135deg,#5C8A45,#3D6B2E);color:#fff;border:none;border-radius:25px;font-size:16px;font-weight:bold;margin-top:10px}
.price-info{text-align:center;padding:15px;background:#FFF8E1;border-radius:10px;margin-bottom:15px}
.price{font-size:28px;font-weight:bold;color:#F7931E}
.price-desc{font-size:12px;color:#999;margin-top:3px}
</style>
</head>
<body>
<div class="header">
  <h1>🏪 门店入驻申请</h1>
  <p>加入牛香香宠物门店网络</p>
</div>
<div class="benefits">
  <div class="benefit-item"><span class="benefit-emoji">📱</span><span class="benefit-title">专属小程序</span><span class="benefit-desc">千店千面·独立展示</span></div>
  <div class="benefit-item"><span class="benefit-emoji">🤖</span><span class="benefit-title">AI推荐</span><span class="benefit-desc">搜索引擎优先展示</span></div>
  <div class="benefit-item"><span class="benefit-emoji">💰</span><span class="benefit-title">高额分润</span><span class="benefit-desc">销售额最高返15%</span></div>
  <div class="benefit-item"><span class="benefit-emoji">📊</span><span class="benefit-title">数据后台</span><span class="benefit-desc">订单·客户全管理</span></div>
</div>
<div class="price-info">
  <div class="price">999<span style="font-size:14px">元/年</span></div>
  <div class="price-desc">含7页专属小程序·无限商品·AI推荐</div>
</div>
<div class="form-card">
  <div class="form-title">📝 填写申请信息</div>
  <div class="form-group"><label>门店名称 *</label><input type="text" id="storeName" placeholder="请输入门店名称"></div>
  <div class="form-group"><label>联系人 *</label><input type="text" id="contactName" placeholder="请输入联系人姓名"></div>
  <div class="form-group"><label>联系电话 *</label><input type="tel" id="phone" placeholder="请输入联系电话"></div>
  <div class="form-group"><label>门店类型</label>
    <select id="storeType"><option value="">请选择</option><option value="grooming">宠物美容</option><option value="vet">宠物医疗</option><option value="shop">宠物用品</option><option value="boarding">宠物寄养</option><option value="other">其他</option></select>
  </div>
  <div class="form-group"><label>门店地址</label><input type="text" id="address" placeholder="请输入门店地址"></div>
  <div class="form-group"><label>门店简介</label><textarea id="desc" placeholder="介绍一下你的门店..."></textarea></div>
  <button class="submit-btn" onclick="submitApply()">提交申请</button>
</div>
<script>
function submitApply() {
  var name = document.getElementById('storeName').value.trim();
  var contact = document.getElementById('contactName').value.trim();
  var phone = document.getElementById('phone').value.trim();
  if (!name) { alert('请填写门店名称'); return; }
  if (!contact) { alert('请填写联系人'); return; }
  if (!phone) { alert('请填写联系电话'); return; }
  alert('申请已提交！\\n\\n我们将尽快与您联系\\n客服微信：13145294218');
}
</script>
</body>
</html>`;

fs.writeFileSync('store-apply.html', applyHtml, 'utf8');
console.log('✅ store-apply.html created');
