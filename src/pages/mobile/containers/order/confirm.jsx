import './confirm.styl';
import React, { Component, PropTypes } from 'react';
import api from 'utils/api';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { nav } from 'utils/dx';
import { Toast } from '../../../../components/modal';
import { order as orderActions } from '../../actions';
import messages from './messages';

const propTypes = {
  actions: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  confirm: PropTypes.array.isRequired,
  shopping_cart: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

const contextTypes = {
  intl: React.PropTypes.object.isRequired,
};
class OrderConfirm extends Component {
  constructor(props, context) {
    super(props, context);
    this.setNavBar = this.setNavBar.bind(this);
    this.sumbit = this.sumbit.bind(this);
    this.number = 0;
    this.price = 0;
    this.data = {};
    this.products = [];
    this.state = {
      isToastShow: false,
      toastContent: '',
    };
    this.free = true;
  }

  componentWillMount() {
    const { actions, shopping_cart } = this.props;
    actions.fetchOrderConfirmActive(shopping_cart);
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.order.orderComfirm'],
    });
  }
  outPut(list) {
    const { isFetching } = this.props;
    const self = this;
    if (list.length > 0 && isFetching === false) {
      this.products = [];
      this.number = list.length || 0;
      this.price = 0;
      return (
        <ul id="confirmUl">
          {list.map((item, index) => {
            const way = item.purchase_type === 'amount' ? <FormattedMessage {...messages.ModeQ} /> : item.purchase_type === 'free' ? <FormattedMessage {...messages.ModeFree} /> : <FormattedMessage {...messages.ModeOut} />;
            const type = item.product_type === 'live' ? 'type-icon icon-bg-new' : item.product_type === 'series' ? 'type-icon icon-bg-solution' : '';
            const typeName = item.product_type === 'live' ? <FormattedMessage {...messages.live} /> : item.product_type === 'series' ? <FormattedMessage {...messages.series} /> : '';
            const isNumber = item.purchase_type === 'amount' ? true : false;
            const product = {
              qty: item.count,
              product_id: item.product_id,
              shopping_cart_item_id: item.id,
              purchase_type: item.purchase_type,
            };
            if (item.purchase_type !== 'free' && self.free === true) {
              self.free = false;
            }
            this.price += item.total_price;
            this.products.push(product);
            return (
              <li key={`${item.id}_${index}`}>
                <div className="messages">
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
                </div>
                <div className="total"><FormattedMessage {...messages.subtotal} />：<span>¥ {item.total_price}</span> </div>
              </li>
            );
          })}
        </ul>
      );
    }
  }
  sumbit() {
    const { shopping_cart, router } = this.props;
    const self = this;
    this.data = {
      source: shopping_cart.source,
      belong: shopping_cart.belong === 'private' ? 'personal' : 'enterprise',
      from: shopping_cart.from,
      products: this.products,
    };
    api({
      method: 'POST',
      url: '/mall/orders/submit',
      data: this.data,
      headers: {
        tenantId: 1,
        os: 'h5',
      },
    })
    .then((res) => {
      // 返回id，跳转支付页面
      if (!res.data.need_paid) {
        router.push(router.createPath(`/payment/${res.data.id}/result?payType=free`));
        return;
      }
      router.push(router.createPath(`/payment/${res.data.id}`));
    })
    .catch((err) => {
      this.setState(Object.assign({}, this.state, {
        isToastShow: true,
        toastContent: err.response.data.message,
      }));
    });
  }

  render() {
    const { confirm, isFetching } = this.props;
    this.setNavBar();
    return (
      <div id="base">
        <div id="confirm">
        { isFetching === false && this.outPut(confirm)}
        </div>
        <div id="footer">
          <p><FormattedMessage {...messages.course} values={{ num: <i>{this.number}</i> }} /> <FormattedMessage {...messages.sum} />：<i>¥ {(this.price).toFixed(2)}</i></p>
          <div className="submitBtn" onClick={() => this.sumbit(this.data)}><FormattedMessage {...messages.orderSubmitBtn} /></div>
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
      </div>
    );
  }
}

OrderConfirm.propTypes = propTypes;
OrderConfirm.contextTypes = contextTypes;

export default connect(state => ({
  shopping_cart: state.shoppingCart.orderRequest || {},
  confirm: state.order.confirm || [],
  isFetching: state.order.isFetching || false,
}), dispatch => ({
  actions: bindActionCreators(orderActions, dispatch),
}
))(withRouter(OrderConfirm));

