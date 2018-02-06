module.exports = {
  path: 'mall/preview/products/:product_id/node/:node_id',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/preview-mall').default);
    });
  },
};
