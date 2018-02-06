import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import ProductItem from './product-item';

import messages from './messages';


class ProductSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.products.length === 0) {
      return null;
    }
    let moreLink = `/mall/more/${this.props.id}`;
    if (this.props.id === 'live') {
      moreLink = '/mall/lives';
    }
    return (

      <div className={`${this.props.cls}`}>
        <div className="section-header clearfix">
          <div className="pull-left">{this.props.name}</div>
          <Link
            className="pull-right more"
            to={moreLink}
            onClick={() => {
              if (this.props.linkMethod) {
                this.props.linkMethod();
              }
            }}
          >
            <div><FormattedMessage {...messages.more} /></div>
          </Link>
        </div>
        <div className="section-cate clearfix">
          {
            (() => (this.props.posts.map((post, index) =>
              (<span key={index}>{post.name}</span>)
            )))()
          }
        </div>
        <div>
          {
            (() => (this.props.products.map((product, index) =>
              (<ProductItem
                id={product.id}
                cover_url={product.cover_url}
                product_type={product.product_type || product.type}
                price={product.price || product.unit_price}
                is_free={product.is_free}
                sales={product.sales}
                name={product.name}
                beginTime={product.begin_time}
                key={index}
              />
              )
            )))()
          }
        </div>

      </div>
    );
  }
}
const { oneOfType, number, string } = React.PropTypes;

const obj = {
  id: oneOfType([number, string]),
  name: React.PropTypes.string,
  product_type: React.PropTypes.string,
  price: React.PropTypes.number,
  is_free: React.PropTypes.bool,
  cover_url: React.PropTypes.string,
  sales: React.PropTypes.number,
};
ProductSection.propTypes = {
  id: oneOfType([number, string]),
  name: React.PropTypes.string,
  cls: React.PropTypes.string,
  posts: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number,
    name: React.PropTypes.string,
  })),
  products: React.PropTypes.arrayOf(React.PropTypes.shape(obj)),
  linkMethod: React.PropTypes.func,
};
export default ProductSection;
