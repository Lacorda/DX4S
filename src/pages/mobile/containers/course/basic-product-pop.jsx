/**
 * 多学课堂-弹出Pop
 */
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import './product.styl';

class ProductPop extends Component {
  constructor(props, context) {
    super(props, context);
    this.changeMode = ::this.changeMode;
    this.getModeBox = ::this.getModeBox;
    this.changeQty = ::this.changeQty;
    this.amountChange = ::this.amountChange;
    this.save = ::this.save;
    this.state = {
      buyMode: 'enterprise',
      purchaseType: 'amount',
      qty: 1,
    };
  }

  getModeBox() {
    const self = this;
    const { priceInfo } = this.props;
    // 买断价格
    const buyout = {
      price: priceInfo.buyout_price,
    };

    const amountRange = function getRange(purchase) {
      const isInRange = self.state.qty >= purchase.gte &&
        (purchase.lte === null || self.state.qty <= purchase.lte);
      return {
        active: self.state.purchaseType === 'amount' && isInRange,
      };
    };

    const buyoutRange = function getBuyoutRange(notGroup) {
      return {
        active: self.state.purchaseType === 'buyout' || priceInfo.is_free || notGroup,
      };
    };

    const unitPrice = function getUnitPrice() {
      if (priceInfo.is_free) {
        return <FormattedMessage id="app.product.free" />;
      }

      // to fixed issue DX-8643
      if (priceInfo.group_purchase === null) {
        return `￥${priceInfo.unit_price}` || '';
      }

      if (!priceInfo.group_purchase.length) {
        return `￥${priceInfo.unit_price}` || '';
      }

      return `￥${priceInfo.group_purchase[0].price}`;
    };

    const buyoutPrice = function getBuyoutPrice() {
      if (priceInfo.is_free) {
        return <FormattedMessage id="app.product.groupPriceFree" />;
      }
      return <FormattedMessage id="app.product.groupPriceBuyout" values={buyout} />;
    };

    if (this.state.buyMode === 'enterprise') {
      return (<div>
        <div className="product-pop-range">
          <div className="title">
            {/* 范围 */}
            <FormattedMessage id="app.product.groupRange" />
          </div>
          <div className="prices">
            {
              priceInfo.group_purchase.map((purchase, index) => (
                (() => {
                  if (!purchase.lte) {
                    return <a key={index} className={classNames(amountRange(purchase))} onClick={() => { this.setState({ purchaseType: 'amount', qty: purchase.gte }); }}><FormattedMessage id="app.product.groupPriceEnd" values={purchase} /></a>;
                  }
                  return <a key={index} className={classNames(amountRange(purchase))} onClick={() => { this.setState({ purchaseType: 'amount', qty: purchase.gte }); }}><FormattedMessage id="app.product.groupPrice" values={purchase} /></a>;
                })()
              ))
            }
            {
              /* 买断*/
              (() => {
                if (priceInfo.buyout_price) {
                  return (<a className={classNames(buyoutRange(!priceInfo.group_purchase.length))} onClick={() => { this.setState({ purchaseType: 'buyout', qty: 1 }); }}>{buyoutPrice()}</a>);
                }
                return null;
              })()
            }
            {
              (() => {
                if (!priceInfo.group_purchase.length && !priceInfo.buyout_price) {
                  return (<a className="active" onClick={() => { this.setState({ purchaseType: (priceInfo.is_free ? 'free' : 'amount'), qty: 1 }); }}>
                    {
                      `${this.context.intl.messages['app.product.moreThanOne']}(${priceInfo.is_free ? this.context.intl.messages['app.product.free'] : priceInfo.unit_price})`
                    }
                  </a>);
                }
                return null;
              })()
            }
          </div>
        </div>
        <div className="product-pop-count">
          <div className="title">{this.context.intl.messages['app.product.buyCount']}</div>
          <div className="count">
            <a className="opt minus" onClick={() => { this.changeQty('minus'); }} />
            <input type="number" min="1" max="999999" value={this.state.qty} onChange={(e) => { this.amountChange(e); }} disabled={this.state.purchaseType === 'buyout' || priceInfo.is_free} />
            <a className="opt add" onClick={() => { this.changeQty('add'); }} />
          </div>
        </div>
      </div>);
    }

    return (<div className="product-pop-range pb126">
      <div className="title">
        <span className="pr16"><FormattedMessage id="app.product.unitPrice" />：</span>
        <span className="price">{unitPrice()}</span>
      </div>
    </div>);
  }

  amountChange(e) {
    let num = e.target.value;
    if (num == 0) {
      num = 1;
    }
    if (num > 999999) {
      num = 999999;
    }
    this.setState({ qty: num });
  }

  changeQty(type) {
    if (this.state.purchaseType === 'buyout') {
      return;
    }

    const { priceInfo } = this.props;
    if (priceInfo.is_free) {
      return;
    }

    if (type === 'minus' && this.state.qty === 1) {
      return;
    }

    const qty = this.state.qty - 0;
    if (type === 'minus') {
      this.setState({ qty: (qty - 1) });
    } else {
      this.setState({ qty: (qty + 1) });
    }
  }

  changeMode(mode) {
    this.setState({ buyMode: mode });
  }

  save() {
    const { onBuy, closePop, priceInfo } = this.props;
    const config = {
      buyMode: this.state.buyMode,
      purchaseType: priceInfo.is_free ? 'free' : this.state.purchaseType,
      qty: this.state.qty,
    };
    if (this.state.buyMode === 'private') {
      config.qty = 1;
      config.purchaseType = config.purchaseType === 'free' ? 'free' : 'amount';
    }
    onBuy(config);
    closePop();
  }

  render() {
    const { priceInfo, closePop, popAction } = this.props;
    const self = this;
    const buyMode = function getBuyMode(mode) {
      return {
        active: self.state.buyMode === mode,
      };
    };

    let btnKey = 'app.product.shop';
    if (popAction === 'TO_CART') {
      btnKey = 'app.product.add2Cart';
    }

    if (!priceInfo.group_purchase) { priceInfo.group_purchase = []; }

    return (
      <div className="product-pop-wrap">
        <div className="product-pop">
          <div className="product-pop-header">
            {/* 购买方式 */}
            <div className="pop-title">{this.context.intl.messages['app.product.mode']}</div>
            <a className="close" onClick={closePop}>&nbsp;</a>
          </div>
          <div className="product-pop-tab">
            <a className={classNames(buyMode('enterprise'))} onClick={() => { this.changeMode('enterprise'); }}>
              {/* 企业按数量购买 */}
              <FormattedMessage id="app.product.modeEnterprise" />
            </a>
            <a className={classNames(buyMode('private'))} onClick={() => { this.changeMode('private'); }}>
              {/* 个人购买 */}
              <FormattedMessage id="app.product.modePerson" />
            </a>
          </div>
          {this.getModeBox()}
        </div>
        <div className="product-footer">
          <a className="pop" onClick={this.save}>
            <FormattedMessage id={btnKey} />
          </a>
        </div>
      </div>
    );
  }
}

ProductPop.contextTypes = {
  // router: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
};

ProductPop.propTypes = {
  priceInfo: PropTypes.object.isRequired,
  closePop: PropTypes.func,
  onBuy: PropTypes.func,
  popAction: PropTypes.string,
};

export default ProductPop;
