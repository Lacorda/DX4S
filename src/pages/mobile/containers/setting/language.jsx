import React from 'react';
import { connect } from 'react-redux';
import { setting } from 'utils/storage';

import { CHANGE_LOCALE } from '../../constants/action-types';

function LanguageSetting(props) {
  const { locale, changeLanguage } = props;

  function getClass(l) {
    if (l === locale) return 'checked';
    return 'none-background';
  }

  return (
    <div className="setting">
      <div className="setting-list">
        <ul className="views">
          <li>
            <a className={getClass('zh')} onClick={() => changeLanguage('zh')}>
              <span>简体中文</span>
            </a>
          </li>
          <li>
            <a className={getClass('en')} onClick={() => changeLanguage('en')}>
              <span>English</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

LanguageSetting.propTypes = {
  changeLanguage: React.PropTypes.func,
  locale: React.PropTypes.string,
};

const mapStateToProps = state => ({
  locale: state.language.locale,
});

function mapDispatchToProps(dispatch) {
  return {
    changeLanguage(locale) {
      setting.set('language', locale);
      dispatch({ type: CHANGE_LOCALE, locale });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSetting);
