import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import Confirm from 'components/modal/confirm';

import messages from './messages';
import './SMSConfirm.styl';

class SMSConfirm extends Component {
  constructor() {
    super();
    this.state = {
      telephone: '',
      code: '',
      isOpen: false,
      wrongPhone: false,
      wrongCode: false,
      countdownSecond: 0,
      inCountdown: false,
      countdownInterval: null,
    };
  }

  componentWillReceiveProps({ defaultPhone }) {
    if (!this.state.telephone) this.setState({ telephone: defaultPhone });
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  onPhoneInput = (e) => {
    const telephone = e.target.value;
    const isValidPhone = /^1[3578]\d{9}$/.test(telephone);
    this.setState({ telephone, wrongPhone: !isValidPhone });
  };

  // eslint-disable-next-line arrow-parens
  onConfirm = async() => {
    const { telephone, code } = this.state;
    const isValid = await this.props.verify(telephone, code);
    if (isValid) this.props.onVerified();
    else this.setState({ wrongCode: true });
  };

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  startCountdown = () => {
    clearInterval(this.state.countdownInterval);
    const countdownInterval = setInterval(() => {
      const countdownSecond = this.state.countdownSecond;
      if (countdownSecond > 0) this.setState({ countdownSecond: countdownSecond - 1 });
      else {
        clearInterval(countdownInterval);
        this.setState({ inCountdown: false });
      }
    }, 1000);
    this.setState({ countdownInterval });
  };

  requestCode = () => {
    const { inCountdown, wrongPhone } = this.state;
    if (inCountdown || wrongPhone) return;
    this.props.onRequestCode(this.state.telephone);
    this.setState({ inCountdown: true, countdownSecond: 60 }, this.startCountdown);
  };

  render() {
    const { children } = this.props;
    const {
      wrongPhone,
      wrongCode,
      telephone,
      countdownSecond,
      inCountdown,
      isOpen,
    } = this.state;

    const wrongPhoneEl = wrongPhone
      ? <div className="message-error">
        <FormattedMessage {...messages.messageWrongPhone} />
      </div>
      : null;

    const wrongCodeEl = wrongCode
      ? <div className="message-error">
        <FormattedMessage {...messages.messageWrongCode} />
      </div>
      : null;

    const codeButtonClass = classnames('button-code', { disabled: inCountdown });

    const countdownEl = countdownSecond
      ? <span>({countdownSecond})</span>
      : null;

    return (
      <Confirm
        manual
        isOpen={isOpen}
        onCancel={() => this.setState({ isOpen: false })}
        onConfirm={this.onConfirm}
      >
        <div className="confirm-sms">
          <div className="message-prompt">{children}</div>
          <div className="section-input">
            {wrongPhoneEl}
            <input
              type="text"
              onChange={this.onPhoneInput}
              value={telephone}
            />
          </div>
          <div className="section-input">
            {wrongCodeEl}
            <div className="section-code">
              <input type="text" onChange={e => this.setState({ code: e.target.value })} />
              <div className={codeButtonClass} onClick={this.requestCode}>
                <FormattedMessage {...messages.requestCode} />
                {countdownEl}
              </div>
            </div>
          </div>
        </div>
      </Confirm>
    );
  }
}

const { string, func, oneOfType, element } = React.PropTypes;
SMSConfirm.propTypes = {
  defaultPhone: string, // 默认手机号
  verify: func.isRequired, // 验证短信码是否正确，返回Promise.resolve(true)表示验证正确
  onRequestCode: func.isRequired, // 点击请求验证码时的回调函数
  onVerified: func, // 当验证通过时的回调函数
  children: oneOfType([string, element]), // 提示语
};

SMSConfirm.defaultProps = {
  defaultPhone: '',
};

export default SMSConfirm;
