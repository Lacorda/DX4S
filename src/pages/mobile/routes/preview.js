module.exports = {
  path: 'preview/plan/:plan_id/series/:solution_id/courses/:course_id',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/preview').default);
    });
  },
};
