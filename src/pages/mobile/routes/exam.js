
const asyncRoutes = {
  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/exams/info').default,
      });
    });
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        { path: 'process', component: require('../containers/exams/process').default },
        { path: 'rank', component: require('../containers/exams/rank').default },
        { path: 'history', component: require('../containers/exams/history').default },
        { path: 'review/:record_id', component: require('../containers/exams/review').default },
      ]);
    });
  },
};

module.exports = [
  {
    path: 'exams',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/my-exams').default);
      });
    },
  },
  {
    path: 'plan/:plan_id/series/:solution_id/exams/:quiz_id',
    ...asyncRoutes,
  },
  {
    path: 'plan/:plan_id/series/:solution_id/exams/:quiz_id/nodes/:chap_node_id',
    ...asyncRoutes,
  },
];
