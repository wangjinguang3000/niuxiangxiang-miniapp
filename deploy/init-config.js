// CloudBase 数据库配置初始化
// 用法: node deploy/init-config.js

const ENV_ID = 'cloudbase-4gvjj5qn247cd61a';

async function main() {
  console.log('初始化数据库配置...');
  console.log('环境ID:', ENV_ID);

  let cloudbase;
  try {
    cloudbase = require('@cloudbase/node-sdk');
  } catch(e) {
    console.log('[!] @cloudbase/node-sdk 未安装，正在安装...');
    require('child_process').execSync('npm install @cloudbase/node-sdk --save', { 
      cwd: __dirname + '/..',
      stdio: 'inherit' 
    });
    cloudbase = require('@cloudbase/node-sdk');
  }

  const app = cloudbase.init({ env: ENV_ID });
  const db = app.database();

  try {
    // Try to get config doc
    try {
      const res = await db.collection('config').doc('app').get();
      if (res.data && res.data.length > 0) {
        // Update existing
        await db.collection('config').doc('app').update({
          ugc_enabled: false,
          review_mode: true,
          partner_enabled: true,
          h5_base: 'https://cloudbase-4gvjj5qn247cd61a-1394227853.tcloudbaseapp.com/h5/',
          updatedAt: new Date()
        });
        console.log('[OK] config集合已更新');
      }
    } catch(e) {
      // Not exist, create collection + doc
      try {
        await db.createCollection('config');
        console.log('  config集合已创建');
      } catch(e2) {
        console.log('  config集合已存在');
      }
      await db.collection('config').add({
        _id: 'app',
        ugc_enabled: false,
        review_mode: true,
        partner_enabled: true,
        h5_base: 'https://cloudbase-4gvjj5qn247cd61a-1394227853.tcloudbaseapp.com/h5/',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('[OK] config文档已创建');
    }

    console.log('');
    console.log('数据库初始化完成!');
    console.log('配置状态:');
    console.log('  ugc_enabled: false (审核安全模式)');
    console.log('  review_mode: true');
    console.log('  partner_enabled: true');
  } catch(e) {
    console.error('[X] 初始化失败:', e.message);
    console.log('');
    console.log('备用方案: 在微信开发者工具中');
    console.log('  右键 cloudfunctions/initConfig -> 上传并部署');
    process.exit(1);
  }
}

main();
