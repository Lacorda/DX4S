const route = {
  path: 'plan/:plan_id/series/:solution_id/courses/:course_id/training',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/training/practice').default);
    });
  },
};

export default route;
