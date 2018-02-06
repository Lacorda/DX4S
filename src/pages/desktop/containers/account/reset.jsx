import './account.styl';
import React from 'react';
import api from 'utils/api';
import Cookie from 'tiny-cookie';
import Errors from './errors.jsx';
import Alert from '../../components/alert';
import Confirm from '../../components/confirm';
import DxFooter from '../../components/footer';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import logo from './img/logo.png';
import banner from './img/banner.png';
import icon_6 from './img/icon_6.png';

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};

class reset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPwd: '',
      pwd: '',
      pwdConfirm: '',
      isErrorShow: false,
      errorContent: '',
      isAlertShow: false,
      isConfirmOpen: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    this.setState(Object.assign({}, this.state, {
      oldPwd: this.oldPwd.value,
      pwd: this.pwd.value,
      pwdConfirm: this.pwdConfirm.value,
      isErrorShow: false,
    }));
  }
  handleSubmit() {
    const self = this;
    const chineseReg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if (this.pwd.value !== this.pwdConfirm.value) {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.differencePwd} />,
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
    } else if (chineseReg.test(this.pwd.value)) {
      this.setState(Object.assign({}, this.state, {
        isErrorShow: true,
        errorContent: <FormattedMessage {...messages.pwdChinese} />,
      }));
      return false;
    } else {
      api({
        method: 'POST',
        url: '/account/account/changePass',
        data: {
          old_pass: this.oldPwd.value,
          new_pass: this.pwd.value,
        },
      })
      .then((res) => {
        Cookie.set('USER-TICKET', '');
        self.setState(Object.assign({}, this.state, {
          isAlertShow: true,
        }));
        setTimeout(function () {
          self.setState({ isErrorShow: false });
          window.location = '#/account';
        }, 3000);
      })
      .catch((err) => {
        self.setState(Object.assign({}, self.state, {
          isErrorShow: true,
          errorContent: err.response.data.message,
        }));
        return false;
      });
    }
  }
  render() {
    return (
      <div id="account">
        <Alert
          isShow={this.state.isAlertShow}
          timeout={3000}
        ><FormattedMessage {...messages.changeSuccess} />
        </Alert>
        <div id="accountNav">
          <div className="top"><img src={logo} /></div>
        </div>
        <div id="accountContent" style={{ background: '#f2f4f8' }}>
          <div className="content">
            <div className="form2 form1">
              <div className="formBox" style={{ padding: '20px' }}>
                <div className="formTitle">
                  <img src={icon_6} alt="icon" />
                  <p><FormattedMessage {...messages.changePwd} /></p>
                </div>
                <div className="formInput">
                  <Errors
                    isOpen={this.state.isErrorShow}
                    timeout={3000}
                  >{this.state.errorContent}</Errors>
                  <input
                    type="password" name="oldPwd" placeholder={this.context.intl.messages['app.account.inputReactOldPwd']}
                    style={{ left: '10px' }}
                    ref={(ref) => { this.oldPwd = ref; }}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="formInput">
                  <input
                    type="password" name="pwd" placeholder={this.context.intl.messages['app.account.inputReactNewPwd']}
                    style={{ left: '10px' }}
                    ref={(ref) => { this.pwd = ref; }}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="formInput">
                  <input
                    type="password" name="pwdConfirm" placeholder={this.context.intl.messages['app.account.inputReactNewPwdRepeat']}
                    style={{ left: '10px' }}
                    ref={(ref) => { this.pwdConfirm = ref; }}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="formBtn">
                  <div className="formBtn">
                  {
                    this.state.oldPwd && this.state.pwd && this.state.pwdConfirm
                    ? <button type="primary" onClick={this.handleSubmit} ><FormattedMessage {...messages.change} /></button>
                    : <button type="primary" className="btn-disabled"><FormattedMessage {...messages.change} /></button>
                  }
                  </div>
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

reset.contextTypes = contextTypes;

export default reset;
