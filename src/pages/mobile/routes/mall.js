module.exports = [{
  path: 'mall',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/mall/home').default);
    });
  },
}, {
  path: 'mall/more',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/mall/more').default);
    });
  },
}, {
  path: 'mall/more/:classification_id',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/mall/more').default);
    });
  },
}, {
  path: 'mall/lives',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../containers/mall/lives').default);
    });
  },
},
];
