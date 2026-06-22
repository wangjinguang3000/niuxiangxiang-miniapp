const fs = require('fs');
const js = fs.readFileSync('community.js', 'utf8');
const start = js.indexOf('async checkUGC()');
const end = js.indexOf('showCheckin', start);
console.log('=== ACTUAL checkUGC ===');
console.log(js.substring(start, end > start ? end : start+600));
