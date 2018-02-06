

const asyncRoutes = {
  indexRoute: {
    onEnter: (nextState, replace) => {
      replace(`${nextState.location.pathname.replace(/\/$/, '')}/detail${nextState.location.search}`);
    },
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/course').default);
    });
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        { path: 'detail', component: require('../containers/course/detail').default },
        { path: 'comments', component: require('../containers/comment').Comment },
        { path: 'preview/:id', component: require('../containers/preview').default },
      ]);
    });
  },
};

module.exports = [
  {
    path: 'plan/:plan_id/series/:solution_id/courses/:course_id',
    ...asyncRoutes,
  },
  {
    path: 'plan/:plan_id/series/:solution_id/courses/:course_id/nodes/:chap_node_id',
    ...asyncRoutes,
  },
  {
    path: 'plan/:plan_id/series/:solution_id/courses/:course_id/add-comment',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/comment').AddComment);
      });
    },
  },
];
