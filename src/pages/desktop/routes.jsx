import App from './containers/app';

import homeRoutes from './routes/home';
import examsRoutes from './routes/exams';
import practiceRoutes from './routes/practice';
import planRoutes from './routes/plan';
import courseRoutes from './routes/course';
import surveyRoutes from './routes/survey';
import trainingRoutes from './routes/training';
import announcementRoutes from './routes/announcement';
import livesRoutes from './routes/lives';

const Routes = {
  path: '/',
  component: App,
  indexRoute: {
    onEnter: (nextState, replace) => {
      replace(`${nextState.location.pathname}home`);
    },
    // getComponent: homeRoutes.getComponent,
  },
  childRoutes: [
    ...examsRoutes,
    ...practiceRoutes,
    ...courseRoutes,
    ...surveyRoutes,
    ...livesRoutes,
    planRoutes,
    homeRoutes,
    trainingRoutes,
    announcementRoutes,
    require('./routes/series'),
    require('./routes/account'),
    require('./routes/plans'),
    require('./routes/electives'),
    require('./routes/favorites'),
    require('./routes/preview'),
... require('./routes/profile'),
  ],
};

export default Routes;
