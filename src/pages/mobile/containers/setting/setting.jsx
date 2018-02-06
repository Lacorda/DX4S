import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SettingList from './setting-list';
import Footer from '../../components/footer';
import { nav } from 'utils/dx';

class Setting extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.setNavBar = this.setNavBar.bind(this);
  }

  setNavBar(title) {
    nav.setTitle({
      title: this.context.intl.messages['app.setting.title'],
    });
  }

  render() {
    this.setNavBar();

    return (
      <div className="setting">
        <SettingList />
      </div>
    );
  }
}

export default Setting;
