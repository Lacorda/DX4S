import { nav } from 'utils/dx';

const router = {
  path: 'home',
};

if (__platform__.dingtalk) {
  const doc = document;
  const root = doc.querySelector('#root');
  const home = doc.querySelector('#dd-home');
  router.onEnter = () => {
    nav.setTitle({ title: '多学' });
    nav.setRight();
    root.style.display = 'none';
    home.style.display = 'block';
  };
} else {
  router.getComponent = (nextState, cb) => {
    require.ensure([], (require) => {
      cb(null, require('../containers/home').default);
    });
  };
}

module.exports = router;
