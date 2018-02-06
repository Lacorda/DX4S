module.exports = {
  path: 'account',
  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/account_m/signIn').default,
      });
    });
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        { path: 'signCom', component: require('../containers/account_m/signInCom').default },
        { path: 'forget', component: require('../containers/account_m/forget').default },
        { path: 'changePwd', component: require('../containers/account_m/changePwd').default },
        { path: 'bindPhone', component: require('../containers/account_m/bindPhone').default },
      ]);
    });
  },
};
