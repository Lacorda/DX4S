module.exports = {
  path: 'electives',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/electives').default);
    });
  },
};
