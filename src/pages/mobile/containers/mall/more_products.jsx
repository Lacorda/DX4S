import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import Ribbon from '../../../../components/ribbon';
import Toast from '../../../../components/modal/toast';


function getProductType(type) {
  switch (type) {
    case 'live':
      return <FormattedMessage {...messages.live} />;
    case 'course':
      return <FormattedMessage {...messages.micro} />;

    case 'series':
      return <FormattedMessage {...messages.series} />;

    default:
      break;
  }

  return '';
}

function getBgColor(type) {
  switch (type) {
    case 'live':
      return '#F84E4E';

    case 'course':
      return '#38ACFF';

    case 'series':
      return '#82C650';
    default:
      break;
  }
  return '';
}

function getUrl(type, id) {
  switch (type) {
    case 'live':
    case 'course':
      return `/products/course/${id}`;

    case 'series':
      return `/products/series/${id}`;
    default:
      break;
  }
  return '';
}


class MoreProducts extends React.Component {
  static contextTypes = {
    intl: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.getProductItems = ::this.getProductItems;
    this.state = {
      isToastShow: false,
      toastContent: '',
    };
  }


  getProductItems() {
    const { products } = this.props;
    if (products && products.length > 0) {
      return products.map((item, index) => {
        if (item.product_type === 'live') {
          return (
            <li
              className="li clearfix"
              key={`product${index}`}
              onClick={() => {
                this.setState({
                  isToastShow: true,
                  toastContent: this.context.intl.messages['app.mall.liveMsgToast'],
                });
                return false;
              }}
            >
              <img
                className="img"
                src={item.cover_url}
                alt={item.name}
              />
              {
                (() => {
                  if (true || item.product_type !== 'course') {
                    return (
                      <Ribbon
                        text={getProductType(item.product_type)}
                        backgroundColor={getBgColor(item.product_type)}
                      />);
                  }
                  return null;
                })()
              }
              <div className="info">
                <div className="title">{item.name}</div>
                <div className="lecture">{item.lecturer}</div>
                <div className="price pull-left">&yen;{
                  (() => {
                    if (item.is_free) {
                      return 'free';
                    }
                    return item.price;
                  })()
                }</div>
                <div className="count pull-right"><span className="people" />{item.sales}</div>
              </div>
            </li>
          );
        }
        return (
          <Link to={getUrl(item.product_type, item.id)} key={`link${index}`}>
            <li
              className="li clearfix"
              key={`product${index}`}
            >
              <img
                className="img"
                src={item.cover_url}
                alt={item.name}
              />
              {
                (() => {
                  if (item.product_type !== 'course') {
                    return (
                      <Ribbon
                        text={getProductType(item.product_type)}
                        backgroundColor={getBgColor(item.product_type)}
                      />);
                  }
                  return null;
                })()
              }
              <div className="info">
                <div className="title">{item.name}</div>
                <div className="lecture">{item.lecturer}</div>
                <div className="price pull-left">{
                  (() => {
                    if (item.is_free) {
                      return this.context.intl.messages['app.mall.mallhome.free'];
                    }
                    return `￥${item.price}`;
                  })()
                }</div>
                <div className="count pull-right"><span className="people" />{item.sales}</div>
              </div>
            </li>
          </Link>
        );
      });
    }
    return null;
  }

  render() {
    return (
      <div className="products">
        <ul className="ul">
          {
            this.getProductItems()
          }
        </ul>
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

MoreProducts.propTypes = {
  // eslink_disabled_next_line
  products: React.PropTypes.arrayOf(React.PropTypes.shape({
    // id: React.PropTypes.number,
    // name: React.PropTypes.string,
    // product_type: React.PropTypes.string,
    // price: React.PropTypes.number,
    // is_free: React.PropTypes.bool,
    // cover_url: React.PropTypes.string,
    // sales: React.PropTypes.number,
    // lecturer: React.PropTypes.string,
  })),
};


export default MoreProducts;

