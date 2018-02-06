import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import { nav } from 'utils/dx';

import Footer from '../../components/footer';
import MallHeader from './mall-header';
import ProductSection from './product-section';
import RecommendSection from './recomment-section';
import banner1 from './img/mall_banner_1.png';
import banner2 from './img/mall_banner_2.png';
import { mall as mallActions, account as accountActions, shoppingCart } from '../../actions';

import './style.styl';

class MallHome extends React.Component {
  static contextTypes = {
    intl: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.readyFetch = ::this.readyFetch;
    this.setNavBar = ::this.setNavBar;
  }


  componentDidMount() {
    this.readyFetch();
  }

  getProductSection() {
    const obj = this.props.classficiations.map((item, index) =>
      (<ProductSection
        id={item.id}
        cls={'product-section'}
        name={item.name}
        posts={item.posts}
        products={item.products}
        key={`product${index}`}
        linkMethod={() => {
          this.props.actions.setActiveClassification(item.id, '');
        }}
      />)
    );
    return obj;
  }

  getLiveProductSection() {
    const liveItems = [{
      id: 'live',
      name: this.context.intl.messages['app.mall.mallLiveHomeTitle'],
      posts: [],
      products: this.props.liveProducts || [],
    }];
    const obj = liveItems.map((item, index) =>
      (<ProductSection
        id={item.id}
        cls={'live-section'}
        name={item.name}
        posts={item.posts}
        products={item.products}
        key={`liveproduct${index}`}
        linkMethod={() => {
        }}
      />)
    );
    return obj;
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.mall.mallHomeTitle'],
    });
  }

  async readyFetch() {
    const { actions, accountAction, shoppingCartActions } = this.props;
    if (!this.props.lastUpdated) {
      await accountAction.fetchUser();
    }
    actions.fetchMallBanner();
    const getState = actions.fetchMallHomeStats();
    const getClassificationProducts = actions.fetchClassficiationProducts();
    const getRecommendProducts = actions.fetchRecommendProducts();
    const getLiveProducts = actions.fetchLiveProducts({ index: 1, size: 2 });
    const getShoppingCartCount = shoppingCartActions.fetchShoppingCartCount(
      (this.props.role_type === 'admin' ? 'all' : 'private')
    );
    await Promise.all([getState, getClassificationProducts,
      getRecommendProducts, getShoppingCartCount, getLiveProducts]);
  }

  render() {
    this.setNavBar();
    return (
      <div className="mall-home">
        <MallHeader
          role_type={this.props.role_type}
          stats_object={this.props.stats_object}
          cart_count={this.props.cart_count}
          banners={this.props.banner}
          showmark={this.props.showmark}
          handleCloseMark={() => this.props.actions.setMallHomeCloseMark()}
        />
        {this.getProductSection()}
        {this.getLiveProductSection()}
        <RecommendSection products={this.props.recommendProducts} />
        <Footer />

      </div>
    );
  }
}

MallHome.propTypes = {
  classficiations: React.PropTypes.array,
  role_type: React.PropTypes.string,
  lastUpdated: React.PropTypes.shape(),
  recommendProducts: React.PropTypes.array,
  stats_object: React.PropTypes.shape(),
  cart_count: React.PropTypes.number,
  showmark: React.PropTypes.bool,
  actions: React.PropTypes.shape(),
  accountAction: React.PropTypes.shape(),
  shoppingCartActions: React.PropTypes.shape(),
  liveProducts: React.PropTypes.array,
  banner: React.PropTypes.array,
};


export default connect(state => (
  {
    classficiations: state.mall.classificationProducts || [],
    role_type: state.account.user.is.admin ? 'admin' : '',
    lastUpdated: state.account.user.lastUpdated || null,
    recommendProducts: state.mall.recommendProducts || [],
    stats_object: state.mall.mallHomeStats || {},
    cart_count: state.shoppingCart.cartCount.EnterpriseCount
    + state.shoppingCart.cartCount.PersonalCount || 0,
    showmark: state.mall.showmark,
    liveProducts: state.mall.liveProducts.items || [],
    banner: state.mall.mallBanner || [{ img: banner1, link_type: 1 }],
  }
), dispatch => (
  {
    actions: bindActionCreators(mallActions, dispatch),
    accountAction: bindActionCreators(accountActions, dispatch),
    shoppingCartActions: bindActionCreators(shoppingCart, dispatch),
  }
))(MallHome);

