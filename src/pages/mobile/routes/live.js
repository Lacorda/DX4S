module.exports = [
  {
    path: 'live/:id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/live').default);
      });
    },
  },
  {
    path: 'lives',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/live/MyLiveList').default);
      });
    },
  },
];
