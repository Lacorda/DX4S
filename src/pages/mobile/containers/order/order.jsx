import './order.styl';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';
import { nav } from 'utils/dx';
import xBack from 'utils/xback';
import { withRouter } from 'react-router';
import moment from 'moment';
import { order as orderActions, account as accountActions } from '../../actions';
import messages from './messages';
import { Toast } from '../../../../components/modal';
import RefreshLoad from '../../components/refreshload';
import icon from './img/icon1.png';
import noMessage from './img/noMessage.png';

const propTypes = {
  actions: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  nav: PropTypes.string.isRequired,
  lastUpdatedUnfinish: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  datas: PropTypes.object.isRequired,
};

const contextTypes = {
  intl: React.PropTypes.object.isRequired,
};
class Order extends Component {
  constructor(props, context) {
    super(props, context);
    this.setNavBar = this.setNavBar.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeNav = this.changeNav.bind(this);
    this.courseDetail = this.courseDetail.bind(this);
    this.orderDetail = this.orderDetail.bind(this);
    this.payment = this.payment.bind(this);
    this.required = this.required.bind(this);
    this.elective = this.elective.bind(this);
    this.title = this.title.bind(this);
    this.pullUpCallBack = this.pullUpCallBack.bind(this);
    this.pullDownCallback = this.pullDownCallback.bind(this);
    this.init = false;
    this.isAdmin = false;
    this.isLive = false;
    this.electiveBtn = false;
    this.state = {
      key: 0,
      status: '',
      percent: '100%',
      isToastShow: false,
      toastContent: '',
      courseBtn: false,
    };
  }

