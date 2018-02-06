const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'index.jsx'),
  output: {
    filename: path.join(__dirname, 'examples/dist/react-simple-ribbon.js'),
    libraryTarget: 'umd',
    library: 'SimpleRibbon'
  },
  externals: [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }],
  module: {
    loaders: [
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};
