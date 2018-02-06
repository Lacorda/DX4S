module.exports = {
  path: 'plan/:plan_id/series/:solution_id/courses/:course_id/training',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/training/exam').default);
    });
  },
};
