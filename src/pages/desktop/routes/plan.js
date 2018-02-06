const route = {
  path: 'plan',
  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/plan/list').default,
      });
    });
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        { path: 'detail/:plan_id', component: require('../containers/plan/detail').default },
      ]);
    });
  },
};

export default route;
