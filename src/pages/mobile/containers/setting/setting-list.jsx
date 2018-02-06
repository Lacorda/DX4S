import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import api from 'utils/api';
import { Confirm } from '../../../../components/modal';

class SettingList extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isConfirmOpen: false,
    };
    this.closeConfirm = ::this.closeConfirm;
    this.onLogoutClick = ::this.onLogoutClick;
    this.logout = ::this.logout;
  }

  closeConfirm() {
    this.setState({ ...this.state, isConfirmOpen: false });
  }

  onLogoutClick() {
    this.setState({ ...this.state, isConfirmOpen: true });
  }

  logout() {
    const logout = api({ url: '/account/certification/center/logout' });
    logout.then(() => {
      window.location = './#/account';
    });
  }

  render() {
    const views1 = [
      {
        messages: messages.password,
        url: 'changePsw',
      }, {
        messages: messages.language,
        url: 'setting/language',
      },
    ];
    const views2 = [
      {
        messages: messages.help,
        url: 'help',
      }, {
        messages: messages.feedback,
        url: 'feedback',
      }, {
        messages: messages.about,
        url: 'about',
      },
    ];

    return (
      <div className="setting-list">
        <ul className="views">
          {
            views1.map((view, index) => {
              if (__platform__.dingtalk && view.url === 'changePsw') {
                return null;
              }

              return (<li key={index}>
                <Link to={view.url}><FormattedMessage id={view.messages.id} /></Link>
              </li>);
            })
          }
        </ul>
        <ul className="views">
          {
            views2.map((view, index) => {
              if (__platform__.dingtalk && view.url === 'feedback') {
                return null;
              }
              return (<li key={index}>
                <Link to={view.url}><FormattedMessage id={view.messages.id} /></Link>
              </li>);
            })
          }
        </ul>
        <ul className="logout-views">
          {
            (() => {
              if (__platform__.dingtalk) {
                return null;
              }

              return (<li onClick={this.onLogoutClick}>
                <FormattedMessage id="app.setting.logout" />
              </li>);
            })()
          }
        </ul>
        <Confirm
          shouldCloseOnOverlayClick={false}
          isOpen={this.state.isConfirmOpen}
          onRequestClose={this.closeConfirm}
          onConfirm={this.logout}
          confirmButton={<span><FormattedMessage id="app.course.ok" /></span>}
          cancelButton={<span><FormattedMessage id="app.course.cancel" /></span>}
        >
          <span>
            <FormattedMessage  id="app.setting.logoutMsg" />
          </span>
        </Confirm>
      </div>
    );
  }
}

export default SettingList;
