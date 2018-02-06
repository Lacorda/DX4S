import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { RelativeLink } from 'react-router-relative-links';
import { connect } from 'react-redux';
import { nav } from 'utils/dx';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import Toast from '../../../../components/modal/toast';
import { payment as paymentActions } from '../../actions';
import './styles.styl';
import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const propTypes = {
  enterpriseOrder: PropTypes.object.isRequired,
  verificationCode: PropTypes.bool.isRequired,
  fetchParams: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  err: PropTypes.object.isRequired,
};

class Enterprise extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.ePay = this.ePay.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.getVerificationCode = this.getVerificationCode.bind(this);
    this.openToast = this.openToast.bind(this);
    this.closeToast = this.closeToast.bind(this);
    this.intervalCB = this.intervalCB.bind(this);
    this.intervalID = 0;
    this.state = {
      isToastOpen: false,
      isErrToastOpen: false,
      phone: '',
      code: '',
      countdown: 60,
      validPhone: false,
    };
  }

  componentDidMount() {
    const { actions, fetchParams } = this.props;
    actions.fetchPaymentEnterpriseOrder(fetchParams);
    setNav(this.context.intl.messages['app.payment.title.enterprise']);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.verificationCode && nextProps.verificationCode !== this.props.verificationCode) {
      if (this.intervalID) {
        clearInterval(this.intervalID);
        this.setState({
          countdown: 60,
        });
      }
      this.intervalID = setInterval(this.intervalCB, 1000);
      this.openToast();
      setTimeout(() => this.closeToast(), 2000);
    }
    if (nextProps.enterpriseOrder.phone) {
      this.setState({
        phone: nextProps.enterpriseOrder.phone,
        validPhone: true,
      });
    }
    if (Object.keys(nextProps.err).length && nextProps.err !== this.props.err) {
      this.openErrToast();
      setTimeout(() => this.closeToast(), 2000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  getVerificationCode() {
    const { actions, fetchParams } = this.props;
    const { phone } = this.state;
    const data = {
      orderId: fetchParams.orderId,
      phone,
    };
    actions.submitPaymentVerificationCode(data);
  }

  intervalCB() {
    if (this.state.countdown === 0) {
      clearInterval(this.intervalID);
      this.setState({
        countdown: 60,
      });
      const { actions } = this.props;
      actions.resetPaymentVerificationCode();
      return;
    }
    this.setState({
      countdown: this.state.countdown - 1,
    });
  }

  handlePhoneChange(event) {
    const newState = {
      phone: event.target.value.trim(),
    };
    if ((/^1[34578]\d{9}$/.test(newState.phone))) {
      newState.validPhone = true;
    } else {
      newState.validPhone = false;
    }
    this.setState(newState);
  }

  handleCodeChange(event) {
    this.setState({
      code: event.target.value.trim(),
    });
  }

  openToast() {
    this.setState({
      isToastOpen: true,
    });
  }

  openErrToast() {
    this.setState({
      isErrToastOpen: true,
    });
  }

  closeToast() {
    this.setState({
      isToastOpen: false,
      isErrToastOpen: false,
    });
  }

  ePay() {
    const { actions, fetchParams } = this.props;
    const data = {
      orderId: fetchParams.orderId,
      phone: this.state.phone,
      code: this.state.code,
    };
    actions.submitPaymentEnterprisePay(data);
  }

  render() {
    const { enterpriseOrder, err } = this.props;
    const { isToastOpen, phone, code, countdown, validPhone, isErrToastOpen } = this.state;
    const endTime = moment(enterpriseOrder.order_expire_date).format('X');
    const nowTime = moment().format('X');
    const totalTime = Math.floor((endTime - nowTime) / 60);
    const lastHour = Math.floor(totalTime / 60);
    const lastMinute = totalTime % 60;
    return (
      <div className="payment">
        {(() => {
          if (Object.keys(enterpriseOrder).length) {
            return (
              <div>
                <div className="order-detail">
                  <div className="order-background">
                    <i className="icon-orderCard" />
                    <div className="enterpris-info" >
                      <div className="enterpris-name">{enterpriseOrder.tenant_name}</div>
                      <div className="enterpris-blance"><FormattedMessage {...messages.balance} />: ￥{enterpriseOrder.balance}</div>
                    </div>
                  </div>
                  <div className="order-info-item">
                    <div className="order-id"><FormattedMessage {...messages.coursesQuantity} />: <span className="order-item-number">{enterpriseOrder.order_item_number}<FormattedMessage {...messages.course} /></span></div>
                    <div className="order-time"><i className="order-detail-icon-time" />
                      <FormattedMessage
                        {...messages.pleasePayBefore}
                        values={{
                          H: lastHour,
                          M: lastMinute,
                        }}
                      />
                    </div>
                  </div>
                  <div className="order-info-item no-border"><FormattedMessage {...messages.allTotal} />: <span className="order-total">￥{enterpriseOrder.amount}</span></div>
                </div>
                { enterpriseOrder.balance < enterpriseOrder.amount ?
                  <div className="enterpris-insufficient"><i className="enterpris-icon-warn" /><div>当前余额不足,建议您减少部分课程数量,或充值;<br />可联系多学客服人员,协助充值联系电话：010-57071831</div></div> :
                  <div className="enterpris-phone-info">
                    <div className="enterpris-isBind">{enterpriseOrder.phone ? <FormattedMessage {...messages.hasBound} /> : <FormattedMessage {...messages.notBound} />}</div>
                    {enterpriseOrder.phone ? <div className="enterpris-phone-label"><FormattedMessage {...messages.getVerifiCodeTo} /><span className="enterpris-phone">{(`${enterpriseOrder.phone}`).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span></div> :
                    <div className="from-item">
                      <label className="phone-label" htmlFor="phone" />
                      <input className="phone-input" placeholder={this.context.intl.messages['app.payment.enterMobilePhoneNumber']} id="phone" type="number" value={phone} onChange={this.handlePhoneChange} />
                    </div>}
                    <div className="from-item no-border">
                      <label className="code-label" htmlFor="code" />
                      <input className="code-input" placeholder={this.context.intl.messages['app.payment.enterVerifiCode']} id="code" type="number" value={code} onChange={this.handleCodeChange} />
                      <span className="border" />
                      {countdown === 60 && validPhone ? <span className="code-span" onClick={this.getVerificationCode}><FormattedMessage {...messages.getVerifiCode} /></span> : <span className="code-span disabled">{countdown === 60 ? <FormattedMessage {...messages.getVerifiCode} /> : `${countdown}秒`}</span>}
                    </div>
                  </div>
                }
                <div className="enterpris-footer">
                  <RelativeLink className="cancel" to="../"><FormattedMessage {...messages.cancel} /></RelativeLink>
                  {phone && code ? <RelativeLink className="ok" to={{ pathname: '../result', query: { payType: 'enterprise' } }} onClick={this.ePay}>{enterpriseOrder.phone ? <FormattedMessage {...messages.confirm} /> : <FormattedMessage {...messages.boundAndPay} />}</RelativeLink> : <span className="ok disabled">{enterpriseOrder.phone ? <FormattedMessage {...messages.confirm} /> : <FormattedMessage {...messages.boundAndPay} />}</span>}
                </div>
              </div>
            );
          }

          return null;
        })()}
        <Toast
          className="toast-codeSuccess"
          isOpen={isToastOpen}
          timeout={2000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={this.closeToast}
        >
          <div className="toast-code"><i className="icon-codeSuccess" /><div><FormattedMessage {...messages.verificationCodeSent} /></div></div>
        </Toast>
        <Toast
          isOpen={isErrToastOpen}
          timeout={2000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={this.closeToast}
        >
          <span>{err.message}</span>
        </Toast>
      </div>
    );
  }
}

Enterprise.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    enterpriseOrder: state.payment.enterpriseOrder || {},
    err: state.payment.err || {},
    verificationCode: state.payment.verificationCode || false,
    fetchParams: {
      orderId: ownProps.params.order_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(paymentActions, dispatch),
  }
))(Enterprise);
