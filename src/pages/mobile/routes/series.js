module.exports = {
  path: 'plan/:plan_id/series/:solution_id',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/series-detail').default);
    });
  },
};