  componentWillMount() {
    const { actions } = this.props;
    actions.fetchActiveOrderTitle({ title: 'enterprise', nav: '' });
  }
  componentDidMount() {
    const { actions, user } = this.props;
    actions.fetchActiveOrderClearUp();
    if (!user.lastUpdated) actions.fetchUser();
  }
  componentWillReceiveProps(nextProps) {
    const { actions, user, router } = nextProps;
    if (!this.init && user.lastUpdated) {
      this.isAdmin = user.is.admin;
      const fetchPromise = this.isAdmin ? (actions.fetchGetData({ title: 'enterprise', nav: '' }, true)) : (actions.fetchGetData({ title: 'personal', nav: '' }, true));
      fetchPromise.then(() => {
        this.setState({
          key: Math.random(),
          status: user.is.admin ? 'enterprise' : 'personal',
          courseBtn: user.is.admin ? false : true,
        });
      });
      const head = this.head.getBoundingClientRect();
      const wrap = this.wrap.getBoundingClientRect();
      this.area.height = this.isAdmin ? wrap.height - head.height : wrap.height - head.height - 50;
      const percent = (this.area.height / wrap.height) * 100 + '%';
      this.setState({ percent });
      xBack(() => {
        setTimeout(() => router.replace('/mall'), 0);
      });
      this.init = true;
    }
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.order.title'],
    });
  }
  courseDetail(event, type, id) {
    const { router } = this.props;
    event.stopPropagation();
    event.preventDefault();
    if (type === 'live') {
      router.push(router.createPath(`/products/live/${id}`));
    } else if (type === 'series') {
      router.push(router.createPath('/products/series/' + id));
    } else {
      router.push(router.createPath('/products/course/' + id));
    }
  }
  orderDetail(event, id) {
    const { router } = this.props;
    event.stopPropagation();
    event.preventDefault();
    router.push(router.createPath('/order/detail/' + id));
  }
  payment(event, id) {
    const { router } = this.props;
    event.stopPropagation();
    event.preventDefault();
    router.push(router.createPath('/payment/' + id));
  }
  required(event) {
    const { router } = this.props;
    event.stopPropagation();
    event.preventDefault();
    router.push(router.createPath('/distribution/required'));
  }
  elective(event) {
    const { router } = this.props;
    event.stopPropagation();
    event.preventDefault();
    router.push(router.createPath('/publish-electives/'));
  }
  changeTitle(clickTitle) {
    const { actions, title, datas } = this.props;
    if (clickTitle === 'enterprise' && title === 'personal') {
      actions.fetchActiveOrderTitle({ title: 'enterprise', nav: '' });
      const head = this.head.getBoundingClientRect();
      const wrap = this.wrap.getBoundingClientRect();
      this.area.height = this.isAdmin ? wrap.height - head.height : wrap.height - head.height - 50;
      const percent = (this.area.height / wrap.height) * 100 + '%';
      this.setState({
        key: Math.random(),
        status: 'enterprise',
        percent,
        courseBtn: false,
      });
      if (!datas.enterprise || !datas.enterprise.length) {
        actions.fetchGetData({ title: 'enterprise', nav: '' }, true).then(() => {
          this.setState({
            key: Math.random(),
          });
        });
      }
    } else if (clickTitle === 'personal' && title === 'enterprise') {
      actions.fetchActiveOrderTitle({ title: 'personal', nav: '' });
      const head = this.head.getBoundingClientRect();
      const wrap = this.wrap.getBoundingClientRect();
      this.area.height = wrap.height - head.height - 50;
      const percent = (this.area.height / wrap.height) * 100 + '%';
      this.setState({
        key: Math.random(),
        status: 'personal',
        percent,
        courseBtn: true,
      });
      if (!datas.personal || !datas.personal.length) {
        actions.fetchGetData({ title: 'personal', nav: '' }, true).then(() => {
          this.setState({
            key: Math.random(),
          });
        });
      }
    }
  }
  changeNav(clickNav) {
    const { actions, nav, title, datas,
    } = this.props;

    if (clickNav !== nav) {
      actions.fetchActiveOrderTitle({ title, nav: clickNav });
      this.setState({
        key: Math.random(),
        status: `${title}${clickNav}`,
      });
      if (!datas[`${title}${clickNav}`] || !datas[`${title}${clickNav}`].length) {
        actions.fetchGetData({ title, nav: clickNav }, true).then(() => {
          this.setState({
            key: Math.random(),
          });
        });
      }
    }
  }
  pullUpCallBack(cb) {
    const { actions, title, nav } = this.props;
    let fetchPromise = null;
    fetchPromise = actions.fetchGetData({ title, nav });
    // promise回调
    fetchPromise.then(() => {
      if (cb) {
        cb();
      }
    });
  }
  pullDownCallback(cb) {
    const { actions, title, nav } = this.props;
    setTimeout(() => {
      actions.fetchGetData({ title, nav }, true).then(cb);
    }, 50);
  }
  outPut(data) {
    const self = this;
    const { title } = this.props;
    if (data && data.length) {
      return (
        <div className="order-box">
          {data.map((item, index) => {
            let status = '';
            let statusClass = '';
            let lastHour = '';
            let lastMinute = '';
            self.isLive = false;
            switch (item.status) {
              case 'paying':
                const endTime = moment(item.expire_time).format('X');
                const nowTime = moment(item.new).format('X');
                const totalTime = Math.floor((endTime - nowTime) / 60);
                status = <FormattedMessage {...messages.notPaid} />;
                statusClass = 'paying';
                lastHour = Math.floor(totalTime / 60);
                lastMinute = totalTime % 60;
                break;
              case 'paid':
              case 'paid_success':
              case 'paid_fail':
                status = <FormattedMessage {...messages.paid} />;
                statusClass = 'paid';
                break;
              case 'canceled':
                status = <FormattedMessage {...messages.cancelled} />;
                statusClass = 'canceled';
                break;
              default:
                break;
            }
            return (
              <div className="order" key={`${item.id}_${index}`} onClick={(event) => this.orderDetail(event, item.id)}>
                <div className="message">
                  <p>
                    <img src={icon} />
                    <span><FormattedMessage {...messages.orderNO} />：{item.id}</span>
                  </p>
                  <div className={statusClass}>{status}</div>
                </div>
                <ul>
                  {item.products.map((item1) => {
                    const way = item1.purchase_type === 'amount' ? <FormattedMessage {...messages.ModeQ} /> : item1.purchase_type === 'free' ? <FormattedMessage {...messages.ModeFree} /> : <FormattedMessage {...messages.ModeOut} />;
                    const type = item1.type === 'live' ? 'type-icon icon-bg-new' : item1.type === 'series' ? 'type-icon icon-bg-solution' : '';
                    const typeName = item1.type === 'live' ? <FormattedMessage {...messages.live} /> : item1.type === 'series' ? <FormattedMessage {...messages.series} /> : '';
                    const isNumber = item1.purchase_type === 'amount' ? true : false;
                    self.electiveBtn = false;
                    // 是否包含直播
                    if (item1.type === 'live' && self.isLive === false) {
                      self.isLive = true;
                    }
                    // 是否包含发选修按钮
                    if (item1.purchase_type === 'amount' && self.electiveBtn === false) {
                      self.electiveBtn = true;
                    }
                    return (
                      <li key={`${item1.id}`} onClick={(event) => this.courseDetail(event, item1.type, item1.id)}>
                        <div className="card-img">
                          <img alt={item1.name} src={item1.cover_url} />
                          <span className={type}>{typeName}</span>
                        </div>
                        <div className="card-text">
                          <p className="title">{item1.name}</p>
                          <p className="type">{way}</p>
                          <p className="number">
                            <span className="price">{isNumber ? <FormattedMessage {...messages.per} values={{ price: item1.unit_price }} /> : `¥ ${item1.unit_price}`}</span>
                            <span className="person">{isNumber ? `X${item1.count}` : ''}</span>
                          </p>
                        </div>
                      </li>
                  );
                  })}
                </ul>
                <p className="total"><FormattedMessage {...messages.course} values={{ num: item.products.length }} />   <FormattedMessage {...messages.sum} />：¥{item.total_price}</p>
                {item.status === 'paying' &&
                  <div className="operate">
                    <span><FormattedMessage {...messages.remainingTime} />: { lastHour }<FormattedMessage {...messages.hour} /> { lastMinute }<FormattedMessage {...messages.minute} /></span>
                    <div className="operate-btn operate-btn-red" onClick={(event) => this.payment(event, item.id)}><FormattedMessage {...messages.pay} /></div>
                  </div>
                }
                {this.isAdmin && (item.status === 'paid' || item.status === 'paid_success' || item.status === 'paid_fail')  && title !== 'personal' &&
                  <div className="operate">
                    {!(self.electiveBtn) && !(self.isLive) && <div className="operate-btn" onClick={(event) => this.elective(event)}><FormattedMessage {...messages.sendElective} /></div>}
                    <div className="operate-btn" onClick={(event) => this.required(event)}><FormattedMessage {...messages.sendRequired} /></div>
                  </div>
                }
              </div>
            );
          })}
        </div>
      );
    }
    return (
      <div className="empty">
        <img src={noMessage} />
        <p><FormattedMessage {...messages.buyCourses} /></p>
        <Link to='/mall/' style={{ display: 'block', height: '40px', lineHeight: '40px', textAlign: 'center', color: '#ccc', border: '1px solid #ccc' }}><FormattedMessage {...messages.goShopping} /></Link>
      </div>
    );
  }
  title() {
    const { title } = this.props;
    if (this.isAdmin) {
      return (
        <div className="title">
          <ul>
            <li onClick={() => this.changeTitle('enterprise')} className={title === 'enterprise' ? 'title-active' : ''} ><FormattedMessage {...messages.company} /></li>
            <li onClick={() => this.changeTitle('personal')} className={title === 'personal' ? 'title-active' : ''} ><FormattedMessage {...messages.personal} /></li>
          </ul>
        </div>
      );
    }
    // return (
    //   <div className="title">
    //     <div className="personBtn"><FormattedMessage {...messages.personal} /></div>
    //   </div>
    // );
  }
  render() {
    const {
      lastUpdatedUnfinish, nav, datas,
    } = this.props;
    const needPullUp = lastUpdatedUnfinish;
    const show = this.state.courseBtn ? 'block' : 'none';
    const navs = classNames({
      nav: true,
      emptyTop: this.isAdmin === false,
    });
    this.setNavBar();
    return (
      <div id="order" key={this.state.key} style={{ height: '100%' }} ref={(ref) => this.wrap = ref}>
        <div id="tab" ref={(ref) => this.head = ref}>
          {this.title()}
          <ul className={navs}>
            <li onClick={() => this.changeNav('')} className={!nav ? 'nav-active' : ''} ><FormattedMessage {...messages.all} /></li>
            <li onClick={() => this.changeNav('Paying')} className={nav === 'Paying' ? 'nav-active' : ''} ><FormattedMessage {...messages.notPaid} /></li>
            <li onClick={() => this.changeNav('Paid')} className={nav === 'Paid' ? 'nav-active' : ''} ><FormattedMessage {...messages.paid} /></li>
            <li onClick={() => this.changeNav('Canceled')} className={nav === 'Canceled' ? 'nav-active' : ''} ><FormattedMessage {...messages.cancelled} /></li>
            <div className="nav-border nav-border1" ></div>
            <div className="nav-border nav-border2" ></div>
            <div className="nav-border nav-border3" ></div>
          </ul>
        </div>
        <div ref={(ref) => this.area = ref} style={{ height: this.state.percent }}>
          <RefreshLoad
            needPullUp={needPullUp}
            pullDownCallBack={this.pullDownCallback}
            pullUpCallBack={this.pullUpCallBack}
            relative
            key={this.state.key}
          >
            { this.state.status === 'enterprise' && this.outPut(datas.enterprise)}
            { this.state.status === 'enterprisePaid' && this.outPut(datas.enterprisePaid)}
            { this.state.status === 'enterpriseCanceled' && this.outPut(datas.enterpriseCanceled)}
            { this.state.status === 'enterprisePaying' && this.outPut(datas.enterprisePaying)}
            { this.state.status === 'personal' && this.outPut(datas.personal)}
            { this.state.status === 'personalPaid' && this.outPut(datas.personalPaid)}
            { this.state.status === 'personalPaying' && this.outPut(datas.personalPaying)}
            { this.state.status === 'personalCanceled' && this.outPut(datas.personalCanceled)}

          </RefreshLoad>
        </div>
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
        <Link to="/plans/" className="enterHref" style={{ display: show }}><div className="enter"><FormattedMessage {...messages.enterCourse} /></div></Link>
      </div>
    );
  }
}

Order.propTypes = propTypes;
Order.contextTypes = contextTypes;

export default connect(state => ({
  title: state.order.title || 'enterprise',
  nav: state.order.nav || '',
  isFetching: state.order.isFetching || false,
  lastUpdatedUnfinish: state.order.lastUpdatedUnfinish || false,
  datas: state.order.datas || {},
  user: state.account.user || {},
}), dispatch => ({
  actions: bindActionCreators(Object.assign({}, orderActions, accountActions), dispatch),
}
))(withRouter(Order));

