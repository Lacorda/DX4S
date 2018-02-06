const asyncRoutes = {
  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/exams').default,
      });
    });
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        { path: 'process', component: require('../containers/exams/process').default },
        { path: 'review/:record_id', component: require('../containers/exams/review').default },
      ]);
    });
  },
};

const route = [
  {
    path: 'plan/:plan_id/series/:solution_id/exams/:quiz_id',
    ...asyncRoutes,
  },
  {
    path: 'plan/:plan_id/series/:solution_id/exams/:quiz_id/nodes/:chap_node_id',
    ...asyncRoutes,
  },
  {
    path: 'examsList',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/exams/examsList').default);
      });
    },
  },
];

export default route;
