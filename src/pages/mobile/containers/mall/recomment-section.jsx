import React from 'react';
import { FormattedMessage } from 'react-intl';
import ProductItem from './product-item';

import messages from './messages';

class RecommendSection extends React.Component {
  constructor(props) {
    super(props);
    this.StartIndex = 0;
    this.handleClick = ::this.handleClick;
    this.getNextProducts = ::this.getNextProducts;
    this.getFirst = ::this.getFirst;
    this.state = {
      showProducts: [],
    };
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.setState({
      showProducts: this.getFirst(),
    });
  }

  componentWillReceiveProps({ products }) {
    if (products.length !== this.props.products.length) {
      this.setState({
        showProducts: products.filter((item, index) => index < 4),
      });
    }
  }

  getFirst() {
    return this.props.products.filter((item, index) => index < 4);
  }

  getNextProducts(list, takeNumber) {
    let retList = [];
    if (list.length <= takeNumber) {
      retList = list;
    } else {
      retList = list.filter((item, index) =>
        index >= this.StartIndex && index <= (this.StartIndex + takeNumber) - 1
      );
      this.StartIndex = takeNumber + this.StartIndex;
    }
    let second = [];
    if (retList.length < takeNumber) {
      this.StartIndex = (takeNumber - retList.length);
      second = list.filter((item, index) => (index < this.StartIndex));
    }
    return retList.concat(second);
  }

  handleClick() {
    const showProducts = this.getNextProducts(this.props.products, 4);
    this.setState({
      showProducts,
    });
  }


  render() {
    return (
      <div className="product-section doubbleHeight">
        <div className="section-header clearfix">
          <div className="pull-left"><FormattedMessage {...messages.recommendCourse} /></div>
          <div className="pull-right more">
            <div onClick={this.handleClick}><FormattedMessage {...messages.change} /></div>
          </div>
        </div>
        <div>
          {
            (() => this.state.showProducts.map((product, index) => (
              <ProductItem
                id={product.id}
                cover_url={product.cover_url}
                product_type={product.product_type}
                price={product.price}
                is_free={product.is_free}
                sales={product.sales}
                name={product.name}
                key={`section${index}`}
              />
              )
            ))()
          }
        </div>
      </div>
    );
  }
}

const obj = {
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  product_type: React.PropTypes.string,
  price: React.PropTypes.number,
  is_free: React.PropTypes.bool,
  cover_url: React.PropTypes.string,
  sales: React.PropTypes.number,
};

RecommendSection.propTypes = {
  // eslint-disable-next-line
  products: React.PropTypes.arrayOf(React.PropTypes.shape(obj)),
};
export default RecommendSection;
