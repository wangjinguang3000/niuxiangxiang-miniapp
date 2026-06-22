const fs = require('fs');
let js = fs.readFileSync('community.js', 'utf8');

// Change onLoad and onShow to use async checkUGC
js = js.replace(
  'onLoad(options) {\n    if (this.checkUGC()) return;\n    this.loadUserData();\n  },',
  'onLoad(options) {\n    this.checkUGC().then(function(skip) { if (!skip) this.loadUserData(); }.bind(this));\n  },'
);

js = js.replace(
  'onShow() { if (this.checkUGC()) return; this.loadUserData(); },',
  'onShow() { this.checkUGC().then(function(skip) { if (!skip) this.loadUserData(); }.bind(this)); },'
);

fs.writeFileSync('community.js', js, 'utf8');
console.log('OK: onLoad/onShow updated for async');
