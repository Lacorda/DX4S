import { setting } from 'utils/storage';
import { getUserLanguage } from 'i18n/helpers';
import {
  CHANGE_LOCALE,
} from './constants';

function getDefaultLangulage() {
  const lang = getUserLanguage();
  return lang === 'en' ? 'en' : 'zh';
}

const initialState = {
  locale: setting.get('language') || getDefaultLangulage(),
};

function languageProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return { ...state, locale: action.locale };
    default:
      return state;
  }
}

export default languageProviderReducer;
