import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { RelativeLink } from 'react-router-relative-links';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { nav } from 'utils/dx';
import { FormattedMessage } from 'react-intl';
import xBack from 'utils/xback';

import { payment as paymentActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const propTypes = {
  enterprisePay: PropTypes.object.isRequired,
  paymentStatus: PropTypes.bool.isRequired,
  orderItemNumber: PropTypes.number.isRequired,
  fetchParams: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

class Result extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { router, actions, fetchParams, location: { query } } = this.props;
    actions.fetchPaymentOrderItemNumber(fetchParams);
    if (query.payType === 'alipay' || query.payType === 'free') {
      actions.setPaymentStatus(true);
    }
    if (query.payType === 'wcpay') {
      if (query.payStatus === 'true') {
        actions.setPaymentStatus(true);
      } else {
        actions.setPaymentStatus(false);
      }
    }
    xBack(() => {
      setTimeout(() => router.replace('/order'), 0);
    });
  }

  componentWillReceiveProps(nextProps) {
    const title = nextProps.paymentStatus ? this.context.intl.messages['app.payment.title.result.success'] : this.context.intl.messages['app.payment.title.result.fail'];
    setNav(title);
  }

  render() {
    const {
      isFetching,
      paymentStatus,
      enterprisePay,
      orderItemNumber,
      fetchParams,
      location: { query },
    } = this.props;
    return (
      <div className="payment">
        { !isFetching ?
        (() => {
          if ((query.payType === 'enterprise') && !Object.keys(enterprisePay).length) {
            return null;
          }

          if (paymentStatus) {
            return (
              <div className="pay-success">
                <i className="icon-pay-success" />
                <div className="pay-status-msg">
                  <FormattedMessage
                    {...messages.paySuccessDes}
                    values={{
                      number: orderItemNumber,
                    }}
                  />
                </div>
                <div className="payment-result-button">
                  <RelativeLink className="payment-result-review-btn" to="/order"><FormattedMessage {...messages.checkPurchasedCourses} /></RelativeLink><RelativeLink className="payment-result-buy-btn" to="/mall"><FormattedMessage {...messages.continueShopping} /></RelativeLink>
                </div>
              </div>
            );
          }

          return (
            <div className="pay-fail">
              <i className="icon-pay-fail" />
              <div className="pay-status-msg">{enterprisePay.message ? enterprisePay.message : <FormattedMessage {...messages.paymentFailedDes} />}</div>
              <div className="payment-result-button">
                <RelativeLink className="payment-result-ok-btn" to={`/order/detail/${fetchParams.orderId}`}><FormattedMessage {...messages.ok} /></RelativeLink>
              </div>
            </div>
          );
        })() : null}
      </div>
    );
  }
}

Result.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    enterprisePay: state.payment.enterprisePay || {},
    paymentStatus: state.payment.paymentStatus || false,
    orderItemNumber: state.payment.orderItemNumber || 0,
    isFetching: state.payment.isFetching || false,
    fetchParams: {
      orderId: ownProps.params.order_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(paymentActions, dispatch),
  }
))(withRouter(Result));
