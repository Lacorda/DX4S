
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Button from 'components/button';
import api from 'utils/api';
import Cookie from 'tiny-cookie';
import { Link } from 'react-router';
import { Toast , Confirm } from '../../../../components/modal';
import { nav } from 'utils/dx';

import './signIn.styl';

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};

class SignIn extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tel: '',
      password: '',
      code: '',
      company: '',
      companyList: [],
      isToastShow: false,
      toastContent: <FormattedMessage {...messages.toast} />,
      time: 1,
      telReg: false,
      urlData: '',
      isConfirmOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
    this.GetQueryString = this.GetQueryString.bind(this);
    this.setNavBar = this.setNavBar.bind(this);
    this.getCode = this.getCode.bind(this);
    this.urlData = this.GetQueryString('t');
  }
  handleChange(tag) {
    if (this.urlData) {
      this.setState(Object.assign({}, this.state, {
        password: this.password.value,
        code: this.code ? this.code.value : '',
        tel: this.tel.value,
        telReg: false,
        company: this.urlData,
      }));
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.tel.value))) {
      this.setState(Object.assign({}, this.state, {
        password: this.password.value,
        code: this.code ? this.code.value : '',
        tel: this.tel.value,
        telReg: false,
      }));
    } else {
      if (tag) {
        api({
          method: 'GET',
          url: '/account/certification/center/get-tenant-id-by-mobile-phone?mp=' + this.tel.value,
        })
        .then((res) => {
          if (res.data.tenantCodeList && res.data.tenantCodeList.length === 1) {
            this.setState(Object.assign({}, this.state, {
              password: this.password.value,
              code: this.code ? this.code.value : '',
              tel: this.tel.value,
              telReg: true,
              company: res.data.tenantCodeList[0],
              companyList: [],
            }));
          } else if (res.data.tenantCodeList && res.data.tenantCodeList.length > 1) {
            const companyList = [];
            res.data.tenantCodeList.map((data) => {
              companyList.push(data);
            });
            this.setState(Object.assign({}, this.state, {
              password: this.password.value,
              code: this.code ? this.code.value : '',
              tel: this.tel.value,
              telReg: true,
              companyList: companyList,
              company: res.data.tenantCodeList[0],
            }));
          } else {
            this.setState(Object.assign({}, this.state, {
              password: this.password.value,
              code: this.code ? this.code.value : '',
              tel: this.tel.value,
              telReg: true,
              companyList: [],
              company: '',
            }));
          }
        });
      } else {
        this.setState(Object.assign({}, this.state, {
          password: this.password.value,
          code: this.code ? this.code.value : '',
          tel: this.tel.value,
          telReg: true,
        }));
      }
    }
  }
  getCode() {
    if (!this.tel.value) {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: <FormattedMessage {...messages.toast} />,
      }));
      return false;
    }
    const imgCompany = this.company ? this.company.value : this.state.company;
    this.setState(Object.assign({}, this.state, {
      img: 'account/certification/center/checkCode?t=' + Date.parse(new Date()) + '&tenant_code=' + imgCompany + '&user_code=' + this.state.tel,
    }));
  }
  handleSubmit(tag) {
    const self = this;
    if (!this.state.tel || !this.state.password)
    {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: <FormattedMessage {...messages.toast} />,
      }));
      return false;
    }
    if (!this.state.company)
    {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: <FormattedMessage {...messages.bindID} />,
      }));
      return false;
    }
    api({
      method: 'POST',
      url: '/account/certification/center/login',
      data: {
        tenant_code: this.company ? this.company.value : this.state.company,
        user_name: this.state.tel,
        password: this.state.password,
        skip_duplicate_entries: tag ? true : false,
        code: this.code ? this.code.value : this.state.code,
        type: 1,
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
      window.location = './'
      // api({
      //   method: 'GET',
      //   url: '/account/account/getLoginInfo',
      // })
      // .then((res) => {

      // })
      // .catch((err) => {
      //   self.setState(Object.assign({}, this.state, {
      //     isToastShow: true,
      //     toastContent: err.response.data.message,
      //   }));
      // });
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
  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.account.signin.title'],
    });
  }
  GetQueryString(name) {
    const reg = new RegExp(name + "=([^&]*)(&|$)");
    const r = window.location.hash.substr(1).match(reg);
    if (r !== null) return unescape(r[1]); return null;
  }
  render() {
    const self = this;
    this.setNavBar();
    return (
      <form className="signIn">
        <div className="form-control">
          <input
            type="text" maxLength="50" name="tel" placeholder={this.context.intl.messages['app.account.inputTel']}
            ref={(ref) => { this.tel = ref; }}
            onChange={() => this.handleChange(true)}
          />
          <div className="icon iconTel"></div>
        </div>
        {
          self.state.companyList.length > 1 &&
          <div className="form-control">
            <select name="company" ref={(ref) => { this.company = ref; }}>
            {
              self.state.companyList.map((data) => (
                <option value={data} key={data}>{data}</option>
              ))
            }
            </select>
            <div className="icon iconCom"></div>
            <div className="selectIcon"></div>
          </div>
        }
        <div className="form-control">
          <input
            type="password" maxLength="50" name="password" placeholder={this.context.intl.messages['app.account.inputPwd']}
            ref={(ref) => { this.password = ref; }}
            onChange={() => this.handleChange(false)}
          />
          <div className="icon iconPwd"></div>
        </div>
        {
          this.state.time >= 5 &&
          <div className="form-control">
            <input
              type="text" name="code" placeholder={this.context.intl.messages['app.account.inputCode']}
              ref={(ref) => { this.code = ref; }}
              onChange={() => this.handleChange(false)}
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
          <p className="forgetPwd"><Link to="/account/forget"><FormattedMessage {...messages.signinForget} /></Link></p>
          <Button onClick={() => this.handleSubmit(false)}><FormattedMessage {...messages.signinLogin} /></Button>
        </div>
        {
          this.urlData &&
          <p className="remark"><Link to={"/account/signCom?t=" + this.urlData}><FormattedMessage {...messages.signinCompany} /></Link></p>
        }
        {
          !this.urlData &&
          <p className="remark"><Link to="/account/signCom"><FormattedMessage {...messages.signinCompany} /></Link></p>
        }
      </form>
    );
  }
}

SignIn.contextTypes = contextTypes;

export default SignIn;

