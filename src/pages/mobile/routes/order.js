module.exports = {
  path: 'order',

  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/order/order').default,
      });
    });
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        { path: 'confirm', component: require('../containers/order/confirm').default },
        { path: 'detail/:order_id', component: require('../containers/order/detail').default },
      ]);
    });
  },
};
