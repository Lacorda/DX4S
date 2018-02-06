const route = {
  path: 'announcement',
  getIndexRoute(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, {
        component: require('../containers/announcement/list').default,
      });
    });
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        { path: 'detail/:announcement_id', component: require('../containers/announcement/detail').default },
        { path: 'mediaViewer', component: require('../containers/announcement/mediaViewer').default },
        { path: 'imgViewer', component: require('../containers/announcement/imgViewer').default },
      ]);
    });
  },
};

export default route;
