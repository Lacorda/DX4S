/**
 * entry of index
 */

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//   alert(msg);
// }
window.Promise = require('promise-polyfill');
require('core-js/modules/es6.object.assign'); // fuck OPPO

import 'utils/dx/env';
import 'styles/mobile.styl';

import ready from 'utils/dx/ready';

// if (true) {
if (__platform__.dingtalk) {
  ready((data) => {
    require.ensure([], (require) => {
      require('./containers/dingtalk')(data);
    });
    // require('./containers/dingtalk')(data);
  });
} else {
    ready(() => {
      const asyncInit = new Promise((fulfill, reject) => {
        require.ensure([], (require) => {
          const renderInit = require('./renderWithIntl');
          fulfill(renderInit);
        });
      });
      asyncInit.then((renderInit) => {
        renderInit();

        // hot load
        if (__env__.dev) {
          require.ensure([], (require) => {
            const ReactDOM = require('react-dom');
            module.hot.accept('./routes.jsx', () => {
              // eslint-disable-next-line
              const r = require('./routes');
              setTimeout(() => {
                const rootElement = document.getElementById('root');
                ReactDOM.unmountComponentAtNode(rootElement);
                renderInit(r);
              });
            });
          });
        }
        // end for hot load
      });
    });
}

