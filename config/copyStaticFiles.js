const ncp = require('ncp').ncp;

function copyStaticFiles(userOptions) {
  this.options = userOptions;
}
copyStaticFiles.prototype.apply = function(compiler) {
  const options = this.options;
  compiler.plugin('done', function() {
    ncp(options.from, options.to, function (err) {
     if (err) {
       return console.error(err);
     }
    // console.log(`\ncopy files: ${options.from} -> ${options.to}`);
    });
  });
};

module.exports = exports = copyStaticFiles;
