
const asyncRoutes = {
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/practice').default);
    });
  },
};

module.exports = [
  {
    path: 'practice/:node_id',
    ...asyncRoutes,
  },
  {
    path: 'plan/:plan_id/solution/:solution_id/course/:course_id/chapterNode/:node_id',
    ...asyncRoutes,
  },
];
