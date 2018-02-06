import { nav } from 'utils/dx';

import App from './containers/app';

const Routes = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => {
      if (__platform__.wechat) {
        const getQueryString = (name) => {
          const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
          const r = window.location.search.substr(1).match(reg);
          if (r != null) return unescape(r[2]);
          return null;
        };
        const state = getQueryString('state');
        const code = getQueryString('code');
        if (state && code) {
          replace(`${state}?code=${code}`);
          return;
        }
      }
      replace(`${nextState.location.pathname}home`);
    },
    // getComponent: require('./routes/home').getComponent,
  },
  onChange: () => {
    nav.setTitle();
    nav.setRight();
  },
  childRoutes: [
    require('./routes/account_m'),
    require('./routes/search'),
    require('./routes/home'),
    require('./routes/plans'),
    require('./routes/elective'),
    require('./routes/preview'),
    require('./routes/favorites'),
    require('./routes/series'),
    require('./routes/training'),
    require('./routes/announcement'),
    require('./routes/payment'),
    require('./routes/preview-mall'),
    require('./routes/product-course'),
    require('./routes/product-series'),
    require('./routes/product-live'),
    require('./routes/shopping-cart'),
    require('./routes/order'),
    require('./routes/plan'),
    ...require('./routes/live'),
    ...require('./routes/course'),
    ...require('./routes/exam'),
    ...require('./routes/survey'),
    ...require('./routes/practice'),
    ...require('./routes/profile'),
    ...require('./routes/mall'),
    ...require('./routes/publish-electives'),
    ...require('./routes/distribution'),
    ...require('./routes/account'),
  ],
};

export default Routes;
