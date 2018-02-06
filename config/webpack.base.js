const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Happypack = require('happypack');
const autoprefixer = require('autoprefixer');

const config = require('./');
const path = require('path');
const fs = require('fs');
const platform = require('./platform')(config.platform);
const device = {
  desktop: config.device === 'desktop',
  mobile: config.device === 'mobile',
};

// webpack config
const WebpackBaseConfig = {
  entry: {
    common: [],
  },
  output: {
    path: path.join(config.path.dist),
    publicPath: './',
    filename: `js/[name]${config.webpack.chunkhash}.js`,
    chunkFilename: `js/[name]${config.webpack.chunkhash}.js`,
  },
  resolve: {
    extensions: [
      '', '.js', '.jsx',
      '.css', '.styl',
      'png', 'jpg', 'jpeg', 'gif', 'ico'],
    alias: {
      styles: path.join(config.path.src, '/styles'),
      img: path.join(config.path.src, '/img'),
      components: path.join(config.path.src, '/components'),
      hocs: path.join(config.path.src, '/hocs'),
      utils: path.join(config.path.src, '/utils'),
      dxActions: path.join(config.path.src, '/dxActions'),
      dxConstants: path.join(config.path.src, '/dxConstants'),
      dxReducers: path.join(config.path.src, '/dxReducers'),
      dxSelectors: path.join(config.path.src, '/dxSelectors'),
      i18n: path.join(config.path.src, '/i18n'),
      webworkify: 'webworkify-webpack-dropin'
    },
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'happypack/loader',
        include: config.path.src,
      },
      {
        test: /\.json$/,
        loader: 'json',
        include: config.path.src,
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: `file?name=assets/images/[name]${config.webpack.hash}.[ext]`,
      },
      {
        test: /\.(eot|woff|ttf)$/,
        loader: `file-loader?name=assets/font/[name]${config.webpack.hash}.[ext]`,
      },
    ],
  },
  plugins: [
    new Happypack({
      loaders: ['babel'],
      threads: require('os').cpus().length,
      cache: process.env.NODE_ENV !== 'production',
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __env__: {
        dev: config.is.dev,
        prod: config.is.prod,
      },
//      __device__: device,
//      __platform__: platform,
    }),
    // new webpack.ContextReplacementPlugin(/react-intl[\/\\]locale-data$/, /en|zh/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(path.join(config.path.dist, 'dll/vendor.manifest.json'))
    }),
    new HtmlWebpackPlugin({
      filename: path.join(config.path.dist, 'index.html'),
      template: path.join(config.path.dist, 'dll/dll.html'),
      inject: 'body',
      chunks: ['common', 'index'],
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: path.join(config.path.dist, 'account.html'),
      template: path.join(config.path.dist, 'dll/dll.html'),
      inject: 'body',
      chunks: ['common', 'account'],
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
  ],
  stylus: {
    import: [
      device.desktop ?
        path.join(config.path.src, '/styles/desktop/helpers/index.styl') :
        path.join(config.path.src, '/styles/helpers/index.styl'),
    ],
  },
  postcss: () => [
    autoprefixer({
      browsers: [
        'Android >= 4',
      ],
    }),
  ],
};

// find template path
function findTemplate(templateName) {
  let entryUrl;

  entryUrl = path.join(config.path.src, `/tmpl/${templateName}.ejs`);
  if (fs.existsSync(entryUrl)) return entryUrl;

  entryUrl = path.join(config.path.src, `/tmpl/${templateName}.html`);
  if (fs.existsSync(entryUrl)) return entryUrl;

  return null;
}

// loop all entry
config.entry(device, platform).forEach((item) => {
  const entry = {
    name: item.name,
  };

  const htmlPluginConfig = {
    filename: `${entry.name}.html`,
    platform,
    device,
    minify: !config.is.prod ? false : {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
      },
  };
  // entry
  const entryUrl = path.join(config.path.src, '/pages', item.js, '/main.jsx');
  if (fs.existsSync(entryUrl)) {
    WebpackBaseConfig.entry[entry.name] = entryUrl;
    htmlPluginConfig.chunks = ['common', entry.name];
  } else {
    htmlPluginConfig.chunks = [];
  }
  // template
  const templateUrl = path.join(config.path.dist, 'dll/dll.html');
  if (fs.existsSync(templateUrl)) {
    htmlPluginConfig.template = templateUrl;
    const htmlPlugin = new HtmlWebpackPlugin(htmlPluginConfig);
    // add to plugins
    WebpackBaseConfig.plugins.push(htmlPlugin);
  }
});
// console.log(WebpackBaseConfig);
module.exports = exports = WebpackBaseConfig;
