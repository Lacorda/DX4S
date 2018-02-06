import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const propTypes = {
  onFetch: PropTypes.func.isRequired,
  onShowSlide: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

// 过滤栏
class Filter extends React.Component {
  constructor(...args) {
    super(...args);
    this.onClickOrder = ::this.onClickOrder;
    this.state = {
      field: 'general',
      order: 'desc',
    };
  }

  onClickOrder(name) {
    const { onFetch } = this.props;
    const field = name;
    let order;
    if (this.state.field === name) {
      order = this.state.order === 'asc' ? 'desc' : 'asc';
    } else {
      order = field === 'price' ? 'asc' : 'desc';
    }
    this.setState({ field, order }, () => {
      onFetch({ sort_field: this.state.field, sort_order: this.state.order });
    });
  }

  render() {
    const { field, order } = this.state;
    const { onShowSlide, selected } = this.props;
    return (
      <ul className="filter">
        <li className={field === 'general' ? 'active' : ''} onClick={() => this.onClickOrder('general')}>
          <div className="name"><FormattedMessage {...messages.general} /></div>
          <div className="arrow">
            <div className={field === 'general' && order === 'asc' ? 'arrow-top active' : 'arrow-top'} />
            <div className={field === 'general' && order === 'desc' ? 'arrow-bottom active' : 'arrow-bottom'} />
          </div>
        </li>
        <li className={field === 'sales' ? 'active' : ''} onClick={() => this.onClickOrder('sales')}>
          <div className="name"><FormattedMessage {...messages.sales} /></div>
          <div className="arrow">
            <div className={field === 'sales' && order === 'asc' ? 'arrow-top active' : 'arrow-top'} />
            <div className={field === 'sales' && order === 'desc' ? 'arrow-bottom active' : 'arrow-bottom'} />
          </div>
        </li>
        <li className={field === 'price' ? 'active' : ''} onClick={() => this.onClickOrder('price')}>
          <div className="name"><FormattedMessage {...messages.price} /></div>
          <div className="arrow">
            <div className={field === 'price' && order === 'asc' ? 'arrow-top active' : 'arrow-top'} />
            <div className={field === 'price' && order === 'desc' ? 'arrow-bottom active' : 'arrow-bottom'} />
          </div>
        </li>
        <li className={selected ? 'active' : ''} onClick={onShowSlide}>
          <div className="name"><FormattedMessage {...messages.filter} /></div>
          <div className="icon-filter" />
        </li>
      </ul>
    );
  }
}

Filter.propTypes = propTypes;

export default Filter;
