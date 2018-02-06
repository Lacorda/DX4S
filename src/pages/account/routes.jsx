
import SignIn from './containers/signIn/signIn';
import Forget from './containers/forget/forget';
import SignInCom from './containers/signInCom/signInCom';
import bindPhone from './containers/bindPhone/bindPhone';
import changePwd from './containers/changePwd/changePwd';

const Routes = {
  path: '/',
  indexRoute: { component: SignIn },
  childRoutes: [
    { path: 'signIn', component: SignIn },
    { path: 'forget', component: Forget },
    { path: 'signInCom', component: SignInCom },
    { path: 'bindPhone', component: bindPhone },
    { path: 'changePwd', component: changePwd },
  ],
};


export default Routes;
