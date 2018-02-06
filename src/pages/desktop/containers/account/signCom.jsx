import './account.styl';
import React from 'react';
import api from 'utils/api';
import Cookie from 'tiny-cookie';
import Errors from './errors.jsx';
import Confirm from '../../components/confirm';
import DxFooter from '../../components/footer';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import logo from './img/logo.png';
import banner from './img/banner.png';
import icon_2 from './img/icon_2.png';
import icon_3 from './img/icon_3.png';
import icon_4 from './img/icon_4.png';
import icon_5 from './img/icon_5.png';

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};

class signCom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      company: '',
      username: '',
      password: '',
      code: '',
      time: 1,
      img: '',
      isErrorShow: false,
      errorContent: '',
      isConfirmOpen: false,
      isCheckbox: true,
    };
    this.clickCheckbox = this.clickCheckbox.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.GetQueryString = this.GetQueryString.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
    this.getCode = this.getCode.bind(this);
    this.urlData = this.GetQueryString('t');
  }
  handleChange() {
    if (!this.username.value) localStorage.username = '';
    if (this.company && !this.company.value) localStorage.company = '';
    this.setState({
      company: this.urlData || this.company.value,
      username: this.username.value,
      password: this.password.value,
      code: this.code ? this.code.value : '',
      isErrorShow: false,
      isConfirmOpen: false,
    });
  }
  handleSubmit(tag) {
    const self = this;
    if (!this.state.company || !this.state.username || !this.state.password)
    {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.messageAll} />,
      }));
      return false;
    }
    if (this.state.time >= 5 && !this.state.code)
    {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.enterPIN} />,
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
        isConfirmOpen: false,
      }));
      const ticket = res.data.ticket;
      const options = {
        expires: '1Y',
      };
      if(this.state.isCheckbox) {
        localStorage.company = this.state.company;
        localStorage.username = this.state.username;
      } else {
        localStorage.clear();
      }
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
        if (res.data.binded_mobile_phone) {
          window.location = './';
        } else {
          window.location = '#/account/bindPhone';
        }
      })
      .catch((err) => {
        self.setState(Object.assign({}, this.state, {
          isErrorShow: true,
          errorContent: err.response.data.message,
        }));
      });
    })
    .catch((err) => {
      if (err.response.data.errorCode === 10000) {
        self.setState(Object.assign({}, this.state, {
          isConfirmOpen: true,
        }));
      } else {
        const newState = {
          time: err.response.data.data,
          isErrorShow: true,
          errorContent: err.response.data.message,
        };
        if (newState.time >= 5) {
          self.getCode();
        }
        self.setState(newState);
        setTimeout(() => {
          self.setState({ isErrorShow: false });
        }, 3000);
      }
    });
  }
  getCode() {
    const imgCompany = this.company ? this.company.value : this.state.company;
    const img = 'account/certification/center/checkCode?t=' + Date.parse(new Date()) + '&tenant_code=' + imgCompany + '&user_code=' + this.username.value;
    this.setState({ img });
  }
  clickCheckbox() {
    this.setState({
      isCheckbox: !this.state.isCheckbox,
    });
  }
  closeConfirm() {
    this.setState(Object.assign({}, this.state, {
      isConfirmOpen: false,
    }));
  }
  GetQueryString(name) {
    const reg = new RegExp(name + "=([^&]*)(&|$)");
    const r = window.location.hash.substr(1).match(reg);
    if (r !== null) return unescape(r[1]); return null;
  }
  render() {
    return (
      <div id="account">
        <div id="accountNav">
          <div className="top"><img src={logo} /></div>
        </div>
        <div id="accountContent">
          <div className="content">
            <div className="banner"><img src={banner} /></div>
            <div className="form1">
              <div className="formBox">
                { !this.urlData &&
                  <div className="formInput">
                    <Errors
                      isOpen={this.state.isErrorShow}
                      timeout={3000}
                    >{this.state.errorContent}</Errors>
                    <img src={icon_2} alt="icon" />
                    <input
                      type="text" name="company" placeholder={this.context.intl.messages['app.account.inputId']}
                      ref={(ref) => { this.company = ref; }}
                      value={this.state.company ? this.state.company : localStorage.company ? localStorage.company : ''}
                      onChange={this.handleChange}
                    />
                  </div>
                }
                <div className="formInput">
                  {this.urlData &&
                    <Errors
                      isOpen={this.state.isErrorShow}
                      timeout={3000}
                    >{this.state.errorContent}</Errors>
                  }
                  <img src={icon_5} alt="icon" />
                  <input
                    type="text" maxLength="50" name="username" placeholder={this.context.intl.messages['app.account.inputAccount']}
                    ref={(ref) => { this.username = ref; }}
                    value={this.state.username ? this.state.username : localStorage.username ? localStorage.username : ''}
                    // value={this.state.username}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="formInput">
                  <img src={icon_3} alt="icon" />
                  <input
                    type="password" maxLength="50" name="password" placeholder={this.context.intl.messages['app.account.inputPwd']}
                    ref={(ref) => { this.password = ref; }}
                    value={this.state.password}
                    // value={this.state.password}
                    onChange={this.handleChange}
                  />
                </div>
                {
                  this.state.time >= 5 &&
                  <div className="formInput">
                    <img src={icon_4} alt="icon" />
                    <input
                      type="text" name="code" className="code" placeholder={this.context.intl.messages['app.account.inputCode']}
                      ref={(ref) => { this.code = ref; }}
                      onChange={() => this.handleChange(false)}
                    />
                    <div className="line"></div>
                    <div className="codeImg" onClick={this.getCode}><img src={this.state.img} /></div>
                  </div>
                }
                <div className="formBtn">
                  <span className="remember"><input type="checkbox" name="remember" onChange={this.clickCheckbox}  defaultChecked={true} /> <FormattedMessage {...messages.remember} /> </span>
                  <span className="formForget"><a href="#/account/forget"><FormattedMessage {...messages.forget} /></a></span>
                  <button onClick={() => this.handleSubmit(false)}><FormattedMessage {...messages.login} /></button>
                  {
                    this.urlData &&
                    <p><a href={"#/account?t=" + this.urlData}><FormattedMessage {...messages.telLogin} /></a></p>
                  }
                  {
                    !this.urlData &&
                    <p><a href="#/account"><FormattedMessage {...messages.telLogin} /></a></p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <Confirm
          isOpen={this.state.isConfirmOpen}
          confirm={() => this.handleSubmit(true)}
          confirmButton={<span><FormattedMessage {...messages.ok} /></span>}
          cancelButton={<span><FormattedMessage {...messages.cancel} /></span>}
        >
          {<span><FormattedMessage {...messages.remake} /></span>}
        </Confirm>
        <DxFooter theme={'white'} hiddenLink></DxFooter>
      </div>
    );
  }
}

signCom.contextTypes = contextTypes;

export default signCom;
