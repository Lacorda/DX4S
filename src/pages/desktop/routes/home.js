const route = {
  path: 'home',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/home').default);
    });
  },
};

export default route;
