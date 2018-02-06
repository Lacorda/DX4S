import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';

import RefreshLoad from '../../components/refreshload';
import Pulltext from '../../../../components/pulltext';
import { search as searchActions } from '../../actions';

import messages from './messages';
import Query from './query';
import Filter from './filter';
import Slide from './slide';
import List from './list';

import './search.styl';

import none from './img/none.png';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  page: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

class Search extends React.Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(...args) {
    super(...args);
    this.onFetch = ::this.onFetch;
    this.onShowSlide = ::this.onShowSlide;
    this.pullUpCallBack = ::this.pullUpCallBack;
    this.pullDownCallBack = ::this.pullDownCallBack;
    this.params = {
      keyword: '',
      sort_field: 'general',
      sort_order: 'desc',
      type: '',
    };
    this.state = {
      display: false, // 遮罩
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.fetchSearch().then(() => {
      this.listBox.refresh();
    });
    setNav(this.context.intl.messages['app.search.title']);
  }

  onFetch(args) {
    const { actions } = this.props;
    this.params = { ...this.params, ...args };
    actions.resetSearch();
    actions.fetchSearch(this.params).then(() => {
      this.listBox.refresh();
    });
    this.setState({ display: false });
  }

  onShowSlide() {
    this.setState({ display: true });
  }

  pullDownCallBack(cb) {
    const { actions } = this.props;
    actions.resetSearch();
    actions.fetchSearch(this.params).then(cb);
  }

  pullUpCallBack(cb) {
    const { actions } = this.props;
    actions.nextSearch();
    actions.fetchSearch(this.params).then(cb);
  }

  render() {
    const { page, items } = this.props;
    return (
      <div className="search" style={{ heigth: '100%' }} >
        <Query onFetch={this.onFetch} />
        <Filter
          onFetch={this.onFetch}
          onShowSlide={this.onShowSlide}
          selected={!!this.params.type}
        />
        { items.length
          ? <RefreshLoad
            absolute
            className="search-list"
            needPullDown
            needPullUp={!page.end}
            pullDownCallBack={this.pullDownCallBack}
            pullUpCallBack={this.pullUpCallBack}
            ref={(ref) => { this.listBox = ref; }}
          >
            <List items={items} />
            {page.end && <Pulltext isMore={false} />}
          </RefreshLoad>
          : <div style={{ textAlign: 'center' }}>
            <img src={none} alt="" />
            <div style={{ color: '#ccc' }}><FormattedMessage {...messages.noneData} /></div>
          </div>
        }
        <Slide onFetch={this.onFetch} display={this.state.display} />
      </div>
    );
  }
}

Search.propTypes = propTypes;

const mapStateToProps = state => ({
  items: state.search.items || [],
  page: state.search.page || {},
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(searchActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
