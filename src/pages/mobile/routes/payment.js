module.exports = {
  path: 'payment/:order_id',
  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/payment/pay').default,
      });
    });
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        { path: 'result', component: require('../containers/payment/result').default },
        { path: 'enterprise', component: require('../containers/payment/enterprise').default },
      ]);
    });
  },
};
