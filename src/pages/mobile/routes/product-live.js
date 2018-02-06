module.exports = {
  path: 'products/live/:product_id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/live/product').default);
    });
  },
};
