module.exports = [{
  path: 'publish-electives',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/publish-electives').default);
    });
  },
}, {
  path: 'publish-electives/publish',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/publish-electives/publish-electives').default);
    });
  },
},
];
