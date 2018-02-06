import './account.styl';
import api from 'utils/api';
import Cookie from 'tiny-cookie';
import React from 'react';
import Errors from './errors.jsx';
import logo from './img/logo.png';
import DxFooter from '../../components/footer';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import banner from './img/banner.png';
import icon_1 from './img/icon_1.png';
import icon_2 from './img/icon_2.png';
import icon_3 from './img/icon_3.png';
import icon_4 from './img/icon_4.png';

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};

class forget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comId: '',
      tel: '',
      code: '',
      Imgcode: '',
      getCodes: false,
      codeTime: 60,
      telReg: false,
      isErrorShow: false,
      errorContent: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCode = this.getCode.bind(this);
  }
  componentWillUnmount() {
    this.phoneTime = 0;
    clearInterval(this.phoneTime);
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
          errorContent: err.response.data.message,
          isErrorShow: true,
        }));
      });
    }
  }
  handleChange() {
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.tel.value))) {
      this.setState(Object.assign({}, this.state, {
        telReg: false,
        comId: this.comId.value,
        tel: this.tel.value,
        code: this.code.value,
        isErrorShow: false,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        telReg: true,
        comId: this.comId.value,
        tel: this.tel.value,
        code: this.code.value,
        isErrorShow: false,
      }));
    }
  }
  handleSubmit() {
    const self = this;
    if (!this.state.comId || !this.state.tel || !this.state.code)
    {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.messageAll} />,
      }));
      return false;
    }
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
      const options = {
        expires: '1Y',
      };
      if(window.location.href.indexOf('91yong.com') > -1) {
        options.domain = '91yong.com';
      }
      Cookie.remove('USER-TICKET');
      Cookie.set('USER-TICKET', ticket, options);
      Cookie.setRaw('sign-info', JSON.stringify(this.state), { expires: '1Y' });
      window.location = '#/account/changePwd';
    })
    .catch((err) => {
      self.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: err.response.data.message,
      }));
    });
  }
  render() {
    return (
      <div id="account" style={{ position: 'relative' }}>
        <div id="accountNav">
          <div className="top"><img src={logo} /></div>
        </div>
        <div id="accountContent" style={{ background: '#f2f4f8' }}>
          <div className="content">
            <div className="form2 form1">
              <div className="formBox" style={{ padding: '20px' }}>
                <div className="formInput">
                  <Errors
                    isOpen={this.state.isErrorShow}
                    timeout={3000}
                  >{this.state.errorContent}</Errors>
                  <img src={icon_2} alt="icon" />
                  <input
                    type="text" name="comId" placeholder={this.context.intl.messages['app.account.inputId']}
                    ref={(ref) => { this.comId = ref; }}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="formInput">
                  <img src={icon_1} alt="icon" />
                  <input
                    type="text" name="tel" placeholder={this.context.intl.messages['app.account.inputTel']}
                    ref={(ref) => { this.tel = ref; }}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="formInput">
                  <img src={icon_4} alt="icon" />
                  <input
                    type="text" name="code" placeholder={this.context.intl.messages['app.account.inputCode']}
                    ref={(ref) => { this.code = ref; }}
                    onChange={this.handleChange}
                  />
                  <div className="line"></div>
                  { this.state.telReg && this.state.comId ? this.state.getCodes ? <div className="codeImg">{this.state.codeTime + 's'}</div> : <div className="codeImg" onClick={this.getCode}><FormattedMessage {...messages.getCode} /></div> : <div className="codeImg" style={{ color: '#ccc' }}><FormattedMessage {...messages.getCode} /></div> }
                </div>
                <div className="formBtn">
                  {
                    this.state.comId && this.state.tel && this.state.code
                    ? <button type="primary" onClick={this.handleSubmit} ><FormattedMessage {...messages.findPwd} /></button>
                    : <button type="primary" className="btn-disabled"><FormattedMessage {...messages.findPwd} /></button>
                  }
                </div>
                <p className="formBoxForget"><FormattedMessage {...messages.findPwdRemark} /></p>
              </div>
            </div>
          </div>
        </div>
        <DxFooter
          theme={'white'}
        ></DxFooter>
      </div>
    );
  }
}

forget.contextTypes = contextTypes;

export default forget;
