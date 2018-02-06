module.exports = {
  path: 'shopping-cart',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/shopping-cart').default);
    });
  },
};
