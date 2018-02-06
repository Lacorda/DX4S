module.exports = {
  path: 'account',
  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/account/signIn').default,
      });
    });
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        { path: 'signCom', component: require('../containers/account/signCom').default },
        { path: 'forget', component: require('../containers/account/forget').default },
        { path: 'reset', component: require('../containers/account/reset').default },
        { path: 'changePwd', component: require('../containers/account/changePwd').default },
        { path: 'bindPhone', component: require('../containers/account/bindPhone').default },
      ]);
    });
  },
};
