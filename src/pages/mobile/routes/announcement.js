module.exports = {
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
        { path: 'comment/:announcement_id', component: require('../containers/announcement/comment').default },
        { path: 'comments/:announcement_id', component: require('../containers/announcement/comments').default },
        { path: 'media', component: require('../containers/announcement/media').default },
        { path: 'imgViewer', component: require('../containers/announcement/imgViewer').default },
      ]);
    });
  },
};
