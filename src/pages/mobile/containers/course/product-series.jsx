/**
 * 商品详情-系列课
*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import Toast from 'components/modal/toast';
import { products as productActions } from '../../actions';
import './product.styl';

class ProductSeries extends Component {
  static propTypes() {
    return {
      productInfo: PropTypes.array,
      query: PropTypes.object,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      isToastShow: false,
    };
  }

  getType = {
    course: '', /* 不显示角标 */
    series: this.context.intl.messages['app.productType.series'],
    quiz: this.context.intl.messages['app.productType.exam'],
    live: this.context.intl.messages['app.productType.live'],
    survey: this.context.intl.messages['app.productType.survey'],
  };

  goCourseDetail(course) {
    if (course.type !== 'course') {
      return;
    }

    const { query } = this.props;

    const router = this.context.router;
    const seriesQuery = {
      type: query.type || 'series',
    };
    router.push(router.createPath(`/products/course/${course.id}`, seriesQuery));
    // this.forceUpdate();
  }

  render() {
    const self = this;
    const { productInfo } = this.props;
    if (!productInfo.items) {
      productInfo.items = [];
    }
    return (
      <div>
        <div className="widget">
          <div className="widget-header"><FormattedMessage id="app.course.series" /></div>
          <div className="list-box">
            <ul className="dx-list">
              {
                productInfo.items.map((item, index) => {
                  const lastIndex = productInfo.items.length - 1;
                  return (
                    <li className="one-slide" key={item.id} onClick={() => { this.goCourseDetail(item); }}>
                      <div className={`dx-flex-box${(index === lastIndex) ? ' no-border' : ''}`}>
                        <div className="dx-flex-img">
                          <div className={`icon ${item.type}`}>{this.getType[item.type]}</div>
                          <img src={item.cover_url} alt="" />
                        </div>
                        <div className="dx-flex-info">
                          <div className="dx-flex-info-title">{item.name}</div>
                          <div className="dx-flex-info-desc">
                            {
                              (() => {
                                if (item.price != null) {
                                  return <span className="price-val">￥ {item.price}</span>;
                                }
                                return null;
                              })()
                            }
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
        <Toast
          style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
          isOpen={this.state.isToastShow}
          timeout={2000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            self.setState({ isToastShow: false });
          }}
        >
          <div><FormattedMessage id="app.product.disabledPreview" /></div>
        </Toast>
      </div>
    );
  }
}

ProductSeries.contextTypes = {
  router: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  productInfo: state.products.detail,
  query: ownProps.query,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(productActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductSeries);
