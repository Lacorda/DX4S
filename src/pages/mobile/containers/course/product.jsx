/**
 * 多学课堂-商品详情
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';
import Toast from 'components/modal/toast';
import { products as productActions, shoppingCart as shoppingCartActions, account as accountActions } from '../../actions';
import ProductPop from './product-pop';
import ProductCourse from './product-course';
import ProductSeries from './product-series';
import './product.styl';

class Product extends Component {
  static propTypes() {
    return {
      fetchParams: PropTypes.object.isRequired,
      actions: PropTypes.object.isRequired,
      productInfo: PropTypes.object.isRequired,
      cartCount: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      userInfo: PropTypes.object.isRequired,
    };
  }

  constructor(props, context) {
    super(props, context);

    this.buyAction = ::this.buyAction;
    this.closePop = ::this.closePop;
    this.goToShoppingCart = ::this.goToShoppingCart;
    this.onBuy = ::this.onBuy;
    this.goQuickStudy = ::this.goQuickStudy;
    this.state = {
      showPop: false,
      popAction: '',
      isToastShow: false,
      toastMsgKey:  'app.product.addCartSuccess',
    };
  }

  componentDidMount() {
    const { fetchParams, actions, userInfo, location } = this.props;
    const query = location.query;
    actions.fetchProduct(fetchParams, query.type || null);

    if (userInfo.lastUpdated) {
      this.initProduct();
      return;
    }
    actions.fetchUser().then(() => {
      this.initProduct();
    });
  }

  componentWillReceiveProps(nextProps) {
    const { fetchParams, actions, userInfo } = this.props;
    if (fetchParams.productId !== nextProps.params.product_id) {
      const query = nextProps.location.query;
      actions.fetchProduct({
        productId: nextProps.params.product_id,
      }, query.type || null);

      const isAdmin = userInfo.is.admin;
      actions.fetchShoppingCartCount(isAdmin ? 'all' : 'private');
    }
  }

  componentWillUnmount() {
    this.props.actions.initProduct();
  }

  // 加入购物车 或 立即购买
  onBuy(buyInfo) {
    const { productInfo, actions, userInfo } = this.props;
    const router = this.context.router;
    const isAdmin = userInfo.is.admin;
    const orderView = {
      belong: buyInfo.buyMode,
      from: 'buy_now',
      source: 'phone',
      products: [{
        count: buyInfo.qty,
        product_id: productInfo.id,
        purchase_type: buyInfo.purchaseType,
      }],
    };

    switch (this.state.popAction) {
      case 'TO_CART':
        {
          const shopCart = actions.addShoppingCart({
            id: productInfo.id,
            qty: buyInfo.qty,
            type: buyInfo.buyMode,
            purchase_type: productInfo.price.is_free ? 'free' : buyInfo.purchaseType,
          });
          shopCart.then(() => {
            actions.fetchShoppingCartCount(isAdmin ? 'all' : 'private');
            this.setState({
              isToastShow: true,
              toastMsgKey: 'app.product.addCartSuccess',
            });
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
  }

  initProduct() {
    const { userInfo, actions } = this.props;
    const isAdmin = userInfo.is.admin;
    actions.fetchShoppingCartCount(isAdmin ? 'all' : 'private');
  }

  goToShoppingCart() {
    const router = this.context.router;
    router.push(router.createPath('/shopping-cart'));
  }

  buyAction(action) {
    const { productInfo, userInfo } = this.props;

    if (!productInfo.is_onshelvers) {
      return;
    }

    const isAdmin = userInfo.is.admin;
    if (!isAdmin) {
      this.setState({ popAction: action }, () => {
        this.onBuy({
          buyMode: 'private',
          purchaseType: productInfo.price.is_free ? 'free' : 'amount',
          qty: 1,
        });
      });
      return;
    }

    this.setState({ showPop: !this.state.showPop, popAction: action });
  }

  closePop() {
    this.setState({ showPop: false, popAction: '' });
  }

  goQuickStudy() {
    const { productInfo } = this.props;
    if (!productInfo.has_bought) {
      return;
    }

    const router = this.context.router;
    if (productInfo.product_type === 'course') {
      router.push(router.createPath(`plan/-1/series/0/courses/${productInfo.course_id}`));
      return;
    }

    router.push(router.createPath(`plan/-1/series/${productInfo.course_id}`));
  }

  renderQuickStudy() {
    // 个人已购买，快速学习
    const { productInfo } = this.props;
    if (!productInfo.has_bought) {
      return null;
    }

    return (
      <div className="go-study" onClick={this.goQuickStudy}>
        {this.context.intl.messages['app.product.quickStudy']}
      </div>
    );
  }

  renderFooter(cartNum) {
    const { productInfo, location } = this.props;
    if (location.query && location.query.type === 'view') {
      return null;
    }
    return (
      <div className="product-footer">
        <a className="cart" onClick={this.goToShoppingCart}>
          <p>
            <FormattedMessage id="app.product.cart" />
            {
              (() => {
                if (cartNum === 0) {
                  return null;
                }
                return <span className="cart-count">{cartNum}</span>;
              })()
            }
          </p>
        </a>
        <a className={`add ${productInfo.is_onshelvers ? '' : 'opacity64'}`} onClick={() => { this.buyAction('TO_CART'); }}>
          <FormattedMessage id="app.product.add2Cart" />
        </a>
        <a className={`shopping ${productInfo.is_onshelvers ? '' : 'opacity64'}`} onClick={() => { this.buyAction('BUY_NOW'); }}>
          <FormattedMessage id="app.product.shop" />
        </a>
      </div>
    );
  }

  render() {
    const self = this;
    const { productInfo, cartCount, fetchParams, location } = this.props;
    if (!cartCount.EnterpriseCount) { cartCount.EnterpriseCount = 0; }
    if (!cartCount.PersonalCount) { cartCount.PersonalCount = 0; }
    if (!productInfo.tags) { productInfo.tags = []; }
    if (!productInfo.price) { productInfo.price = {}; }
    if (!productInfo.chapters) { productInfo.chapters = []; }

    const navTitle = productInfo.product_type === 'course' ? 'app.productType.courseTitle' : 'app.productType.seriesTitle';
    nav.setTitle({ title: this.context.intl.messages[navTitle] });

    const query = location.query || {};
    const cartNum = cartCount.EnterpriseCount + cartCount.PersonalCount;
    const productTypeKeys = {
      course: 'app.product.course',
      series: 'app.product.series',
      live: 'app.product.live',
    };
    const displayPrice = function getDisplayPrice() {
      // to fixed issue DX-8643
      if (productInfo.price.group_purchase === null) {
        return productInfo.price.unit_price || '';
      }

      if (!productInfo.price.group_purchase.length) {
        return productInfo.price.unit_price || '';
      }

      return productInfo.price.group_purchase[0].price;
    };
    return (
      <div className="product">
        <div className="banner">
          {<img src={productInfo.cover_url} alt={productInfo.name} />}
        </div>
        <div className="detail">
          <div className="title">
            {productInfo.name}
          </div>
          <div className="title-sub">
            <div>
              {/* 课程类型 */}
              <span className="mr20"><FormattedMessage id="app.product.type" />:</span>
              <span className="mr20"><FormattedMessage id={productTypeKeys[productInfo.product_type] || 'app.product.course'} /></span>
            </div>
            <div>
              {/* 讲师 */}
              <span className="mr20"><FormattedMessage id="app.product.lecturer" />:</span>
              <span>{productInfo.lecturer_name}</span>
            </div>
          </div>
          {
            (() => {
              if (productInfo.is_onshelvers) {
                return (
                  <div className="buy">
                    <div className="price">
                      {
                        (() => {
                          if (!productInfo.price.is_free) {
                            return (<span>￥ {displayPrice()}</span>);
                          }
                          return (<FormattedMessage id="app.product.free" />);
                        })()
                      }
                    </div>
                    <div className="count">
                      <span className="mr20"><FormattedMessage id="app.product.bought" />:</span>
                      <span>
                        {productInfo.sales}
                      </span>
                    </div>
                  </div>
                );
              }
              return (
                <div className="buy">
                  <span className="mr20 not-onshelvers"><FormattedMessage id="app.product.notOnshelvers" /></span>
                </div>
              );
            })()
          }
          <div className="keyword">
            {
              productInfo.tags.map(tag => (
                <span className="tag" key={tag.id}>{tag.name}</span>
              ))
            }
          </div>
          <div className="desc">
            {productInfo.info}
          </div>
        </div>
        {
          (() => {
            if (productInfo.product_type === 'course') {
              return (
                <ProductCourse query={query} fetchParams={fetchParams} />
              );
            }
            return <ProductSeries query={query} />;
          })()
        }
        {this.renderQuickStudy()}
        {this.renderFooter(cartNum)}
        {
          /* 弹出选择层 */
          (() => {
            if (!this.state.showPop) {
              return null;
            }
            return (
              <ProductPop
                closePop={this.closePop}
                popAction={this.state.popAction}
                onBuy={this.onBuy}
              />
            );
          })()
        }

        <Toast
          style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
          isOpen={this.state.isToastShow}
          timeout={2000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            self.setState({ isToastShow: false });
          }}
        >
          <div><FormattedMessage id={this.state.toastMsgKey} /></div>
        </Toast>
      </div>
    );
  }
}

Product.contextTypes = {
  router: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  fetchParams: {
    productId: ownProps.params.product_id,
  },
  productInfo: state.products.detail,
  cartCount: state.shoppingCart.cartCount || {},
  userInfo: state.account.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({},
    productActions,
    shoppingCartActions,
    accountActions),
  dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
