import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchShoppingCartCount } from 'dxActions/shopping-cart';

import * as selectors from './selectors';

import messages from './messages';
import './style.styl';

class Cart extends Component {
  componentDidMount() {
    this.props.actions.fetchShoppingCartCount();
  }

  goToCart = () => {
    const router = this.context.router;
    router.push(router.createPath('/shopping-cart'));
  };

  render() {
    const { total } = this.props;
    const totalEl = total === 0
      ? null
      : <span className="dx-cart-count">{total}</span>;

    return (
      <a className="dx-cart" onClick={this.goToCart}>
        <p>
          <FormattedMessage {...messages.cart} />
          {totalEl}
        </p>
      </a>

    );
  }
}

const { func, number, object, shape } = React.PropTypes;
Cart.contextTypes = { router: object };

Cart.propTypes = {
  total: number,
  actions: shape({ fetchShoppingCartCount: func }),
};

const mapStateToProp = state => ({
  total: selectors.totalSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ fetchShoppingCartCount }, dispatch),
});

export default connect(mapStateToProp, mapDispatchToProps)(Cart);
