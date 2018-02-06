import './account.styl';
import React from 'react';
import api from 'utils/api';
import Cookie from 'tiny-cookie';
import Errors from './errors.jsx';
import Alert from '../../components/alert';
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

class changePwd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pwd: '',
      pwdConfirm: '',
      isErrorShow: false,
      errorContent: '',
      isAlertShow: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    this.setState(Object.assign({}, this.state, {
      pwd: this.pwd.value,
      pwdConfirm: this.pwdConfirm.value,
      isErrorShow: false,
    }));
  }
  handleSubmit() {
    const self = this;
    if (!this.pwd.value || !this.pwdConfirm.value)
    {
      self.setState(Object.assign({}, self.state, {
        errorContent: <FormattedMessage {...messages.messageAll} />,
        isErrorShow: true,
      }));
      return false;
    } else if (this.pwd.value !== this.pwdConfirm.value) {
      self.setState(Object.assign({}, self.state, {
        errorContent: <FormattedMessage {...messages.differencePwd} />,
        isErrorShow: true,
      }));
      return false;
    } else if (this.pwd.value.length < 6 || this.pwd.value.length > 20) {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.pwdLenght} />,
      }));
      return false;
    } else if (!/^\S+$/gi.test(this.pwd.value)) {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.pwdEmpty} />,
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
          isAlertShow: true,
        }));
        setTimeout(function () {
          window.location = '#/account';
        }, 3000);
      })
      .catch((err) => {
        self.setState(Object.assign({}, this.state, {
          isErrorShow: true,
          errorContent: err.response.data.message,
        }));
      });
    }
  }
  render() {
    return (
      <div id="account">
        <div id="accountNav">
          <div className="top"><img src={logo} /></div>
        </div>
        <Alert
          isShow={this.state.isAlertShow}
          timeout={3000}
        ><FormattedMessage {...messages.changeSuccess} />
        </Alert>
        <div id="accountContent" style={{ background: '#f2f4f8' }}>
          <div className="content">
            <div className="form1 form2">
              <div className="formBox" style={{ padding: '20px' }}>
                <div className="formInput">
                  <Errors
                    isOpen={this.state.isErrorShow}
                    timeout={3000}
                  >{this.state.errorContent}</Errors>
                  <img src={icon_3} alt="icon" />
                  <input
                    type="password" name="pwd" placeholder={this.context.intl.messages['app.account.inputNewPwd']}
                    ref={(ref) => { this.pwd = ref; }}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="formInput">
                  <img src={icon_3} alt="icon" />
                  <input
                    type="password" name="pwdConfirm" placeholder={this.context.intl.messages['app.account.inputPwdRepeat']}
                    ref={(ref) => { this.pwdConfirm = ref; }}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="formBtn">
                  {
                    this.state.pwd && this.state.pwdConfirm
                    ? <button type="primary" onClick={this.handleSubmit} ><FormattedMessage {...messages.submit} /></button>
                    : <button type="primary" className="btn-disabled"><FormattedMessage {...messages.submit} /></button>
                  }
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

changePwd.contextTypes = contextTypes;

export default changePwd;
