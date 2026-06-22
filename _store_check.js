const fs = require('fs');

// 1. Read current app.json
const app = JSON.parse(fs.readFileSync('app.json', 'utf8'));
console.log('当前页面数:', app.pages.length);

// 2. Store pages to add
const storePages = [
  'pages/store/index/index',
  'pages/store/list/list',
  'pages/store/apply/apply',
  'pages/store/admin/dashboard/dashboard',
  'pages/store/admin/orders/orders',
  'pages/store/admin/products/products',
  'pages/store/admin/settings/settings'
];

// 3. Verify store files exist
let allExist = true;
storePages.forEach(p => {
  ['js','wxml','wxss','json'].forEach(ext => {
    if (!fs.existsSync(p + '.' + ext)) {
      console.log('缺失:', p + '.' + ext);
      allExist = false;
    }
  });
});
console.log('Store文件:', allExist ? '✅ 完整' : '❌ 缺失');

// 4. Check store page content for review safety
let risks = [];
storePages.forEach(p => {
  const wxml = p + '.wxml';
  if (fs.existsSync(wxml)) {
    const c = fs.readFileSync(wxml, 'utf8');
    if (/入驻|店铺街|商家|商户/.test(c)) risks.push(p + ': ' + c.match(/入驻|店铺街|商家|商户/g).join(','));
  }
});
console.log('Store风险词:', risks.length === 0 ? '✅ 无' : '❌ ' + risks.length);
risks.forEach(r => console.log('  ', r));

// 5. Show partner page store links
const pw = 'pages/partner/partner.wxml';
if (fs.existsSync(pw)) {
  const pc = fs.readFileSync(pw, 'utf8');
  const lines = pc.split('\n');
  lines.forEach((l,i) => {
    if (l.includes('store') || l.includes('门店')) console.log('Partner链接:', (i+1), l.trim());
  });
}
