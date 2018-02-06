module.exports = [
/*  {
    path: 'manage',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/manage').default);
      });
    },
  },
  {
    path: 'profile',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/profile').default);
      });
    },
  },
  {
    path: 'setting',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/setting').default);
      });
    },
  },
  {
    path: 'setting/language',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/setting/language').default);
      });
    },
  },
  {
    path: 'changePsw',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/profile').ChangePsw);
      });
    },
  },*/
  {
    path: 'help',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/help').default);
      });
    },
  },
  {
    path: 'feedback',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/feedback').default);
      });
    },
  },
  {
    path: 'about-us',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/about-us').default);
      });
    },
  },
  {
    path: 'sign-in-record',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/sign-in-record').default);
      });
    },
  },
];
