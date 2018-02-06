import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';


import Carousel from '../../components/Carousel';
import messages from './messages';


class MallHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showmark: true };
    this.handlerHide = ::this.handlerHide;
  }

  handlerHide() {
    const { handleCloseMark } = this.props;
    if (handleCloseMark) {
      handleCloseMark();
    }
  }

  render() {
    return (
      <div>
        <div className="mall_header">
          {
            (() => {
              if (this.props.role_type === 'admin' && this.props.showmark) {
                return (
                  <div className="marker">
                    <FormattedMessage {...messages.mark} />
                    <span className="close pull-right" onClick={this.handlerHide} />
                  </div>);
              }
              return null;
            })()
          }
          <div className="searchbar">
            <Link to="/search">
              <div className="content">
                <span className="search-icon" /><FormattedMessage {...messages.search} />
              </div>
            </Link>
          </div>
          {
            (() => {
              if (this.props.role_type !== 'admin') {
                return (
                  <div className="carousel">
                    <Carousel dots autoplay>
                      {this.props.banners.map((item, index) =>
                        <a
                          href={item.link_type === 0 ? item.link_url : '#/products/course/'+item.link_id}
                          key={index}
                        >
                        <img src={item.img} alt="多学" style={{ width: '100%' }} />
                        </a>
                      )}
                    </Carousel>
                  </div>
                );
              }
              return null;
            })()

          }

          <div className="nav-btn">
            {
              (() => {
                if (this.props.role_type === 'admin') {
                  return (
                    <ul className="ul">
                      <li>
                        <Link
                          to="/distribution/required"
                          className="menu_must"
                        >
                          <FormattedMessage {...messages.must} />
                        </Link></li>
                      <li>
                        <Link
                          to="/publish-electives"
                          className="menu_elective"
                        ><FormattedMessage {...messages.elective} />
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/shopping-cart"
                          className="menu_cart"
                        >
                          <div className="fixed-badge">
                            <FormattedMessage {...messages.cart} />
                            <span
                              className="badge"
                            >{this.props.cart_count}</span>
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/order"
                          className="menu_order"
                        >
                          <FormattedMessage
                            {...messages.order}
                          />
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/account/biz"
                          className="menu_company"
                        ><FormattedMessage {...messages.company} /></Link>
                      </li>
                    </ul>
                  );
                }
                return (
                  <ul className="ul">
                    <li>
                      <Link
                        to="/shopping-cart"
                        className="menu_cart"
                      >
                        <FormattedMessage {...messages.cart} />
                        <span
                          className="badge"
                        >{this.props.cart_count || 0}</span></Link>
                    </li>
                    <li><Link to="/order" className="menu_order"><FormattedMessage {...messages.order} /></Link></li>
                  </ul>
                );
              })()
            }
          </div>
        </div>
        {
          (() => {
            if (this.props.role_type === 'admin') {
              return (
                <div className="stats">
                  <div className="yesterday-bg">
                    <span className="icon_stats" />
                    <FormattedMessage {...messages.yesterdayStats} /></div>
                  <ul className="stats-item">
                    <li>
                      <div>
                        <span className="strong">{this.props.stats_object.study_count || 0}</span><br />
                        <span className="gray"><FormattedMessage {...messages.learnCount} /></span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="strong">{this.props.stats_object.sign_count || 0}</span><br />
                        <span className="gray"><FormattedMessage {...messages.signCount} /></span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="strong">{this.props.stats_object.finish_count || 0}</span><br />
                        <span className="gray"><FormattedMessage {...messages.finishCount} /></span>
                      </div>
                    </li>
                  </ul>
                </div>
              );
            }
            return null;
          })()
        }


      </div>
    );
  }
}

MallHeader.propTypes = {
  role_type: React.PropTypes.string,
  cart_count: React.PropTypes.number,
  stats_object: React.PropTypes.shape({
    study_count: React.PropTypes.number,
    sign_count: React.PropTypes.number,
    finish_count: React.PropTypes.number,
  }),
  banners: React.PropTypes.array,
  showmark: React.PropTypes.bool,
  handleCloseMark: React.PropTypes.func,
};

MallHeader.defaultProps = {
  role_type: '',
  cart_count: React.PropTypes.number,
  stats_object: React.PropTypes.shape({
    study_count: 0,
    sign_count: 0,
    finish_count: 0,
  }),
  banners: ['./img/banner-1.jpg', './img/banner-2.jpg'],
  showmark: true,
};

export default MallHeader;

