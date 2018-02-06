module.exports = {
  path: 'favorites',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/favorites').default);
    });
  },
};

