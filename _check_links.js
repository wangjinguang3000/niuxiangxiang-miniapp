const fs = require('fs');
const appJson = JSON.parse(fs.readFileSync('app.json','utf8'));
const nonStore = appJson.pages.filter(p => !p.includes('store'));

let exposed = [];
nonStore.forEach(p => {
  ['wxml','js'].forEach(ext => {
    const fp = p + '.' + ext;
    if (fs.existsSync(fp)) {
      const c = fs.readFileSync(fp, 'utf8');
      if (c.includes('/pages/store/') && !c.includes('//store') && !c.includes('"store"')) {
        const matches = c.match(/[^.]\/pages\/store\/[^'"\s]+/g);
        if (matches) exposed.push(fp + ': ' + matches.join(', '));
      }
    }
  });
});

console.log('非store页面中暴露的store链接:');
if (exposed.length === 0) console.log('✅ 无暴露');
else exposed.forEach(e => console.log('❌', e));
