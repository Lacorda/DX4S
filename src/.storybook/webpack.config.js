const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /.styl$/,
        loaders: ["style", "css", "stylus"],
        include: path.resolve(__dirname, '../')
      }
    ]
  }
};
