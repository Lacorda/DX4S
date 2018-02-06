const asyncRoutes = {
  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/course').default,
      });
    });
  },
};

const route = [
  {
    path: 'plan/:plan_id/series/:solution_id/courses/:course_id',
    ...asyncRoutes,
  },
  {
    path: 'plan/:plan_id/series/:solution_id/courses/:course_id/nodes/:chap_node_id',
    ...asyncRoutes,
  },
];

export default route;
