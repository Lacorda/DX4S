import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import applyMiddleware from 'react-router-apply-middleware';
import { useRelativeLinks } from 'react-router-relative-links';

import LanguageProvider from '../../i18n/LanguageProvider';
import { translationMessages } from '../../i18n/i18n';

import store from './store';
import Routes from './routes';

const history = syncHistoryWithStore(hashHistory, store);

const rootElement = document.getElementById('root'); // eslint-disable-line no-undef

function init(r) {
  const routeConfig = (r && r.default) || Routes;
  render(
    <Provider store={store}>
      <LanguageProvider messages={translationMessages}>
        <div>
          <Router
            routes={routeConfig}
            history={history}
            render={applyMiddleware(useRelativeLinks())}
          />
        </div>
      </LanguageProvider>
    </Provider>,
    rootElement
  );
}

export default init;
