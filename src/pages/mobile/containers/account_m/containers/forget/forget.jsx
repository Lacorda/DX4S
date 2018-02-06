
import React, { Component } from 'react';
import Button from 'components/button';
import api from 'utils/api';
import Cookie from 'tiny-cookie';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';
import Toast from '../../../../components/modal/toast';

import './forget.styl';

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};

class Forget extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      comId: '',
      tel: '',
      code: '',
      Imgcode: '',
      getCodes: false,
      codeTime: 60,
      isToastShow: false,
      telReg: false,
      toastContent: <FormattedMessage id="app.account.PhoneWrong" />,
    };
    this.phoneTime = 0;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCode = this.getCode.bind(this);
    this.setNavBar = this.setNavBar.bind(this);
  }
  componentWillUnmount() {
    this.phoneTime = 0;
  }
  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.account.forget.title'],
    });
  }
  getCode() {
    const self = this;
    if (this.state.getCodes === false) {
      api({
        method: 'GET',
        url: '/account/getDynamicCode?mobile_phone=' + this.tel.value + '&tenant_code=' + this.comId.value + '&type=2',
      })
      .then((res) => {
        this.setState(Object.assign({}, this.state, {
          getCodes: true,
        }));
        self.phoneTime = setInterval(function () {
          if (self.state.codeTime !== 0) {
            self.setState(Object.assign({}, self.state, {
              codeTime: self.state.codeTime - 1,
            }));
          } else {
            self.setState(Object.assign({}, self.state, {
              getCodes: false,
              codeTime: 60,
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
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.tel.value))) {
      this.setState(Object.assign({}, this.state, {
        telReg: false,
        comId: this.comId.value,
        tel: this.tel.value,
        code: this.code.value,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        telReg: true,
        comId: this.comId.value,
        tel: this.tel.value,
        code: this.code.value,
      }));
    }
  }
  handleSubmit() {
    const self = this;
    api({
      method: 'POST',
      url: '/account/certification/center/login',
      data: {
        tenant_code: this.state.comId,
        user_name: this.state.tel,
        password: this.state.code,
        skip_duplicate_entries: true,
        code: this.Imgcode ? this.Imgcode.value : this.state.Imgcode,
        type: 2,
      },
    })
    .then((res) => {
      const ticket = res.data.ticket;
      let options = {
        expires: '1Y',
      };

      if(window.location.href.indexOf('91yong.com') > -1) {
        options.domain = '91yong.com';
      }
      Cookie.remove('USER-TICKET');
      Cookie.set('USER-TICKET', ticket, options);
      Cookie.setRaw('sign-info', JSON.stringify(this.state), { expires: '1Y' });
      window.location = './account.html#/changePwd';
    })
    .catch((err) => {
      self.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: err.response.data.message,
      }));
      setTimeout(() => self.setState({ isToastShow: false }), 3000);
    });
  }
  render() {
    const self = this;
    this.setNavBar();
    return (
      <form className="forget">
        <div className="form-control">
          <input
            type="text" name="comId" placeholder={this.context.intl.messages.inputId}
            ref={(ref) => { this.comId = ref; }}
            onChange={this.handleChange}
          />
          <div className="icon iconTel"></div>
        </div>
        <div className="form-control">
          <input
            type="text" name="tel" placeholder={this.context.intl.messages.inputTel}
            ref={(ref) => { this.tel = ref; }}
            onChange={this.handleChange}
          />
          <div className="icon iconPwd"></div>
        </div>
        <div className="form-control">
          <input
            type="text" name="code" placeholder={this.context.intl.messages.inputCode}
            ref={(ref) => { this.code = ref; }}
            onChange={this.handleChange}
          />
          <div className="icon iconCode"></div>
          { this.state.telReg && this.state.comId ? this.state.getCodes ? <div className="code">{this.state.codeTime + 's'}</div> : <div className="code" onClick={this.getCode}><FormattedMessage id="app.account.forget.get" /></div> : <div className="code" style={{ "color": "#ccc" }}><FormattedMessage id="app.account.forget.get" /></div> }
        </div>

        <div className="form-control form-control-border">
        {
          this.state.comId && this.state.tel && this.state.code
          ? <Button type="primary" onClick={this.handleSubmit} ><FormattedMessage id="app.account.forget.find" /></Button>
          : <Button type="primary" className="btn-disabled"><FormattedMessage id="app.account.forget.find" /></Button>
        }
        </div>
        <p className="remark"><FormattedMessage id="app.account.forget.remark" /></p>
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

Forget.contextTypes = contextTypes;

export default Forget;
