import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import Ribbon from '../../../../components/ribbon';
import Toast from '../../../../components/modal/toast';


import messages from './messages';


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
    default :
      break;
  }
  return '';
}
class ProductItem extends React.Component {
  static contextTypes = {
    intl: React.PropTypes.object,
    router: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.getUrl = ::this.getUrl;
    this.getLinkImg = ::this.getLinkImg;
    this.state = {
      isToastShow: false,
      toastContent: '',
    };
  }


  getUrl() {
    const { id } = this.props;
    switch (this.props.product_type) {
      case 'live':
        return `/products/live/${id}`;
      case 'course':
        return `/products/course/${id}`;
      case 'series':
        return `/products/series/${id}`;
      default:
        break;
    }
    return '';
  }

  getLinkImg() {
    // if (this.props.product_type === 'live') {
    //   return (<img
    //     src={this.props.cover_url}
    //     alt={this.props.name} onClick={() => {
    //       this.setState({
    //         isToastShow: true,
    //         toastContent: this.context.intl.messages['app.mall.liveMsgToast'],
    //       });
    //       return false;
    //     }}
    //   />);
    // }
    return (<Link to={this.getUrl()}>
      <img src={this.props.cover_url} alt={this.props.name} />
    </Link>);
  }


  render() {
    return (
      <div className="section-item" onClick={() => {
        const path = this.getUrl();
        this.context.router.push(path);
      }}>
        <div className="img">
          {
            this.getLinkImg()
          }
          {
            this.props.beginTime &&
              (<div className="begin">
                {moment(this.props.beginTime).format('YYYY-MM-DD HH:mm') }
              </div>)
          }
          {
            (() => {
              if (this.props.product_type !== 'course') {
                return (
                  <Ribbon
                    text={getProductType(this.props.product_type)}
                    backgroundColor={getBgColor(this.props.product_type)}
                  />);
              }
              return null;
            })()
          }
        </div>
        <Link className="title" to={this.getUrl()}>{this.props.name}</Link>
        <div>
          {
            (() => {
              if (this.props.is_free) {
                return (
                  <div className="pull-left price"><FormattedMessage {...messages.free} /></div>);
              }
              return (<div className="pull-left price">&yen;{this.props.price}</div>);
            })()
          }
          <div className="pull-right"><span className="people gray" />{this.props.sales}</div>
        </div>
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


ProductItem.propTypes = {
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  product_type: React.PropTypes.string,
  price: React.PropTypes.number,
  is_free: React.PropTypes.bool,
  cover_url: React.PropTypes.string,
  sales: React.PropTypes.number,
  beginTime: React.PropTypes.string,
};
export default ProductItem;
