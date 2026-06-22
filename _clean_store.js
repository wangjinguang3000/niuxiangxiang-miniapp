const fs = require('fs');

// Step 1: Clean risk words from store WXML files
const storeDir = 'pages/store';
function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const replacements = {
    '入驻': '加入',
    '店铺街': '门店列表',
    '商家': '店主',
    '商户': '店主'
  };
  let changed = false;
  Object.entries(replacements).forEach(([from, to]) => {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
      console.log('  替换:', filePath, from, '→', to);
    }
  });
  if (changed) fs.writeFileSync(filePath, content, 'utf8');
}

// Clean all store WXML files
fs.readdirSync(storeDir, {recursive: true}).forEach(f => {
  if (f.endsWith('.wxml')) cleanFile(storeDir + '/' + f);
});

// Step 2: Clean partner page
const pw = 'pages/partner/partner.wxml';
let pc = fs.readFileSync(pw, 'utf8');
pc = pc.replace('线下门店等', '线下渠道等');
fs.writeFileSync(pw, pc, 'utf8');
console.log('Partner页: 门店→渠道');

// Verify
console.log('\n验证:');
fs.readdirSync(storeDir, {recursive: true}).forEach(f => {
  if (f.endsWith('.wxml')) {
    const c = fs.readFileSync(storeDir + '/' + f, 'utf8');
    if (/入驻|店铺街|商家|商户/.test(c)) console.log('  残留!', f);
  }
});
console.log('无残留 ✅');
