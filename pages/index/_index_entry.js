const fs = require('fs');
let wxml = fs.readFileSync('index.wxml', 'utf8');

// Add store entry between partner bar and closing tag
const storeEntry = `
  <view class="store-entry" bindtap="onStoreEntry" style="margin:15px;background:#fff;border-radius:12px;padding:15px;display:flex;align-items:center;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
    <text style="font-size:30px;margin-right:12px">🏪</text>
    <view style="flex:1"><text style="font-size:15px;font-weight:bold;display:block">附近宠物门店</text><text style="font-size:12px;color:#999">美容·医疗·用品·寄养</text></view>
    <text style="background:#5C8A45;color:#fff;padding:6px 14px;border-radius:15px;font-size:12px">去看看</text>
  </view>`;

wxml = wxml.replace('</view>\n</view>', '</view>\n' + storeEntry + '\n</view>');
fs.writeFileSync('index.wxml', wxml, 'utf8');
console.log('Index WXML: store entry added ✅');

let js = fs.readFileSync('index.js', 'utf8');
if (!js.includes('onStoreEntry')) {
  js = js.replace('onShareAppMessage',
    'onStoreEntry() { wx.navigateTo({ url: "/pages/store/index/index" }); },\n  onShareAppMessage');
}
fs.writeFileSync('index.js', js, 'utf8');
console.log('Index JS: handler added ✅');
