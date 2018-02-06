import './account.styl';
import React from 'react';
import logo from './img/logo.png';
import api from 'utils/api';
import Errors from './errors.jsx';
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

class bindPhone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tel: '',
      code: '',
      getCodes: false,
      time: 60,
      telReg: false,
      isErrorShow: false,
      errorContent: '',
      isConfirmOpen: false,
    };
    this.phoneTime = 0;
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
          errorContent: err.response.data.message,
          isErrorShow: true,
        }));
      });
    }
  }
  handleChange() {
    this.setState({
      tel: this.tel.value,
      code: this.code.value,
    });
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.tel.value))) {
      this.setState(Object.assign({}, this.state, {
        telReg: false,
        isErrorShow: false,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        telReg: true,
        isErrorShow: false,
      }));
    }
  }
  handleSubmit() {
    const self = this;
    if (!this.tel.value || !this.code.value)
    {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.messageAll} />,
      }));
      // setTimeout(() => self.setState({ isToastShow: false }), 3000);
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
        errorContent: err.response.data.message,
        isErrorShow: true,
      }));
    });
  }

  render() {
    return (
      <div id="account">
        <div id="accountNav">
          <div className="top" onClick={this.test}><img src={logo} /></div>
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
                    type="text" name="code" placeholder={this.context.intl.messages['app.account.inputCode']} className="code"
                    ref={(ref) => { this.code = ref; }}
                    onChange={this.handleChange}
                  />
                  <div className="line"></div>
                  { this.state.telReg ? this.state.getCodes ? <div className="codeImg">{this.state.time + 's'}</div> : <div className="codeImg" onClick={this.getCode}><FormattedMessage {...messages.getCode} /></div> : <div className="codeImg" style={{ color: '#ccc' }}><FormattedMessage {...messages.getCode} /></div> }
                </div>
                <div className="formBtn" style={{ margin: '20px auto' }}>
                  <button onClick={this.handleSubmit}><FormattedMessage {...messages.submit} /></button>
                  <a href="./"><button style={{ background: '#585a5c', margin: '20px auto' }}><FormattedMessage {...messages.jump} /></button></a>
                </div>
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
bindPhone.contextTypes = contextTypes;
export default bindPhone;
