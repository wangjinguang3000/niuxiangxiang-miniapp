const fs = require('fs');

// Add store entry to partner page WXML
let wxml = fs.readFileSync('partner.wxml', 'utf8');
const storeEntry = `
  <view class="section-title" style="margin-top:20px">🏪 宠物门店</view>
  <view class="store-entry" style="background:#fff;margin:15px;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
    <view class="store-card" bindtap="onStoreList" style="display:flex;align-items:center;padding:15px;border-bottom:1px solid #f0f0f0">
      <text style="font-size:28px;margin-right:12px">🔍</text>
      <view style="flex:1"><text style="font-size:15px;font-weight:bold;display:block">浏览附近门店</text><text style="font-size:12px;color:#999">发现身边的宠物服务</text></view>
      <text style="color:#5C8A45;font-size:12px">去看看 ></text>
    </view>
    <view class="store-card" bindtap="onStoreApply" style="display:flex;align-items:center;padding:15px">
      <text style="font-size:28px;margin-right:12px">📝</text>
      <view style="flex:1"><text style="font-size:15px;font-weight:bold;display:block">门店入驻</text><text style="font-size:12px;color:#999">999元/年·千店千面·AI推荐</text></view>
      <text style="color:#F7931E;font-size:12px">立即入驻 ></text>
    </view>
  </view>`;

// Insert before the last closing tag
wxml = wxml.replace('</view>', storeEntry + '\n</view>');
fs.writeFileSync('partner.wxml', wxml, 'utf8');
console.log('Partner WXML: store entry added ✅');

// Add JS handlers
let js = fs.readFileSync('partner.js', 'utf8');
if (!js.includes('onStoreList')) {
  js = js.replace('onShareAppMessage', 
    'onStoreList() { wx.navigateTo({ url: "/pages/store/index/index" }); },\n  onStoreApply() { wx.navigateTo({ url: "/pages/store/apply/apply" }); },\n  onShareAppMessage');
}
fs.writeFileSync('partner.js', js, 'utf8');
console.log('Partner JS: handlers added ✅');
