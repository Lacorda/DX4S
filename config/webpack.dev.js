const ExtractTextPlugin = require('extract-text-webpack-plugin');


const WebpackConfig = {
};

Object.assign(WebpackConfig, require('./webpack.base'));

// style
const extractStyle = new ExtractTextPlugin('css/[name].css', {
  isCacheable: true,
});

// add plugins
WebpackConfig.plugins.push(
  extractStyle
);

WebpackConfig.module.loaders.push(
  { test: /\.css$/, loaders: ['style', 'css?-autoprefixer', 'postcss'] },
  { test: /\.styl$/, loaders: ['style', 'css?-autoprefixer', 'postcss', 'stylus'] }
);

module.exports = WebpackConfig;
