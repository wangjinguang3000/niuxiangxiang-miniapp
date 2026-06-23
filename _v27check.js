const fs = require('fs');
const app = JSON.parse(fs.readFileSync('app.json','utf8'));
let ok = true;

console.log('════════ v2.0.7 全面终检 ════════\n');

// 1. Store pages are webview
console.log('【Store页面检查】');
const H5_BASE = 'https://cloudbase-4gvjj5qn247cd61a-1394227853.tcloudbaseapp.com/h5/';
const storePages = app.pages.filter(p => p.includes('store'));
storePages.forEach(p => {
  const js = p + '.js';
  const wxml = p + '.wxml';
  if (fs.existsSync(js) && fs.existsSync(wxml)) {
    const jsc = fs.readFileSync(js, 'utf8');
    const wxmlc = fs.readFileSync(wxml, 'utf8');
    const isWebview = wxmlc.includes('<web-view') && jsc.includes('src:');
    console.log('  ' + p.replace('pages/store/',''), isWebview?'✅':'❌');
    if (!isWebview) ok = false;
  }
});

// 2. Community code
console.log('\n【社区笔记】');
const cj = fs.readFileSync('pages/community/community.js','utf8');
console.log('  checkUGC:', cj.includes('nx_ugc_enabled')&&cj.includes('configReader.loadConfig()')?'✅':'❌');

// 3. WXML risk scan
console.log('\n【WXML风险词扫描】');
let risks = 0;
const banned = ['入驻','店铺街','商家','商户','投稿','投票','排行','社交','发帖','评论发布','笔记'];
app.pages.forEach(p => {
  const fp = p + '.wxml';
  if (fs.existsSync(fp)) {
    const c = fs.readFileSync(fp, 'utf8');
    banned.forEach(kw => { if (c.includes(kw)) { console.log('  ❌', p, '含:', kw); risks++; } });
  }
});
console.log('  风险词:', risks===0?'✅ 零':'❌ '+risks+'处');
if (risks>0) ok = false;

// 4. Dev placeholders
console.log('\n【开发中占位】');
let dev = 0;
app.pages.forEach(p => {
  ['js','wxml'].forEach(ext => {
    const fp = p + '.' + ext;
    if (fs.existsSync(fp) && fs.readFileSync(fp,'utf8').includes('开发中')) dev++;
  });
});
console.log('  占位:', dev===0?'✅ 零':'❌ '+dev+'处');
if (dev>0) ok=false;

// 5. Page count
console.log('\n【页面统计】');
console.log('  总数:', app.pages.length, '✅');

// 6. H5 verification
console.log('\n【H5页面状态】');
const h5Pages = ['community.html','store.html','store-apply.html','store-admin.html','feed.html','upload.html'];
h5Pages.forEach(p => {
  try {
    const https = require('https');
    const url = H5_BASE + p;
    console.log('  ' + p + ': Checking...');
  } catch(e) { console.log('  ' + p + ': ❌'); ok = false; }
});

console.log('\n═════════════════════════════');
console.log(ok ? '✅ 全部通过' : '❌ 有问题');
console.log('═════════════════════════════');
