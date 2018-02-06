
import React, { Component } from 'react';
import Button from 'components/button';
import api from 'utils/api';
import Cookie from 'tiny-cookie';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { nav } from 'utils/dx';
import { Toast , Confirm } from 'components/modal';

import './signInCom.styl';

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};

class SignInCom extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      company: '',
      username: '',
      password: '',
      code: '',
      isToastShow: false,
      toastContent: <FormattedMessage {...messages.toast} />,
      time: 1,
      img: '',
      isConfirmOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
    this.GetQueryString = this.GetQueryString.bind(this);
    this.getCode = this.getCode.bind(this);
    this.setNavBar = this.setNavBar.bind(this);
    this.urlData = this.GetQueryString('t');
  }
  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.account.signin.title'],
    });
  }
  handleChange() {
    this.setState({
      company: this.urlData || this.company.value,
      username: this.username.value,
      password: this.password.value,
      code: this.code ? this.code.value : '',
    });
  }
  getCode() {
    if (!this.company.value || !this.username.value) {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent:<FormattedMessage {...messages.toast} />,
      }));
      return false;
    }
    this.setState(Object.assign({}, this.state, {
      img: 'account/certification/center/checkCode?t=' + Date.parse(new Date()) + '&tenant_code=' + this.company.value + '&user_code=' + this.username.value,
    }));
  }
  handleSubmit(tag) {
    const self = this;
    if (!this.state.company || !this.state.username || !this.state.password)
    {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: <FormattedMessage {...messages.toast} />,
      }));
      return false;
    }
    api({
      method: 'POST',
      url: '/account/certification/center/login',
      data: {
        tenant_code: this.state.company,
        user_name: this.state.username,
        password: this.state.password,
        skip_duplicate_entries: tag ? true : false,
        code: this.state.code || '',
      },
    })
    .then((res) => {
      this.setState(Object.assign({}, this.state, {
        time: 1,
      }));
      const ticket = res.data.ticket;
      let options = {
        expires: '1Y',
      };
      if(window.location.href.indexOf('91yong.com') > -1) {
        options.domain = '91yong.com';
      }
      Cookie.remove('USER-TICKET');
      Cookie.set('USER-TICKET', ticket, options);
      api({
        method: 'GET',
        url: '/account/account/getLoginInfo',
      })
      .then((res) => {
        let urlHref = Cookie.getRaw('urlHref') ? unescape(Cookie.getRaw('urlHref')) : '';
        // if (res.data.modules && res.data.modules.mall) {
        //   Cookie.set('mallIcon', res.data.modules.mall);
        // } else {
        //   Cookie.set('mallIcon', true);
        // }
        // localStorage.mallIcon = res.data.modules ? res.data.modules.mall : true;
        if (urlHref) {
          if(urlHref === '#/account'){
            urlHref = '#/home';
          }
          Cookie.remove('urlHref');
          window.location = './' + urlHref;
        } else {
          if (res.data.binded_mobile_phone) {
            window.location = './';
          } else {
            window.location = './#/account/bindPhone';
          }
        }
      })
      .catch((err) => {
        self.setState(Object.assign({}, this.state, {
          isToastShow: true,
          toastContent: err.response.data.message,
        }));
      });
    })
    .catch((err) => {
      if (err.response.data.errorCode === 10000 ) {
        self.setState(Object.assign({}, this.state, {
          isConfirmOpen: true,
        }));
      } else {
        self.setState(Object.assign({}, this.state, {
          isToastShow: true,
          toastContent: err.response.data.message,
          time: err.response.data.data,
        }));
        if (self.state.time >= 5) {
          self.getCode();
        }
      }
    });
  }
  closeConfirm() {
    this.setState(Object.assign({}, this.state, {
      isConfirmOpen: false,
    }));
  }
  GetQueryString(name)
  {
    const reg = new RegExp(name + "=([^&]*)(&|$)");
    const r = window.location.hash.substr(1).match(reg);
    if (r !== null) return unescape(r[1]); return null;
  }
  render() {
    const self = this;
    this.setNavBar();
    return (
      <form className="signInCom">
      { !this.urlData &&
        <div className="form-control">
          <input
            type="text" name="company" placeholder={this.context.intl.messages['app.account.inputId']}
            ref={(ref) => { this.company = ref; }}
            value={this.state.company}
            onChange={this.handleChange}
          />
          <div className="icon iconCom"></div>
        </div>
      }
        <div className="form-control">
          <input
            type="text" maxLength="50" name="username" placeholder={this.context.intl.messages['app.account.inputAccount']}
            ref={(ref) => { this.username = ref; }}
            value={this.state.username}
            onChange={this.handleChange}
          />
          <div className="icon iconPerson"></div>
        </div>
        <div className="form-control">
          <input
            type="password" maxLength="50" name="password" placeholder={this.context.intl.messages['app.account.inputPwd']}
            ref={(ref) => { this.password = ref; }}
            value={this.state.password}
            onChange={this.handleChange}
          />
          <div className="icon iconPwd"></div>
        </div>
        {
          this.state.time >= 5 &&
          <div className="form-control">
            <input
              type="text" name="code" placeholder={this.context.intl.messages['app.account.inputCode']}
              ref={(ref) => { this.code = ref; }}
              value={this.state.code}
              onChange={this.handleChange}
            />
            <div className="icon iconCode"></div>
            <div className="code" onClick={this.getCode}><img src={this.state.img} /></div>
          </div>
        }
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
        <Confirm
          isOpen={this.state.isConfirmOpen}
          onRequestClose={this.closeConfirm}
          onConfirm={() => this.handleSubmit(true)}
          confirmButton={<span><FormattedMessage {...messages.signinOk} /></span>}
          cancelButton={<span><FormattedMessage {...messages.signinCancel} /></span>}
        >
          {<span><FormattedMessage {...messages.signinRemake} /></span>}
        </Confirm>
        <div className="form-control form-control-border">
          <Button onClick={() => this.handleSubmit(false)}><FormattedMessage {...messages.signinComSubmit} /></Button>
          {!this.urlData &&<p className="remark"><FormattedMessage {...messages.signinComRemark} /></p>}
        </div>
      </form>
    );
  }
}

SignInCom.contextTypes = contextTypes;

export default SignInCom;
