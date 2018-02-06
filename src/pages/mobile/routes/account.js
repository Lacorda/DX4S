module.exports = [
  {
    path: 'account/biz',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/account/biz').default);
      });
    },
  },
  {
    path: 'account/biz/invoice',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/account/biz').Invoice);
      });
    },
  },
];
