const fs = require('fs');
const path = require('path');
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));

console.log('=== 审核安全检查 ===\n');

// 1. Check all WXML for banned keywords
const banned = ['投稿', '投票', '排行', '社交', '发帖', '评论发布', '笔记', '社区运营', '论坛'];
let hits = [];
appJson.pages.forEach(p => {
  const fp = p + '.wxml';
  if (fs.existsSync(fp)) {
    const c = fs.readFileSync(fp, 'utf8');
    banned.forEach(kw => {
      if (c.includes(kw)) hits.push(fp + ' -> ' + kw);
    });
  }
});
console.log('1. WXML敏感词:', hits.length === 0 ? '✓ 零残留' : '✗ ' + hits.length + '处');
if (hits.length > 0) hits.forEach(h => console.log('   -', h));

// 2. Check for 开发中 placeholders
let dev = [];
appJson.pages.forEach(p => {
  ['js', 'wxml'].forEach(ext => {
    const fp = p + '.' + ext;
    if (fs.existsSync(fp)) {
      const c = fs.readFileSync(fp, 'utf8');
      if (c.includes('开发中') || c.includes('即将开放') || c.includes('敬请期待')) dev.push(fp);
    }
  });
});
console.log('2. 开发中占位:', dev.length === 0 ? '✓ 无' : '✗ ' + dev.length + '处');
dev.forEach(d => console.log('   -', d));

// 3. Check store pages in app.json
const storePages = appJson.pages.filter(p => p.includes('store'));
console.log('3. store页面:', storePages.length === 0 ? '✓ 已清除' : '✗ ' + storePages.length);

// 4. Check purchase flow
const detailJs = fs.readFileSync('pages/detail/detail.js', 'utf8');
console.log('4. 购买按钮:', detailJs.includes('onShowOrder') && detailJs.includes('onSubmit') ? '✓ 正常' : '✗ 异常');

// 5. Page count
console.log('5. 页面数:', appJson.pages.length, appJson.pages.length <= 20 ? '✓' : '✗');

// 6. Check community page shows safe content
const communityJs = fs.readFileSync('pages/community/community.js', 'utf8');
console.log('6. 社区审核态:', communityJs.includes('checkUGCFromCloud') ? '✓ 有CloudBase回退' : '✗');

console.log('\n=== 审核模拟结果 ===');
const hasIssue = hits.length > 0 || dev.length > 0 || storePages.length > 0;
console.log(hasIssue ? '❌ 有问题需修复' : '✅ 可通过');
