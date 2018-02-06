const route = [
  {
    path: 'lives',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/lives/list').default);
      });
    },
  },
  {
    path: 'lives/:live_id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/lives/detail').default);
      });
    },
  },
];

export default route;
