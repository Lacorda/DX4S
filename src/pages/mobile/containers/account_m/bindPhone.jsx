
import React, { Component } from 'react';
import Button from 'components/button';
import api from 'utils/api';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';
import messages from './messages';
import Toast from '../../../../components/modal/toast';

import './bindPhone.styl';

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};

class bindPhone extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tel: '',
      code: '',
      getCodes: false,
      time: 60,
      isToastShow: false,
      telReg: false,
      toastContent: 'a',
    };
    this.phoneTime = 0;
    this.handleChange = this.handleChange.bind(this);
    this.jump = this.jump.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setNavBar = this.setNavBar.bind(this);
    this.getCode = this.getCode.bind(this);
  }
  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.account.bindPhone.title'],
    });
  }
  componentWillUnmount() {
    this.phoneTime = 0;
  }
  getCode() {
    const self = this;
    if (this.state.getCodes === false) {
      api({
        method: 'GET',
        url: '/account/account/sendValidateCode?mobile_phone=' + this.tel.value,
      })
      .then((res) => {
        this.setState(Object.assign({}, this.state, {
          getCodes: true,
        }));
        self.phoneTime = setInterval(function () {
          if (self.state.time !== 0) {
            self.setState(Object.assign({}, self.state, {
              time: self.state.time - 1,
            }));
          } else {
            self.setState(Object.assign({}, self.state, {
              getCodes: false,
              time: 60,
            }));
            clearInterval(self.phoneTime);
          }
        }, 1000);
      })
      .catch((err) => {
        self.setState(Object.assign({}, self.state, {
          toastContent: err.response.data.message,
          isToastShow: true,
        }));
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.phoneTime);
  }
  handleChange() {
    this.setState({
      tel: this.tel.value,
      code: this.code.value,
    });
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.tel.value))) {
      this.setState(Object.assign({}, this.state, {
        telReg: false,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        telReg: true,
      }));
    }
  }
  jump() {
    window.location = './';
  }
  handleSubmit() {
    const self = this;
    if (!this.tel.value || !this.code.value)
    {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
      }));
      setTimeout(() => self.setState({ isToastShow: false }), 3000);
      return false;
    }
    api({
      method: 'GET',
      url: '/account/account/bindMobilePhone?mobile_phone=' + this.tel.value + '&validate_code=' + this.code.value,
    })
    .then((res) => {
      window.location = './';
    })
    .catch((err) => {
      self.setState(Object.assign({}, self.state, {
        toastContent: err.response.data.message,
        isToastShow: true,
      }));
      setTimeout(() => self.setState({ isToastShow: false }), 3000);
    });
  }
  render() {
    const self = this;
    this.setNavBar();
    return (
      <form className="bindPhone">
        <div className="form-control">
          <input
            type="text" name="tel" placeholder={this.context.intl.messages['app.account.inputTel']}
            ref={(ref) => { this.tel = ref; }}
            onChange={this.handleChange}
          />
          <div className="icon iconTel"></div>
        </div>
        <div className="form-control">
          <input
            type="text" name="code" placeholder={this.context.intl.messages['app.account.inputCode']}
            ref={(ref) => { this.code = ref; }}
            onChange={this.handleChange}
          />
          <div className="icon iconCode"></div>
          { this.state.telReg ? this.state.getCodes ? <div className="code">{this.state.time + 's'}</div> : <div className="code" onClick={this.getCode}><FormattedMessage {...messages.bindPhoneGet} /></div> : <div className="code" style={{ "color": "#ccc" }}><FormattedMessage {...messages.bindPhoneGet} /></div> }
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
        <div className="form-control form-control-border">
          <Button onClick={this.handleSubmit}><FormattedMessage {...messages.bindPhoneSubmit} /></Button>
          <Button onClick={this.jump} className="jump"><FormattedMessage {...messages.bindPhoneJump} /></Button>
          <p className="remark"><FormattedMessage {...messages.bindPhoneRemark} /></p>
        </div>
      </form>
    );
  }
}
bindPhone.contextTypes = contextTypes;

export default bindPhone;
