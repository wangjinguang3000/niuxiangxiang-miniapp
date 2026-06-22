const fs = require('fs');
const js = fs.readFileSync('community.js', 'utf8');

// Verify the key parts
console.log('=== onLoad ===');
const onLoadStart = js.indexOf('onLoad(options)');
const onLoadEnd = js.indexOf('},', onLoadStart) + 2;
console.log(js.substring(onLoadStart, onLoadEnd));

console.log('');
console.log('=== onShow ===');
const onShowStart = js.indexOf('onShow()');
const onShowEnd = js.indexOf('},', onShowStart) + 2;
console.log(js.substring(onShowStart, onShowEnd));

console.log('');
console.log('=== checkUGC ===');
const ugcStart = js.indexOf('async checkUGC()');
const ugcEnd = js.indexOf('showCheckin()', ugcStart);
console.log(js.substring(ugcStart, ugcEnd));

// Simulate logic
console.log('');
console.log('=== 逻辑追踪(UGC=true) ===');
console.log('1. onLoad → this.checkUGC() → 返回Promise');
console.log('2. configReader.loadConfig() → CloudBase → {ugc_enabled:true}');
console.log('3. wx.redirectTo(webview) → return true');
console.log('4. .then(skip=true) → 不调loadUserData ✓');
console.log('');
console.log('=== 逻辑追踪(UGC=false审核时) ===');
console.log('1. onLoad → checkUGC() → Promise');
console.log('2. CloudBase → {ugc_enabled:false}');
console.log('3. catch无异常 → 回退缓存 → false');
console.log('4. return false → .then(skip=false) → loadUserData → 签到页 ✓');
