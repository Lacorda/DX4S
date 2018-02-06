import { addLocaleData } from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import deLocaleData from 'react-intl/locale-data/zh';

import translations from './translations';

addLocaleData(enLocaleData);
addLocaleData(deLocaleData);

export const appLocales = [
  'en',
  'zh',
];

const objectValues = obj => Object.keys(obj).map(o => obj[o]);

export const formatTranslationMessages = (type, messages) => {
  const formattedMessages = {};
  messages
    .forEach(message => objectValues(message)
      .forEach((trans) => {
        formattedMessages[trans.id] = trans[type];
      }));
  return formattedMessages;
};

export const translationMessages = {
  en: formatTranslationMessages('en', translations),
  zh: formatTranslationMessages('zh', translations),
};
