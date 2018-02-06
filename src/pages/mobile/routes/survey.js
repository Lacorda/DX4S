
const asyncRoutes = {
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/survey').default);
    });
  },
};

module.exports = [
  {
    path: 'plan/:plan_id/series/:solution_id/surveys/:survey_id/nodes/:chap_node_id',
    ...asyncRoutes,
  },
  {
    path: 'surveys/:survey_id/plans/:plan_id/series/:solution_id/courses/:course_id/chapters/:chap_id/nodes/:chap_node_id',
    ...asyncRoutes,
  },
];
