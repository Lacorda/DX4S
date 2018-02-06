import 'babel-polyfill';
import 'utils/adapter';
import 'utils/dx/env';
import { getUserLanguage } from 'i18n/helpers';
import { setting } from 'utils/storage';

import 'styles/mobile.styl';

import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { IntlProvider, addLocaleData } from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';

import { ready } from 'utils/dx';

import Routes from './routes';
import Zh from './messageZh';
import En from './messageEn';

addLocaleData(enLocaleData);
addLocaleData(zhLocaleData);
function getDefaultLangulage() {
  const lang = getUserLanguage();
  return lang === 'en' ? 'en' : 'zh';
}

const locale = setting.get('language') || getDefaultLangulage();
const rootElement = document.getElementById('root');// eslint-disable-line no-undef

function renderAPP(r) {
  const routeConfig = (r && r.default) || Routes;
  // TODO change locale
  render(
    <div>
      <IntlProvider locale={locale} messages={locale === 'en' ? En : Zh}>
        <Router
          routes={routeConfig}
          history={hashHistory}
        />
      </IntlProvider>
    </div>,
    rootElement
  );
}

function initIntlPolyfill(callback) {
  if (!window.Intl) {
    require.ensure([
      'intl',
      'intl/locale-data/jsonp/en.js',
      'intl/locale-data/jsonp/zh.js',
    ], (require) => {
      window.Intl = require('intl');
      require('intl/locale-data/jsonp/en');
      require('intl/locale-data/jsonp/zh');
      callback();
    });
  } else {
    callback();
  }
}

ready(() => {
  initIntlPolyfill(() => {
    renderAPP();
    if (__env__.dev) {
      module.hot.accept('./routes.jsx', () => {
        // eslint-disable-next-line
        const r = require('./routes');
        setTimeout(() => {
          ReactDOM.unmountComponentAtNode(rootElement);
          renderAPP(r);
        });
      });
    }
  });
});
