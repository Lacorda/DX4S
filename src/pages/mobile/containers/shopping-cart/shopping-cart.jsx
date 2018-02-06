/**
 * 多学课堂-购物车
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';
import { Confirm } from '../../../../components/modal';
import { shoppingCart as shoppingCartActions, account as accountActions } from '../../actions';
import './shopping-cart.styl';

class ShoppingCart extends Component {
  static propTypes() {
    return {
      actions: PropTypes.object.isRequired,
      shoppingCart: PropTypes.object.isRequired,
      userInfo: PropTypes.object.isRequired,
    };
  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      editingId: null,
      confirmMsgKey: 'app.shoppingCart.removeConfirm',
      selectedTab: 'enterprise',
      isConfirmOpen: false,
      removingProduct: {},
    };

    this.saveProduct = ::this.saveProduct;
    this.amountChange = ::this.amountChange;
    this.tabChange = ::this.tabChange;
    this.selectItem = ::this.selectItem;
    this.goCheckout = ::this.goCheckout;
    this.selectAll = ::this.selectAll;
    this.changeQty = ::this.changeQty;
    this.getTotal = ::this.getTotal;
    this.removeProduct = ::this.removeProduct;
    this.closeConfirm = ::this.closeConfirm;
    this.viewDetail = ::this.viewDetail;
  }

  componentDidMount() {
    const { actions, userInfo } = this.props;
    if (userInfo.lastUpdated) {
      this.initCart();
      return;
    }
    actions.fetchUser().then(() => {
      this.initCart();
    });
  }

  getType = {
    course: '', // this.context.intl.messages['app.shoppingCart.course'],
    series: this.context.intl.messages['app.shoppingCart.series'],
    quiz: this.context.intl.messages['app.shoppingCart.exam'],
    live: this.context.intl.messages['app.shoppingCart.live'],
    survey: this.context.intl.messages['app.shoppingCart.survey'],
  };

  /* 合计金额 */
  getTotal() {
    const { shoppingCart } = this.props;
    let total = 0;
    shoppingCart.items.forEach((item) => {
      const product = shoppingCart.cartItems[item.id];
      if (product.checked) {
        total += product.total_price;
      }
    });
    return total;
  }

  initCart() {
    nav.setTitle({ title: this.context.intl.messages['app.shoppingCart.navTitle'] });
    const { actions, userInfo } = this.props;
    const isAdmin = userInfo.is.admin;
    actions.fetchShoppingCart(isAdmin ? 'enterprise' : 'private');
    actions.fetchShoppingCartCount(isAdmin ? 'all' : 'private');
    this.setState({ ...this.state, selectedTab: isAdmin ? 'enterprise' : 'private' });
  }

  closeConfirm() {
    this.setState({ ...this.state, isConfirmOpen: false });
  }
    /* 结算*/
  goCheckout() {
    const { shoppingCart, actions } = this.props;
    const arrays = [];

    shoppingCart.items.forEach((item) => {
      const product = shoppingCart.cartItems[item.id];
      if (product.checked) {
        arrays.push({
          id: product.id,
          count: product.count,
          product_id: product.product_id,
          purchase_type: product.purchase_type,
        });
      }
    });

    if (!arrays.length) {
      return;
    }

    const request = {
      belong: this.state.selectedTab,
      from: 'shopping_cart',
      source: 'phone',
      products: arrays,
    };

    actions.goSettlement(request);
    const router = this.context.router;
    router.push(router.createPath('/order/confirm'));
  }

  /* 全选*/
  selectAll(e) {
    const { actions } = this.props;
    actions.selectCart({
      item: null,
      type: e.checked ? 'all' : 'clear',
    });
  }

  /* 修改购物车*/
  saveProduct(item) {
    this.setState({ editingId: null });
    if (item.purchase_type === 'free') {
      return;
    }
    const { actions } = this.props;

    actions.updateCart({
      type: 'enterprise',
      update_shopping_item: {
        id: item.id,
        product_id: item.product_id,
        purchase_type: item.purchase_type,
        count: item.count,
      },
    });
  }

  /* 修改数量*/
  amountChange(e, product) {
    const editItem = product;
    const { actions } = this.props;

    if (e.target.tagName.toUpperCase() === 'SELECT') {
      editItem.count = 1;
      editItem.purchase_type = e.target.value;
    } else {
      let num = e.target.value;
      if (num == 0) {
        num = 1;
      }
      if (num > 999999) {
        num = 999999;
      }
      editItem.count = num;
    }

    actions.fetchCartByQty(editItem);
  }

  /* 删除商品*/
  removeProduct() {
    const product = this.state.removingProduct;
    const { actions, userInfo } = this.props;
    const request = {
      id: product.id,
      type: this.state.selectedTab,
    };
    actions.removeCart(request).then(() => {
      const isAdmin = userInfo.is.admin;
      actions.fetchShoppingCartCount(isAdmin ? 'all' : 'private');
    });
  }

  tabChange(tabName) {
    if (tabName === this.state.selectedTab) {
      return;
    }

    const { actions } = this.props;
    this.setState({ selectedTab: tabName });
    actions.fetchShoppingCart(tabName);
  }

  selectItem(item) {
    // 下架的课程
    if (item.status !== 'onshelves') {
      this.setState({ isConfirmOpen: true, confirmMsgKey: 'app.shoppingCart.removeOffshelvesMsg', removingProduct: item });
      return;
    }

    // 直播超出时间
    if (item.product_type === 'live' && (item.live_status === 'over' || item.live_status === 'on_live')) {
      this.setState({ isConfirmOpen: true, confirmMsgKey: 'app.shoppingCart.removeOverTimeMsg', removingProduct: item });
      return;
    }

    const { actions } = this.props;
    actions.selectCart({
      id: item.id,
      type: 'single',
    });
  }

  /* 加减数量*/
  changeQty(type, item) {
    const editItem = item;
    if (item.purchase_type !== 'amount') {
      return;
    }
    if (type === 'minus' && item.count === 1) {
      return;
    }

    let count = editItem.count;
    if (type === 'minus') {
      count -= 1;
    } else {
      count += 1;
    }
    const { actions } = this.props;
    editItem.count = count;
    actions.fetchCartByQty(editItem);
  }

  /* 查看商品详情*/
  viewDetail(item) {
    if (this.state.editingId === item.id) {
      return;
    }

    if (item.status === 'offshelves' || item.status === 'auditing') {
      this.setState({ isConfirmOpen: true, confirmMsgKey: 'app.shoppingCart.removeOffshelvesMsg', removingProduct: item });
      return;
    }

    // 直播超出时间
    if (item.product_type === 'live' && (item.live_status === 'over' || item.live_status === 'on_live')) {
      this.setState({ isConfirmOpen: true, confirmMsgKey: 'app.shoppingCart.removeOverTimeMsg', removingProduct: item });
      return;
    }

    const router = this.context.router;
    router.push(router.createPath(`/products/${item.product_type}/${item.product_id}`));
  }

  options = {
    amount: this.context.intl.messages['app.shoppingCart.modeAmount'],
    buyout: this.context.intl.messages['app.shoppingCart.modeBuyout'],
  };

  renderTab() {
    const { shoppingCart, userInfo } = this.props;
    const cartCount = shoppingCart.cartCount || {};
    const isAdmin = userInfo.is.admin;
    if (!isAdmin) {
      return null;
    }

    return (
      <div className="tab">
        <ul className="buttongroup">
          <li className={`${this.state.selectedTab === 'enterprise' ? 'active' : ''}`} onClick={() => { this.tabChange('enterprise'); }}>
            <FormattedMessage id="app.shoppingCart.enterpriseTab" />({cartCount.EnterpriseCount || 0})
          </li>
          <li className={`${this.state.selectedTab === 'private' ? 'active' : ''}`} onClick={() => { this.tabChange('private'); }}>
            <FormattedMessage id="app.shoppingCart.personalTab" />({cartCount.PersonalCount || 0})
          </li>
        </ul>
      </div>
    );
  }

  renderFooter(items, selectedCount, selectable) {
    if (!items.length) {
      return null;
    }

    const fixedNum = function getFixedNum(num, digit) {
      const times = Math.pow(10, digit);
      let des = (num * times) + 0.5;
      des = parseInt(des, 10) / times;
      return des;
    };

    return (
      <div className="shopping-cart-footer">
        <div className="total">
          <div className="total-all">
            <input
              type="checkbox"
              id="checkAll"
              onChange={(e) => { this.selectAll(e.target); }}
              checked={selectedCount > 0 && selectedCount === selectable}
            />
            <label htmlFor="checkAll" className="inputlabel">{this.context.intl.messages['app.shoppingCart.selectALl']}</label>
          </div>
          <div className="total-sum">
            <div className="sum-title">{this.context.intl.messages['app.shoppingCart.sum']}</div>
            <div className="sum-price">￥ {fixedNum(this.getTotal(), 2)}</div>
          </div>
        </div>
        <a className="checkout" onClick={this.goCheckout}>
          <FormattedMessage id="app.shoppingCart.checkout" />({selectedCount})
        </a>
      </div>
    );
  }

  render() {
    const self = this;
    const { shoppingCart, userInfo } = this.props;

    const items = shoppingCart.items || [];
    const cartItems = shoppingCart.cartItems || {};
    let selectedCount = 0;
    let selectable = 0;
    if (!userInfo.is.admin) {
      nav.setTitle({ title: `${this.context.intl.messages['app.shoppingCart.navTitle']}(${items.length})` });
    }

    const purchaseType = function getPurchaseType(type) {
      switch (type) {
        case 'amount':
          return 'app.shoppingCart.modeAmount';
        case 'buyout':
          return 'app.shoppingCart.modeBuyout';
        case 'free':
          return 'app.shoppingCart.modeFree';
        default:
          return 'app.shoppingCart.modeAmount';
      }
    };

    return (
      <div className={`shopping-cart ${!items.length ? 'empty-cart' : ''}`}>
        { this.renderTab() }
        {
          (() => {
            /* 空空如也*/
            if (!items.length) {
              return (
                <div>
                  <div className="cart-empty">
                    <i className="icon-cart-empty" />
                    <div className="cart-empty-msg"><FormattedMessage id="app.shoppingCart.emptyMsg" /></div>
                  </div>
                </div>
              );
            }
            return (
              /* 列表*/
              <div className="list-box">
                <ul className="dx-list">
                  {
                    items.map((product) => {
                      const item = cartItems[product.id];
                      if (item.checked) {
                        selectedCount += 1;
                      }
                      if (item.status === 'onshelves') {
                        if (item.product_type === 'live' && item.live_status !== 'over' && item.live_status !== 'on_live') {
                          selectable += 1;
                        }
                        if (item.product_type !== 'live') {
                          selectable += 1;
                        }
                      }

                      return (
                        <li className="one-slide" key={item.id}>
                          <div className="dx-flex-box">
                            <input
                              type="checkbox"
                              className={`${(item.status === 'offshelves' || item.status === 'auditing' || (item.product_type === 'live' && (item.live_status === 'on_live' || item.live_status === 'over'))) ? 'opacity48' : ''}`}
                              onChange={() => this.selectItem(item)}
                              checked={item.checked}
                            />
                            <div className="dx-flex-img" onClick={() => { this.viewDetail(item); }}>
                              <div className={`icon ${item.product_type}`}>{this.getType[item.product_type]}</div>
                              <img src={item.cover_url} alt="" />
                              {
                                (() => {
                                  if (item.product_type === 'live') {
                                    return <p className="live-time">{item.live_begin_time}</p>;
                                  }
                                  return null;
                                })()
                              }
                            </div>
                            <div className="dx-flex-info" onClick={() => { this.viewDetail(item); }}>
                              {
                                (() => {
                                  /* 浏览商品项html*/
                                  if (this.state.editingId !== item.id) {
                                    return (
                                      <div>
                                        <div className={`dx-flex-info-title mb0 ${(item.status === 'offshelves' || item.status === 'auditing' || (item.product_type === 'live' && (item.live_status === 'on_live' || item.live_status === 'over'))) ? 'opacity48' : ''}`}>{item.name}</div>
                                        <div className="dx-flex-info-desc">
                                          {
                                            (() => {
                                              if (item.status === 'offshelves' || item.status === 'auditing') {
                                                return <span className="tag"><FormattedMessage id="app.shoppingCart.takenDown" /></span>;
                                              }
                                              if (item.product_type === 'live' && (item.live_status === 'on_live' || item.live_status === 'over')) {
                                                return <span className="tag"><FormattedMessage id="app.shoppingCart.overTime" /></span>;
                                              }
                                              return (
                                                <FormattedMessage
                                                  id={purchaseType(item.purchase_type)}
                                                />
                                              );
                                            })()
                                          }
                                        </div>
                                        <div className={`dx-flex-info-desc buy-info ${(item.status === 'offshelves' || item.status === 'auditing' || item.product_type === 'live') ? 'opacity48' : ''}`}>
                                          <div className="price">
                                            <span className="price-val">￥ {item.unit_price}</span>
                                            {
                                              /* 免费和买断不显示单位*/
                                              (() => {
                                                if (item.purchase_type === 'amount') {
                                                  return <span className="price-unit">/<FormattedMessage id="app.shoppingCart.unit" /></span>;
                                                }
                                                return null;
                                              })()
                                            }
                                          </div>
                                          {
                                            /* 免费和买断不显示数量*/
                                            (() => {
                                              if (item.purchase_type === 'amount' || this.state.selectedTab === 'private') {
                                                return (
                                                  <div className="count">
                                                    <span className="count-sign">X</span>
                                                    <span className="count-num">{item.count}</span>
                                                  </div>
                                                );
                                              }
                                              return null;
                                            })()
                                          }
                                        </div>
                                      </div>
                                    );
                                  }
                                  return (
                                    <div>
                                      <div className="price">
                                        <span className="price-val">￥ {item.unit_price}</span>
                                        {
                                          /* 免费和买断不显示单位*/
                                          (() => {
                                            if (item.purchase_type === 'amount') {
                                              return <span className="price-unit">/<FormattedMessage id="app.shoppingCart.unit" /></span>;
                                            }
                                            return null;
                                          })()
                                        }
                                      </div>
                                      {
                                        /* 修改商品项html*/
                                        (() => {
                                          if (item.purchase_type === 'free') {
                                            return (
                                              <div>
                                                <FormattedMessage id="app.shoppingCart.free" />
                                              </div>
                                            );
                                          }
                                          if (item.has_buyout_price === false) {
                                            return (
                                              <div>
                                                <FormattedMessage id="app.shoppingCart.modeAmount" />
                                              </div>
                                            );
                                          }
                                          return (
                                            <select onChange={(e) => { this.amountChange(e, item); }}>
                                              <option value="amount" selected={item.purchase_type === 'amount'}>{this.options.amount}</option>
                                              <option value="buyout" selected={item.purchase_type === 'buyout'}>{this.options.buyout}</option>
                                            </select>
                                          );
                                        })()
                                      }
                                      <div className={`amount ${(item.purchase_type === 'buyout' || item.purchase_type === 'free') ? 'opacity48' : ''}`}>
                                        <a className="opt minus" onClick={() => { this.changeQty('minus', item); }}></a>
                                        <input type="number" min="1" max="999999" value={item.count} onChange={(e) => { this.amountChange(e, item); }} disabled={item.purchase_type === 'buyout' || item.purchase_type === 'free'} />
                                        <a className="opt add" onClick={() => { this.changeQty('add', item); }}></a>
                                      </div>
                                    </div>
                                  );
                                })()
                              }
                            </div>
                            {
                              /* 修改商品项toolbar html*/
                              (() => {
                                // if (item.product_type === 'live') {
                                //   return <div className="dx-flex-operation">&nbsp;</div>;
                                // }
                                if (this.state.selectedTab === 'private' || item.status === 'offshelves' || item.status === 'auditing' || item.purchase_type === 'free' || (item.product_type === 'live' && (item.live_status === 'over' || item.live_status === 'on_live'))) {
                                  return (
                                    <div className="dx-flex-operation">
                                      <a className="remove" onClick={() => { self.setState({ ...self.state, isConfirmOpen: true, confirmMsgKey: 'app.shoppingCart.removeConfirm', removingProduct: item }); }} ></a>
                                    </div>
                                  );
                                }
                                if (this.state.editingId !== item.id) {
                                  return (
                                    <div className="dx-flex-operation">
                                      <a className="edit" onClick={() => { this.setState({ editingId: item.id }); }}></a>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="dx-flex-operation">
                                    <a className="done" onClick={() => { this.saveProduct(item); }}>
                                      <FormattedMessage id="app.shoppingCart.editDone" />
                                    </a>
                                    <a className="remove" onClick={() => { self.setState({ ...self.state, isConfirmOpen: true, confirmMsgKey: 'app.shoppingCart.removeConfirm', removingProduct: item }); }}></a>
                                  </div>
                                );
                              })()
                            }
                          </div>
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            );
          })()
        }
        { this.renderFooter(items, selectedCount, selectable) }
        <Confirm
          shouldCloseOnOverlayClick={false}
          isOpen={this.state.isConfirmOpen}
          onRequestClose={this.closeConfirm}
          onConfirm={this.removeProduct}
          confirmButton={<span><FormattedMessage id="app.course.ok" /></span>}
          cancelButton={<span><FormattedMessage id="app.course.cancel" /></span>}
        >
          <span>
            <FormattedMessage id={this.state.confirmMsgKey} />
          </span>
        </Confirm>
      </div>
    );
  }
}

ShoppingCart.contextTypes = {
  intl: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};

const mapStateToProps = state => ({
  shoppingCart: state.shoppingCart || {},
  userInfo: state.account.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({},
      shoppingCartActions,
      accountActions),
    dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
