
import React, { Component } from 'react';
import Button from 'components/button';
import api from 'utils/api';
import Cookie from 'tiny-cookie';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { nav } from 'utils/dx';
import Toast from '../../../../components/modal/toast';

import './changePwd.styl';

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};

class changePwd extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      toastContent: <FormattedMessage {...messages.toast} />,
      isToastShow: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setNavBar = this.setNavBar.bind(this);
  }
  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.account.changePwd.title'],
    });
  }
  handleChange() {
      this.setState(Object.assign({}, this.state, {
        pwd: this.pwd.value,
        pwdConfirm: this.pwdConfirm.value,
      }));
  }
  handleSubmit() {
    const self = this;
    if (!this.pwd.value || !this.pwdConfirm.value)
    {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
      }));
      return false;
    } else if (this.pwd.value !== this.pwdConfirm.value) {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: <FormattedMessage {...messages.changeDifference} />,
      }));
      return false;
    } else if (this.pwd.value.length < 6 || this.pwd.value.length > 20) {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: <FormattedMessage {...messages.pwdLenght} />,
      }));
      return false;
    } else if (!/^\S+$/gi.test(this.pwd.value)) {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: <FormattedMessage {...messages.pwdEmpty} />,
      }));
      return false;
    } else {
      api({
        method: 'POST',
        url: '/account/account/changePass',
        data: {
          new_pass: this.pwd.value,
        },
      })
      .then((res) => {
        Cookie.set('USER-TICKET', '');
        self.setState(Object.assign({}, this.state, {
          isToastShow: true,
          toastContent: <FormattedMessage {...messages.changeSuccess} />,
        }));
        setTimeout(function () {
          self.setState({ isToastShow: false });
          window.location = './#/account';
        }, 3000);
      })
      .catch((err) => {
        self.setState(Object.assign({}, this.state, {
          isToastShow: true,
          toastContent: err.response.data.message,
        }));
      });
    }
  }
  render() {
    const self = this;
    this.setNavBar();
    return (
      <form className="changePwd">
        <div className="form-control">
          <input
            type="password" name="pwd" placeholder={this.context.intl.messages['app.account.changeInputPwd']}
            ref={(ref) => { this.pwd = ref; }}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-control">
          <input
            type="password" name="pwdConfirm" placeholder={this.context.intl.messages['app.account.changeInputPwdAgain']}
            ref={(ref) => { this.pwdConfirm = ref; }}
            onChange={this.handleChange}
          />
        </div>

        <div className="form-control form-control-border">
        {
          this.state.pwd && this.state.pwdConfirm
          ? <Button type="primary" onClick={this.handleSubmit} ><FormattedMessage {...messages.changePwd} /></Button>
          : <Button type="primary" className="btn-disabled"><FormattedMessage {...messages.changePwd} /></Button>
        }
        </div>
        <Toast
          style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
          isOpen={self.state.isToastShow}
          timeout={3000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            self.setState({ isToastShow: false });
          }}
        >
          <div>{self.state.toastContent}</div>
        </Toast>
      </form>
    );
  }
}
changePwd.contextTypes = contextTypes;

export default changePwd;
