import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { RelativeLink } from 'react-router-relative-links';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { nav, platform } from 'utils/dx';
import moment from 'moment';
import xBack from 'utils/xback';

import { payment as paymentActions, account as accountActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const propTypes = {
  orderDetail: PropTypes.object.isRequired,
  fetchParams: PropTypes.object.isRequired,
  alipay: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  wcpay: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

class Pay extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.taggleOrderDetail = this.taggleOrderDetail.bind(this);
    this.aliPay = this.aliPay.bind(this);
    this.wcPay = this.wcPay.bind(this);
    this.onBridgeReady = this.onBridgeReady.bind(this);
    this.state = {
      showOrderDetail: false,
      code: '',
    };
  }

  componentDidMount() {
    const { router, actions, fetchParams, location, user } = this.props;
    if (!user.lastUpdated) actions.fetchUser();
    if (platform.is.wechat) {
      if (!location.query.code) {
        const { origin, pathname } = window.location;
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa0fc7636b1a19583&redirect_uri=${encodeURI(`${origin}${pathname}`)}&response_type=code&scope=snsapi_base&state=/payment/${fetchParams.orderId}#wechat_redirect`;
        return;
      }
    }
    xBack(() => {
      setTimeout(() => router.replace('/order'), 0);
    });
    actions.fetchPaymentOrder(fetchParams);
    setNav(this.context.intl.messages['app.payment.title.pay']);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.alipay && nextProps.alipay !== this.props.alipay) {
      document.write(nextProps.alipay);
    }

    if (Object.keys(nextProps.wcpay).length && nextProps.wcpay !== this.props.wcpay) {
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady.bind(null, nextProps.wcpay), false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady.bind(null, nextProps.wcpay));
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady.bind(null, nextProps.wcpay));
        }
      } else {
        this.onBridgeReady(nextProps.wcpay);
      }
    }
  }

  onBridgeReady(payParams) {
    /* global WeixinJSBridge */
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest', {
        appId: payParams.appId,
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType,
        paySign: payParams.paySign,
      },
      (res) => {
        const { fetchParams } = this.props;
        const { origin, pathname } = window.location;
        if (res.err_msg === 'get_brand_wcpay_request:ok') {
          window.location.href = `${origin}${pathname}#/payment/${fetchParams.orderId}/result?payType=wcpay&payStatus=true`;
        } else {
          window.location.href = `${origin}${pathname}#/payment/${fetchParams.orderId}/result?payType=wcpay&payStatus=false`;
        }
      }
    );
  }

  taggleOrderDetail() {
    this.setState({
      showOrderDetail: !this.state.showOrderDetail,
    });
  }

  aliPay() {
    const { actions, fetchParams } = this.props;
    const { origin, pathname, search } = window.location;
    const data = {
      orderId: fetchParams.orderId,
      returnUrl: `${origin}${pathname}${search}#/payment/${fetchParams.orderId}/result?payType=alipay`,
    };
    actions.submitPaymentAlipay(data);
  }

  wcPay() {
    const { actions, fetchParams, location: { query } } = this.props;
    const data = {
      code: query.code,
      orderId: fetchParams.orderId,
    };
    actions.submitPaymentWcpay(data);
  }

  render() {
    const { orderDetail, user } = this.props;
    const { showOrderDetail } = this.state;
    const purchase = {
      buyout: <FormattedMessage {...messages.ModeOut} />,
      amount: <FormattedMessage {...messages.ModeQ} />,
      free: <FormattedMessage {...messages.ModeFree} />,
    };
    const endTime = moment(orderDetail.expire_time).format('X');
    const nowTime = moment(orderDetail.now).format('X');
    const totalTime = Math.floor((endTime - nowTime) / 60);
    const lastHour = Math.floor(totalTime / 60);
    const lastMinute = totalTime % 60;
    return (
      <div className="payment">
        {(() => {
          if (Object.keys(orderDetail).length) {
            return (
              <div>
                <div className="order-detail">
                  <div className="order-info-item">
                    <div className="order-id"><i className="order-detail-icon-order-id" /><FormattedMessage {...messages.orderNo} />: {orderDetail.id}</div>
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
                  <div className="order-info-item"><FormattedMessage {...messages.coursesQuantity} />: <span className="order-item-number">{orderDetail.products.length}<FormattedMessage {...messages.course} /></span></div>
                  <div className="order-info-item"><FormattedMessage {...messages.allTotal} />: <span className="order-total">￥{orderDetail.total_price}</span></div>
                  {showOrderDetail ? <ul className="order-product">
                    {orderDetail.products.map(product => (
                      <li className="order-product-item" key={product.id}>
                        <div className="order-product-detail">
                          <img className="order-product-img" alt="" src={product.cover_url} />
                          <div className="order-product-info">
                            <p className="order-product-name">{product.name}</p>
                            <div className="order-product-buy-type">{purchase[product.purchase_type]}</div>
                            { product.purchase_type !== 'amount' ?
                              <div className="order-product-buy">
                                <span className="order-product-buy-price"><span className="price">￥{product.unit_price}</span></span>
                              </div> :
                              <div className="order-product-buy">
                                <span className="order-product-buy-price"><span className="price">￥{product.unit_price}</span> / <FormattedMessage {...messages.per} /></span><span className="order-product-buy-number"><span className="multiply">x</span>{product.count}</span>
                              </div>
                            }
                          </div>
                        </div>
                        <div className="order-product-price"><FormattedMessage {...messages.subtotal} />: <span className="price">￥{product.total_price}</span></div>
                      </li>
                    ))}
                  </ul> : null}
                  <div className="order-detail-isShow">
                    {showOrderDetail ? <span onClick={this.taggleOrderDetail}><FormattedMessage {...messages.packUpTheDetail} /><i className="pay-icon-up" /></span> : <span onClick={this.taggleOrderDetail}><FormattedMessage {...messages.viewDetail} /><i className="pay-icon-down" /></span>}
                  </div>
                </div>
                <ul className="pay-type">
                  {!platform.is.wechat ? <li className="pay-item" onClick={this.aliPay}><i className="pay-icon-alipay" /><FormattedMessage {...messages.alipay} /><i className="pay-icon-left" /></li> : null}
                  {platform.is.wechat ? <li className="pay-item" onClick={this.wcPay}><i className="pay-icon-wcpay" /><FormattedMessage {...messages.wechatPay} /><i className="pay-icon-left" /></li> : null}
                  {user.is.admin && orderDetail.belong !== 'personal' ? <RelativeLink to={{ pathname: './enterprise' }} className="pay-item"><li><i className="pay-icon-epay" /><FormattedMessage {...messages.companyAccount} /><i className="pay-icon-left" /></li></RelativeLink> : null}
                </ul>
              </div>
            );
          }

          return null;
        })()}
      </div>
    );
  }
}

Pay.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    orderDetail: state.payment.orderDetail || {},
    alipay: state.payment.alipay || '',
    wcpay: state.payment.wcpay || {},
    user: state.account.user || {},
    isFetching: state.payment.isFetching,
    fetchParams: {
      orderId: ownProps.params.order_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(Object.assign({}, paymentActions, accountActions), dispatch),
  }
))(withRouter(Pay));
