const fs = require('fs');
let cfg = fs.readFileSync('config-reader.js', 'utf8');

// Add store_enabled to the return object
if (!cfg.includes('store_enabled')) {
  cfg = cfg.replace(
    "partner_enabled: config.partner_enabled !== false",
    "partner_enabled: config.partner_enabled !== false,\n      store_enabled: config.store_enabled === true"
  );
  fs.writeFileSync('config-reader.js', cfg, 'utf8');
  console.log('config-reader: store_enabled added ✅');
} else {
  console.log('Already has store_enabled');
}
