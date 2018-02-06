const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const path = require('path');

const config = require('./');
const CopyStaticFiles = require('./copyStaticFiles');

const WebpackConfig = {};

Object.assign(WebpackConfig, require('./webpack.base'));

// style
const extractStyle = new ExtractTextPlugin('css/[name].[contenthash:6].css');

// add plugins
WebpackConfig.plugins.push(
//  new CleanWebpackPlugin(config.path.dist, { root: config.path.root }),
  new WebpackMd5Hash(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    filename: `js/common${config.webpack.hash}.js`,
  }),
  extractStyle,
  // uglify js
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      drop_debugger: true,
      drop_console: true,
      warnings: false,
    },
    comments: false,
  }),
  new CopyStaticFiles({
    from: path.join(config.path.src, '/static'),
    to: config.path.dist,
  })
);

module.exports = WebpackConfig;

// add loader
WebpackConfig.module.loaders.push(
  { test: /\.css$/, loaders: ['style', 'css?-autoprefixer&importLoaders=1', 'postcss'] },
  {
    test: /\.styl$/,
    loaders: ['style', 'css?-autoprefixer&importLoaders=1', 'postcss', 'stylus']
  }
  // {
  //   test: /\.css$/,
  //   loader: extractStyle.extract('style-loader', [
  //     'css?-autoprefixer&importLoaders=1',
  //     'postcss',
  //   ], { publicPath: '../' }),
  // },
  // {
  //   test: /\.styl$/,
  //   loader: extractStyle.extract('style-loader', [
  //     'css?-autoprefixer&importLoaders=1',
  //     'postcss',
  //     'stylus',
  //   ], { publicPath: '../' }),
  // }
);
