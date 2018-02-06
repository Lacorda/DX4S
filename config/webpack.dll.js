const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('./');

const productionPlugins = process.env.NODE_ENV === 'production'
  ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_debugger: true,
        drop_console: true,
        warnings: false,
      },
      comments: false,
    }),
  ]
  : [];

module.exports = {
  entry: {
    vendor: [
      'axios',
      'babel-polyfill',
      'classnames',
      'immutability-helper',
      'inline-style-prefixer',
      'iscroll',
      'moment',
      'promise-polyfill',
      'react',
      'redux',
      'redux-actions',
      'redux-thunk',
      'react-dom',
      'react-intl',
      'react-modal',
      'react-redux',
      'react-router',
      'react-router-apply-middleware',
      'react-router-redux',
      'react-router-relative-links',
      'reactjs-iscroll',
      'reselect',
      'resolve-pathname',
      'tiny-cookie'
    ]
  },
  output: {
    publicPath: './',
    path: config.path.dist,
    filename: 'js/[name].[hash].js',
    library: '[name]'
  },
  plugins: [
    new CleanWebpackPlugin(config.path.dist, { root: config.path.root }),
    new webpack.DllPlugin({
      context: __dirname,
      path: path.join(config.path.dist, 'dll/[name].manifest.json'),
      name: '[name]'
    }),
    new HtmlWebpackPlugin({
      filename: path.join(config.path.dist, 'dll/dll.html'),
      template: path.join(config.path.src, 'tmpl/dll.html'),
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ].concat(productionPlugins),
};
