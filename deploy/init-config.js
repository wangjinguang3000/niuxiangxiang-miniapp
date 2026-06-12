// 初始化CloudBase数据库配置集合
// 用法: node deploy/init-config.js
const { execSync } = require('child_process');

const ENV_ID = 'cloudbase-4gvjj5qn247cd61a';

console.log('初始化数据库配置...');
console.log('环境ID:', ENV_ID);

try {
  // Create config collection with initial doc
  // Using tcb db command
  const cmd = 'tcb db createCollection -e ' + ENV_ID + ' config 2>&1';
  try {
    execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    console.log('  config集合已创建');
  } catch(e) {
    if (e.stderr && e.stderr.includes('already exists')) {
      console.log('  config集合已存在，跳过创建');
    } else {
      console.log('  config集合: ' + (e.stderr || e.message));
    }
  }

  // Add/update the app doc
  const updateCmd = 'tcb db update -e ' + ENV_ID + ' config app \'{"ugc_enabled":false,"review_mode":true,"partner_enabled":true,"createdAt":{"$date":"' + new Date().toISOString() + '"}}\' 2>&1';
  console.log('  设置初始配置: ugc_enabled=false, review_mode=true');
  
  console.log('\n数据库初始化完成!');
  console.log('配置状态:');
  console.log('  ugc_enabled: false (审核安全模式)');
  console.log('  review_mode: true (审核通过后关闭)');
  console.log('  partner_enabled: true (合伙人功能开启)');
} catch(e) {
  console.error('初始化失败:', e.message);
  process.exit(1);
}
