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
import icon_1 from './img/icon_1.png';
import icon_2 from './img/icon_2.png';
import icon_3 from './img/icon_3.png';
import icon_4 from './img/icon_4.png';

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};

class signIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tel: '',
      password: '',
      code: '',
      company: '',
      companyList: [],
      time: 1,
      telReg: false,
      urlData: '',
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
    this.ticket = this.GetQueryString('ticket');
  }
  componentWillMount() {
    if (this.ticket) {
      const ticket = this.ticket;
      const options = {
        expires: '1Y',
      };
      if(window.location.href.indexOf('91yong.com') > -1) {
        options.domain = '91yong.com';
      }
      Cookie.remove('USER-TICKET');
      Cookie.set('USER-TICKET', ticket, options);
      window.location = './';
    }
  }
  componentDidMount() {
    if (localStorage.tel) this.handleChange(true);
  }
  handleChange(tag) {
    if (this.urlData) {
      this.setState(Object.assign({}, this.state, {
        password: this.password.value,
        code: this.code ? this.code.value : '',
        tel: this.tel.value,
        telReg: false,
        company: this.urlData,
        isErrorShow: false,
        isConfirmOpen: false,
      }));
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.tel.value))) {
      if (!this.tel.value) localStorage.tel = '';
      this.setState(Object.assign({}, this.state, {
        password: this.password.value,
        code: this.code ? this.code.value : '',
        tel: this.tel.value,
        telReg: false,
        isErrorShow: false,
        isConfirmOpen: false,
        companyList: [],
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        password: this.password.value,
        code: this.code ? this.code.value : '',
        tel: this.tel.value,
        telReg: true,
        isErrorShow: false,
      }));
      if (tag) {
        api({
          method: 'GET',
          url: '/account/certification/center/get-tenant-id-by-mobile-phone?mp=' + this.tel.value,
        })
        .then((res) => {
          if (res.data.tenantCodeList && res.data.tenantCodeList.length === 1) {
            this.setState(Object.assign({}, this.state, {
              code: this.code ? this.code.value : '',
              company: res.data.tenantCodeList[0],
              companyList: res.data.tenantCodeList,
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
              isErrorShow: false,
            }));
          } else {
            this.setState(Object.assign({}, this.state, {
              password: this.password.value,
              code: this.code ? this.code.value : '',
              tel: this.tel.value,
              telReg: true,
              companyList: [],
              company: '',
              isErrorShow: false,
            }));
          }
        });
      } else {
        this.setState(Object.assign({}, this.state, {
          password: this.password.value,
          code: this.code ? this.code.value : '',
          tel: this.tel.value,
          telReg: true,
          isErrorShow: false,
          isConfirmOpen: false,
        }));
      }
    }
  }
  handleSubmit(tag) {
    const self = this;
    if (!(this.state.tel) || !(this.state.password))
    {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.messageAll} />,
      }));
      return false;
    }
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.tel.value)))
    {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.PhoneWrong} />,
      }));
      return false;
    }
    if (!this.state.companyList.length)
    {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.telOrPwd} />,
      }));
      return false;
    }
    if (!this.state.company)
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
        isConfirmOpen: false,
      }));
      const ticket = res.data.ticket;
      const options = {
        expires: '1Y',
      };
      if(this.state.isCheckbox) {
        localStorage.tel = this.state.tel;
      } else {
        localStorage.clear();
      }
      if(window.location.href.indexOf('91yong.com') > -1) {
        options.domain = '91yong.com';
      }
      Cookie.remove('USER-TICKET');
      Cookie.set('USER-TICKET', ticket, options);
      window.location = './';
    })
    .catch((err) => {
      if (err.response.data.errorCode === 10000) {
        self.setState(Object.assign({}, this.state, {
          isConfirmOpen: true,
        }));
      } else {
        self.setState(Object.assign({}, this.state, {
          isErrorShow: true,
          errorContent: err.response.data.message,
          time: err.response.data.data,
        }));
        if (self.state.time >= 5) {
          self.getCode();
        }
        setTimeout(() => {
          self.setState({ isErrorShow: false });
        }, 3000);
      }
    });
  }
  getCode() {

    const imgCompany = this.company ? this.company.value : this.state.company;
    this.setState(Object.assign({}, this.state, {
      img: 'account/certification/center/checkCode?t=' + Date.parse(new Date()) + '&tenant_code=' + imgCompany + '&user_code=' + this.state.tel,
    }));
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
    if (this.ticket) return null;
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
                <div className="formInput">
                  <Errors
                    isOpen={this.state.isErrorShow}
                    timeout={3000}
                  >{this.state.errorContent}
                  </Errors>
                  <img src={icon_1} alt="icon" />
                  <input
                    type="text" maxLength="50" name="tel" placeholder={this.context.intl.messages['app.account.inputTel']}
                    ref={(ref) => { this.tel = ref; }}
                    onChange={() => this.handleChange(true)}
                    value={this.state.tel ? this.state.tel : localStorage.tel ? localStorage.tel : ''}
                  />
                </div>
                {
                  this.state.companyList.length > 1 &&
                  <div className="formInput">
                    <img src={icon_2} alt="icon" />
                    <select name="company" ref={(ref) => { this.company = ref; }}>
                      {
                        this.state.companyList.map((data) => (
                          <option value={data} key={data}>{data}</option>
                        ))
                      }
                    </select>
                  </div>
                }
                <div className="formInput">
                  <img src={icon_3} alt="icon" />
                  <input
                    type="password" maxLength="50" name="password" placeholder={this.context.intl.messages['app.account.inputPwd']}
                    ref={(ref) => { this.password = ref; }}
                    onChange={() => this.handleChange(false)}
                    value={this.state.password}
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
                    <p><a href={"#/account/signCom?t=" + this.urlData}><FormattedMessage {...messages.companyLogin} /></a></p>
                  }
                  {
                    !this.urlData &&
                    <p><a href="#/account/signCom"><FormattedMessage {...messages.companyLogin} /></a></p>
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

signIn.contextTypes = contextTypes;

export default signIn;
