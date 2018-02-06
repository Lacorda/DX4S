import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import './style.styl';

import messages from './messages';

/**
 * 首字母大写，其余小写
 * @param str
 * @return {string}
 */
function capitalize(str) {
  const [capital, ...tail] = str;
  return capital.toUpperCase() + tail.join('').toLowerCase();
}

// 购买方式
const BY_ENTERPRISE = 'ENTERPRISE'; // 企业按数量购买
const BY_PERSONAL = 'PERSONAL'; // 个人购买

class ComboMenu extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      by: BY_ENTERPRISE,
      count: 1,
    };
  }

  onCountInput = (e) => {
    const count = e.target.value;
    if (/[1-9]\d*/.test(count)) this.setState({ count: +count });
  };

  minusCount = () => {
    const { count } = this.state;
    if (count > 1) this.setState({ count: count - 1 });
  };

  plusCount = () => {
    const { count } = this.state;
    this.setState({ count: count + 1 });
  };

  renderWay = (way) => {
    const { by } = this.state;
    const byEnterpriseClass = classnames({ active: by === way });
    const i18nMessage = messages[`by${capitalize(way)}`];
    return (
      <a
        className={byEnterpriseClass}
        onClick={() => this.setState({ by: way })}
      >
        <FormattedMessage {...i18nMessage} />
      </a>
    );
  };

  renderRangeSection = () => (
    <div key="range" className="dx-combo-menu-section border-bottom">
      <div className="dx-combo-menu-title">
        <FormattedMessage {...messages.range} />
      </div>
      <div className="dx-combo-menu-tabs range">
        <a className="active">123</a>
        <a>123</a>
        <a>123</a>
      </div>
    </div>
  );

  renderCountSection = () => (
    <div key="count" className="dx-combo-menu-section count">
      <div className="dx-combo-menu-title">
        <FormattedMessage {...messages.count} />
        <div className="counter">
          <span className="opt" onClick={this.minusCount}>-</span>
          <input
            min="1"
            type="number"
            value={this.state.count}
            onChange={this.onCountInput}
          />
          <span className="opt" onClick={this.plusCount}>+</span>
        </div>
      </div>
    </div>
  );

  renderPerPriceSection = () => (
    <div className="dx-combo-menu-section unit-cost">
      <div className="dx-combo-menu-title">
        <div>
          <FormattedMessage {...messages.unitCost} />
          <span className="price">￥ {this.props.unitCost}</span>
        </div>
      </div>
    </div>
  );

  render() {
    if (!this.props.isOpen) return null;

    const { rangeGroup } = this.props;
    const { by } = this.state;

    let priceEl;
    if (by === BY_ENTERPRISE) {
      priceEl = [
        this.renderRangeSection(),
        this.renderCountSection(),
      ];
    } else if (by === BY_PERSONAL) {
      priceEl = this.renderPerPriceSection();
    }

    return (
      <div className="dx-combo-menu-wrap">
        <div className="dx-combo-menu">
          <div className="dx-combo-menu-section">
            <div className="dx-combo-menu-title">
              <FormattedMessage {...messages.way} />
              <span
                className="dx-combo-menu-title-close"
                onClick={this.props.onCloseButtonClick}
              />
            </div>
            <div className="dx-combo-menu-tabs way">
              {this.renderWay(BY_ENTERPRISE)}
              {this.renderWay(BY_PERSONAL)}
            </div>
          </div>

          {priceEl}
        </div>
      </div>
    );
  }
}

const { shape, bool, func, number } = React.PropTypes;
ComboMenu.propTypes = {
  unitCost: number,
  rangeGroup: shape({}),
  isOpen: bool,
  onCloseButtonClick: func.isRequired,
//  onAffirm: func.isRequired,
};

export default ComboMenu;
