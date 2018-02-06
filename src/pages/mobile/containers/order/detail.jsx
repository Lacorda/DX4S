import './detail.styl';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import api from 'utils/api';
import { Link } from 'react-router';
import { nav } from 'utils/dx';
import { order as orderActions, account as accountActions } from '../../actions';
import { Toast, Confirm } from '../../../../components/modal';
import { withRouter } from 'react-router';
import messages from './messages';
import icon1 from './img/icon1.png';
import icon2 from './img/icon2.png';
import icon3 from './img/icon3.png';
import icon4 from './img/icon4.png';
import icon5 from './img/icon5.png';

const propTypes = {
  actions: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchParams: PropTypes.object.isRequired,
  detail: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

const contextTypes = {
  intl: React.PropTypes.object.isRequired,
};
class OrderDetail extends Component {
  constructor(props, context) {
    super(props, context);
    this.setNavBar = this.setNavBar.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.detailClick = this.detailClick.bind(this);
    this.openConfirm = this.openConfirm.bind(this);
    this.isLive = false;
    this.init = false;
    this.electiveBtn = false;
    this.state = {
      isToastShow: false,
      toastContent: '',
      isConfirmOpen: false,
    };
  }

  componentWillMount() {
    const { fetchParams, actions } = this.props;
    if (fetchParams.order_id) {
      actions.fetchOrderDetailActive(fetchParams.order_id);
    }
  }
  componentDidMount() {
    const { actions, user } = this.props;
    if (!user.lastUpdated) actions.fetchUser();
  }
  componentWillReceiveProps(nextProps) {
    const { user } = nextProps;
    if (!this.init && user.lastUpdated) {
      this.isAdmin = user.is.admin;
      this.init = true;
    }
  }
  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.order.orderDetail'],
    });
  }
  detailClick(type, id) {
    const { router } = this.props;
    if (type === 'live') {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: <FormattedMessage {...messages.functionOpen} />,
      }));
    } else if (type === 'series') {
      router.push(router.createPath('products/series/' + id));
    } else {
      router.push(router.createPath('products/course/' + id));
    }
  }
  cancelOrder(id) {
    const { router } = this.props;
    api({
      method: 'GET',
      url: '/mall/orders/cancel',
      params: { id },
      headers: {
        tenantId: 1,
        os: 'h5',
      },
    })
    .then((res) => {
      // 返回id，跳转支付页面
      router.push(router.createPath('order'));
    })
    .catch((err) => {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: err.response.data.message,
      }));
    });
  }
  openConfirm(id) {
    this.setState(Object.assign({}, this.state, {
      isConfirmOpen: true,
      orderId: id,
    }));
  }

  getCancelReason = ({ cancel_reason: reason }) => {
    if (reason === 'expired') return <FormattedMessage {...messages.cancelledTime} />;
    else if (reason === 'live_expired') {
      return <FormattedMessage {...messages.cancelledLiveExpired} />;
    }
    return <FormattedMessage {...messages.cancelledPerson} />;
  };

  outPut(data) {
    const { isFetching, title } = this.props;
    let lastHour;
    let lastMinute;
    const self = this;
    self.isLive = false;
    if (data && isFetching === false && data.products) {
      if (data.status === 'paying') {
        const endTime = moment(data.expire_time).format('X');
        const nowTime = moment(data.new).format('X');
        const totalTime = Math.floor((endTime - nowTime) / 60);
        lastHour = Math.floor(totalTime / 60);
        lastMinute = totalTime % 60;
      }
      return (
        <div id="box">
          <div id="detail" >
            <div className="message">
              <p>
                <img src={icon1} />
                <span><FormattedMessage {...messages.orderNO} />：{data.id}</span>
              </p>
              {data.status === 'paying' && <div className="paying"><FormattedMessage {...messages.notPaid} /></div> }
              {(data.status === 'paid' || data.status === 'paid_success' || data.status === 'paid_fail') && <div className="paid"><FormattedMessage {...messages.paid} /></div>}
              {data.status === 'canceled' &&
                <div className="reason">
                  <span className="status"><FormattedMessage {...messages.cancelled} /></span>
                  <span className="reasons"><FormattedMessage {...messages.cancelledReason} />：{this.getCancelReason(data)}</span>
                </div>
              }
            </div>
            {(data.status === 'paid' || data.status === 'paid_success' || data.status === 'paid_fail') && data.pay_way === 'alipay' &&
              <div className="message">
                <p><FormattedMessage {...messages.payway} /></p>
                <div className="way">
                  <img src={icon4} />
                  <span><FormattedMessage {...messages.payalipay} /></span>
                </div>
              </div>
            }
            {(data.status === 'paid' || data.status === 'paid_success' || data.status === 'paid_fail') && data.pay_way === 'enterprise' &&
              <div className="message">
                <p><FormattedMessage {...messages.payway} /></p>
                <div className="way">
                  <img src={icon2} />
                  <span><FormattedMessage {...messages.payenterprise} /></span>
                </div>
              </div>
            }
            {(data.status === 'paid' || data.status === 'paid_success' || data.status === 'paid_fail') && data.pay_way === 'wechat' &&
              <div className="message">
                <p><FormattedMessage {...messages.payway} /></p>
                <div className="way">
                  <img src={icon3} />
                  <span><FormattedMessage {...messages.paywechat} /></span>
                </div>
              </div>
            }
            {(data.status === 'paid' || data.status === 'paid_success' || data.status === 'paid_fail') && data.pay_way === 'free' &&
              <div className="message">
                <p><FormattedMessage {...messages.payway} /></p>
                <div className="way">
                  <img src={icon5} />
                  <span><FormattedMessage {...messages.payfree} /></span>
                </div>
              </div>
            }
            <div className="content">
              <p className="base">
                {data.status !== "paying" && <span>{moment(data.create_time).format('YYYY-MM-DD HH:mm')}</span>}
                <span style={{ float: 'right' }}><FormattedMessage {...messages.method} /> : {data.source === 'phone' ? <FormattedMessage {...messages.mobile} /> : 'PC '}</span>
              </p>
              <ul>
                {data.products.map((item) => {
                  const way = item.purchase_type === 'amount' ? <FormattedMessage {...messages.ModeQ} /> : item.purchase_type === 'free' ? <FormattedMessage {...messages.ModeFree} /> : <FormattedMessage {...messages.ModeOut} />;
                  const type = item.type === 'live' ? 'type-icon icon-bg-new' : item.type === 'series' ? 'type-icon icon-bg-solution' : '';
                  const typeName = item.type === 'live' ? <FormattedMessage {...messages.live} /> : item.type === 'series' ? <FormattedMessage {...messages.series} /> : '';
                  const isNumber = item.purchase_type === 'amount' ? true : false;
                  self.electiveBtn = false;
                  // 是否包含直播
                  if (item.type === 'live' && self.isLive === false) {
                    self.isLive = true;
                  }
                  // 是否包含发选修按钮
                  if (item.purchase_type === 'amount' && self.electiveBtn === false) {
                    self.electiveBtn = true;
                  }
                  return (
                    <li key={`${item.id}`} onClick={() => this.detailClick(item.type, item.id)}>
                      <div className="card-img">
                        <img alt={item.name} src={item.cover_url} />
                        <span className={type}>{typeName}</span>
                      </div>
                      <div className="card-text">
                        <p className="title">{item.name}</p>
                        <p className="type">{way}</p>
                        <p className="number">
                          <span className="price">{isNumber ? <FormattedMessage {...messages.per} values={{ price: item.unit_price }} /> : `¥ ${item.unit_price}`}</span>
                          <span className="person">{isNumber ? `X${item.count}` : ''}</span>
                        </p>
                      </div>
                      <div className="card-total"><FormattedMessage {...messages.subtotal} />：¥{item.total_price}</div>
                    </li>
                    );
                }
                )}
              </ul>
              <p className="total"><FormattedMessage {...messages.course} values={{ num: data.products.length }} /> <FormattedMessage {...messages.sum} />：¥ {data.total_price}</p>
            </div>
          </div>
          {data.status === 'paying' &&
            <div id="footer">
              <p><FormattedMessage {...messages.remainingTime} />：<i> {lastHour} </i><FormattedMessage {...messages.hour} /><i> {lastMinute} </i><FormattedMessage {...messages.minute} /></p>
              <div className="btn2"><Link to={'/payment/' + data.id}><FormattedMessage {...messages.pay} /></Link></div>
              <div className="btn1" onClick={() => this.openConfirm(data.id)}><FormattedMessage {...messages.cancel} /></div>
            </div>
          }
          {this.isAdmin && (data.status === 'paid' || data.status === 'paid_success' || data.status === 'paid_fail')  && title !== 'personal' &&
            <div id="footer">
              {!(self.electiveBtn) && !(self.isLive) && <div className="btn1"><Link to="/publish-electives/"><FormattedMessage {...messages.sendElective} /></Link></div>}
              <div className="btn1"><Link to="/distribution/required"><FormattedMessage {...messages.sendRequired} /></Link></div>
            </div>
          }
        </div>
      );
    }
  }
  render() {
    const { detail, isFetching } = this.props;
    this.setNavBar();
    return (
      <div>
        { isFetching === false && this.outPut(detail)}
        <Toast
          style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
          isOpen={this.state.isToastShow}
          timeout={3000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            this.setState({ isToastShow: false });
          }}
        >
          <div>{this.state.toastContent}</div>
        </Toast>
        <Confirm
          isOpen={this.state.isConfirmOpen}
          onConfirm={() => this.cancelOrder(this.state.orderId)}
          confirmButton={<span><FormattedMessage {...messages.orderSubmit} /></span>}
          cancelButton={<span><FormattedMessage {...messages.orderCancel} /></span>}
        >
          <span><FormattedMessage {...messages.orderMessage} /></span>
        </Confirm>
      </div>
    );
  }
}

OrderDetail.propTypes = propTypes;
OrderDetail.contextTypes = contextTypes;

export default connect((state, ownProps) => (
  {
    fetchParams: {
      order_id: ownProps.params.order_id,
    },
    detail: state.order.detail || {},
    isFetching: state.order.isFetching || false,
    title: state.order.title || 'enterprise',
    user: state.account.user || {},
  }
), dispatch => ({
  actions: bindActionCreators(Object.assign({}, orderActions, accountActions), dispatch),
}
))(withRouter(OrderDetail));

