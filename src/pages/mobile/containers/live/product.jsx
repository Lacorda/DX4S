import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { routerShape } from 'react-router';
import { FormattedMessage } from 'react-intl';
import withAuth from 'hocs/withAuth';
import * as cartActions from 'dxActions/shopping-cart';
import Toast from 'components/modal/toast';
import { setTitle } from 'utils/dx/nav';
import moment from 'moment';

import './style.styl';
import messages from './messages';

import { transformToBasicLive } from './helper';
import { getLive } from '../../apis.js';
import ProductPop from '../course/basic-product-pop';
import Loading from '../../components/loading';
import BasicLiveContainer from './BasicContainer';
import Cart from '../../components/cart';

class LiveProduct extends Component {
  constructor() {
    super();
    this.state = {
      basicLive: null,
      live: null,
      showComboMenu: false,
      comboMenuActionType: 'BUY_NOW',
      isToastShow: false,
      toastMessageId: 'app.product.addCartSuccess',
    };
  }

  async componentDidMount() {
    setTitle({ title: this.context.intl.messages['app.live.title.detail'] });
    const liveId = this.props.params.product_id;
    const live = await getLive(liveId);
    const basicLive = transformToBasicLive(live);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ live, basicLive });
  }

  closeComboMenu = () => { this.setState({ showComboMenu: false }); };
  openComboMenu = (comboMenuActionType) => {
    this.setState({
      showComboMenu: true,
      comboMenuActionType,
    });
  };

  isFreeLive = () => this.state.live.price.is_free;
  hasBought = () => this.state.live.has_bought;

  confirmOrder = (order) => {
    const { actions } = this.props;
    const router = this.context.router;
    const beginTime = this.state.live.begin_time;
    const isLate = moment().isAfter(beginTime);
    if (isLate) {
      this.setState({ isToastShow: true, toastMessageId: 'app.live.toast.timeout' });
      return;
    }

    const orderView = {
      belong: order.buyMode,
      from: 'buy_now',
      source: 'phone',
      products: [{
        count: order.qty,
        product_id: this.props.params.product_id,
        purchase_type: order.purchaseType,
      }],
    };

    switch (this.state.comboMenuActionType) {
      case 'TO_CART': {
        const shopCart = actions.addShoppingCart({
          id: this.props.params.product_id,
          qty: order.qty,
          type: order.buyMode,
          purchase_type: this.isFreeLive() ? 'free' : order.purchaseType,
        });
        shopCart.then(() => {
          actions.fetchShoppingCartCount();
          this.setState({ isToastShow: true, toastMessageId: 'app.product.addCartSuccess' });
        });
      }
        break;
      case 'BUY_NOW':
        actions.goSettlement(orderView);
        router.push(router.createPath('order/confirm'));
        break;
      default:
        break;
    }
  };

  renderFooter = () => {
    if (this.state.showComboMenu) return null;
    const footer = (
      <div key="footer" className="dx-footer">
        <Cart />
        <div className="button to-cart" onClick={() => this.openComboMenu('TO_CART')}>
          <FormattedMessage {...messages.addToCart} />
        </div>
        <div className="button to-order" onClick={() => this.openComboMenu('BUY_NOW')}>
          <FormattedMessage {...messages.addToOrder} />
        </div>
      </div>
    );

    const alert = (
      <div
        key="alert"
        className="alert"
        onClick={() => this.context.router.push(`/live/${this.state.live.course_id}`)}
      >
        <FormattedMessage {...messages.hasBought} />
      </div>
    );

    return this.hasBought()
      ? [alert, footer]
      : footer;
  };

  render() {
    const { live, showComboMenu, basicLive } = this.state;
    if (!live) return <Loading />;
    const liveEl = <BasicLiveContainer {...basicLive} />;
    const popup = (!showComboMenu || !live)
      ? null
      : <ProductPop
        priceInfo={live.price}
        closePop={this.closeComboMenu}
        popAction={this.state.comboMenuActionType}
        onBuy={this.confirmOrder}
      />;

    const footerEl = this.renderFooter();

    return (
      <div className="live">
        {liveEl}
        {footerEl}
        {popup}
        <Toast
          style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
          isOpen={this.state.isToastShow}
          timeout={2000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            this.setState({ isToastShow: false });
          }}
        >
          <FormattedMessage id={this.state.toastMessageId} />
        </Toast>
      </div>
    );
  }
}

const { shape, string, object } = React.PropTypes;
LiveProduct.contextTypes = {
  router: routerShape,
  intl: object,
};

LiveProduct.propTypes = {
  params: shape({ product_id: string.isRequired }),
  actions: shape({}),
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(cartActions, dispatch),
});

export default compose(
  connect(null, mapDispatchToProps),
  withAuth,
)(LiveProduct);
