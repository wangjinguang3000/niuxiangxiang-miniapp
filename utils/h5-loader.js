// H5页面加载器 - HTTP静态托管
const configReader = require('./config-reader');

function getH5TempURL(pageName, callback) {
  const url = configReader.getH5Url(pageName);
  callback(url);
}

module.exports = { getH5TempURL };
