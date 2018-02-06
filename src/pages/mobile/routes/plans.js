module.exports = {
  path: 'plans',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/plans').default);
    });
  },
};
