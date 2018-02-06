module.exports = {
  path: 'search',
  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/search').default,
      });
    });
  },
};
