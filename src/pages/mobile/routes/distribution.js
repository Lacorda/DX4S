module.exports = [
  {
    path: 'distribution/required',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution').default);
      });
    },
  },
  {
    path: 'distribution/required/:plan_id',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/required/detail').default);
      });
    },
  },
  {
    path: 'distribution/required/:plan_id/courses',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/required/detail-course').default);
      });
    },
  },
  {
    path: 'distribution/required/:plan_id/users',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/required/detail-user').default);
      });
    },
  },
  {
    path: 'distribution/required/new/selection-course',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/required/selection-course').default);
      });
    },
  },
  {
    path: 'distribution/required/new/selection-user',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/required/selection-user').default);
      });
    },
  },
  {
    path: 'distribution/required/new/selection-user/search',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/required/selection-user-searching').default);
      });
    },
  },
  {
    path: 'distribution/required/new/selection-confirm',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/required/selection-confirm').default);
      });
    },
  },
  {
    path: 'distribution/required/new/selection-confirm/course',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/required/selection-confirm-course').default);
      });
    },
  },
  {
    path: 'distribution/required/new/selection-confirm/user',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/required/selection-confirm-user').default);
      });
    },
  },
  {
    path: 'distribution/live/new/selection-live',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/live/selection-live').default);
      });
    },
  },
  {
    path: 'distribution/live/new/selection-user',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/live/selection-user').default);
      });
    },
  },
  {
    path: 'distribution/live/new/selection-user/search',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/live/selection-user-searching').default);
      });
    },
  },
  {
    path: 'distribution/live/new/selection-confirm',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/distribution/live/selection-confirm').default);
      });
    },
  },
];
