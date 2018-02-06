module.exports = {
  path: 'products/course/:product_id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/course').Product);
    });
  },
};
