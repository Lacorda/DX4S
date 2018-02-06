/**
 * entry of index
 */
import 'babel-polyfill';
import init from 'utils/init';
import 'styles/desktop.styl';


import { ready } from 'utils/3rd/dingtalk/pc';

const asyncInit = new Promise((fulfill) => {
  require.ensure([], (require) => {
    const renderInit = require('./renderWithIntl');

    fulfill(renderInit);
  });
});

init().then(() => {
  ready(() => {
    asyncInit.then((renderInit) => {
      renderInit();
    });
  });
});
