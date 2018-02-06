import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { hashHistory } from 'react-router';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers';
import languageReducer from '../../i18n/LanguageProvider/reducer';

const routerM = routerMiddleware(hashHistory);
const middleware = [routerM, thunk];

const enhancers = [];
if (__env__.dev) {
  const devToolsExtension = window.devToolsExtension;
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const rootReducer = combineReducers({
  ...reducers,
  routing: routerReducer,
  language: languageReducer,
});

export function configureStore(initialState = {}) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );

  if (__env__.dev) {
    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
      module.hot.accept('./reducers', () => {
        // eslint-disable-next-line global-require,import/newline-after-import
        const nextReducer = require('./reducers');
        store.replaceReducer(nextReducer);
      });

    }
  }

  return store;
}

export default configureStore();
