const path = require('path');
const ip = require('ip').address();

const platform = process.env.platform || 'web';
const device = process.env.device || 'mobile';
const ENV = process.env.NODE_ENV || 'production';
const port = device === 'desktop' ? 9998 : 9999;
const WEBPACK_SERVER_PORT = process.env.WEBPACK_SERVER_PORT || port;

const Config = {
  // develop or production
  env: ENV,
  // path
  path: {
    root: path.resolve(__dirname, '../'),
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
  },
};
// is
Config.is = {
  prod: Config.env === 'production',
  dev: Config.env !== 'production',
};

// platform
Config.platform = platform;
// device
Config.device = device;

Config.entry = (device, platform) => {
  const entry = [
    {
      name: 'index',
      js: device.desktop ? '/desktop' : '/mobile',
      tmpl: 'index',
    },
  ];
  if (device.mobile && !platform.dingtalk) {
    entry.push({
      name: 'account',
      js: '/account',
      tmpl: 'account',
    });
  }
  return entry;
};

// webpack config
Config.webpack = {
  entry: [
    'index',
    'account',
  ],
  serverHost: ip,
  serverPort: WEBPACK_SERVER_PORT,
  proxy: {
    '/training/*': {
      target: 'http://192.168.70.212:5555',
      pathRewrite: { '^/training': '/elearning-training' },
    },
    '/account/*': {
      target: 'http://192.168.70.212:5555',
      pathRewrite: { '^/account': '/elearning-account' },
    },
    '/mall/*': {
      target: 'http://192.168.70.212:5555',
      // pathRewrite: { '^/mall': '/mall' },
    },
    '/local/*': {
      target: 'http://127.0.0.1:8888',
      pathRewrite: { '^/local': '/' },
    },
    '/pre/*': {
      target: 'http://127.0.0.1:8888',
      pathRewrite: { '^/pre': '/' },
    },
    '/dev/*': {
      target: 'http://127.0.0.1:8888',
      pathRewrite: { '^/dev': '/' },
    },
  },
  // hash format, add hash for production env
  hash: '.[hash:6]',  //Config.is.prod ? '.[hash:6]' : '',
  chunkhash: Config.is.prod ? '.[chunkhash:6]' : '',
  contenthash: Config.is.prod ? '.[contenthash:6]' : '',
};
// export config
module.exports = exports = Config;
