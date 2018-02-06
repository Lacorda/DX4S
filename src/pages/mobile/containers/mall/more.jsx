import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { nav } from 'utils/dx';
import MoreHeader from './more_header';
import MoreProducts from './more_products';
import './style.styl';
import { mall as mallActions } from '../../actions';
import RefreshLoad from '../../components/refreshload';

class MallMore extends React.Component {
  static contextTypes = {
    intl: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.onTagClick = ::this.onTagClick;
    this.onPostClick = ::this.onPostClick;
    this.pullUpCallBack = ::this.pullUpCallBack;
    this.pullDownCallBack = ::this.pullDownCallBack;
    this.state = { key: 0, percent: '100%', moreKey: 0 };
  }

  componentDidMount() {
    const { actions, morePageInfo, params } = this.props;
    actions.fetchMallMoreClassifications().then(() => {
      // eslink_disabled_next_line
      if (morePageInfo.id === '') {
        actions.setActiveClassification(params.classification_id, '');
      }
      actions.fetchMallMoreProducts().then(() => {
        this.setState({
          key: Math.random(),
          moreKey: Math.random(),
        });
      });
      this.onReszie();
    });
  }

  async componentWillReceiveProps({ params: newParams }) {
    const oldParams = this.props.params;
    const actions = this.props.actions;
    const { classification_id: newId } = newParams;
    const { classification_id: oldId } = oldParams;
    if (newId && newId !== oldId) {
      actions.setActiveClassification(newId, '');
      await actions.fetchMallMoreProducts();
      this.setState({ key: Math.random(), moreKey: Math.random() }, this.onReszie);
    }
  }

  onTagClick(id) {
    const { actions } = this.props;
    actions.setActiveClassification(id, '');
    actions.fetchMallMoreProducts().then(() => {
      this.onReszie();
    });
  }

  onReszie() {
    const head = this.header.getBoundingClientRect();
    const wrap = this.wraper.getBoundingClientRect();
    this.area.height = wrap.height - head.height;
    const percent = `${((this.area.height / wrap.height) * 100)}%`;
    // eslink_disabled_next_line
    this.setState({ percent }, () => this.refer.refresh());
  }

  onPostClick(postId) {
    const { actions, morePageInfo } = this.props;
    actions.setActiveClassification(morePageInfo.id, postId);
    actions.fetchMallMoreProducts().then(() => {
      this.onReszie();
    });
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.mall.mallHomeTitle'],
    });
  }

  pullUpCallBack(cb) {
    const { actions } = this.props;
    actions.setMallMoreNextPage();
    actions.fetchMallMoreProducts().then(cb);
  }

  pullDownCallBack(cb) {
    const { actions } = this.props;
    actions.resetMallMorePageinfo();
    actions.fetchMallMoreProducts().then(cb);
  }

  render() {
    this.setNavBar();
    const { classifications, morePageInfo, moreProductList } = this.props;
    return (
      <div style={{ height: '100%' }} ref={ref => (this.wraper = ref)}>
        <div className="mall-more" ref={ref => (this.header = ref)} key={this.state.moreKey}>
          <MoreHeader
            classificationPosts={classifications}
            currentClassificationId={morePageInfo.id}
            currentPostId={morePageInfo.postId}
            onPostClick={this.onPostClick}
            onTagClick={this.onTagClick}
          />
        </div>
        <div className="mall-more" ref={ref => (this.area = ref)} style={{ height: this.state.percent }}>
          <RefreshLoad
            relative
            needPullUp={!morePageInfo.end}
            pullUpCallBack={this.pullUpCallBack}
            pullDownCallBack={this.pullDownCallBack}
            key={this.state.key}
            ref={ref => (this.refer = ref)}
          >
            <MoreProducts products={moreProductList} />
          </RefreshLoad>
        </div>
      </div>
    );
  }

}

MallMore.propTypes = {
  morePageInfo: React.PropTypes.shape({}),
  moreProductList: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  classifications: React.PropTypes.arrayOf(React.PropTypes.shape({})),
  actions: React.PropTypes.shape({}),
  params: React.PropTypes.shape({}),
};
//
// export  default  MallMore;


export default connect(state => (
  {
    morePageInfo: state.mall.morePageInfo || {},
    moreProductList: state.mall.moreProductList || [],
    classifications: state.mall.classifications || [],
  }
), dispatch => (
  {
    actions: bindActionCreators(mallActions, dispatch),
  }
))(MallMore);
