import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { electives as electivesActions } from '../../actions';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import Card from '../../components/card';
import Loading from '../../components/loading';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import title from './img/plansTitle.png';
import empty from './img/empty.png';

const propTypes = {
  actions: PropTypes.object.isRequired,
  news: PropTypes.array.isRequired,
  hot: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  active: PropTypes.string.isRequired,
  lastUpdatedHot: PropTypes.bool.isRequired,
  lastUpdatedNew: PropTypes.bool.isRequired,
};

class Electives extends Component {
  constructor(props, context) {
    super(props, context);
    this.initNew = true;
    this.initHot = false;
    this.btnShow = false;
    this.tab = this.tab.bind(this);
    this.outPut = this.outPut.bind(this);
    this.linkTo = this.linkTo.bind(this);
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    const self = this;
    const { actions, news } = self.props;
    actions.fetchActive('new');
    if (news.length < 1) actions.fetchNewElectives(20);
  }
  tab(i) {
    const { actions, news, hot, lastUpdatedHot, lastUpdatedNew, isFetching } = this.props;
    if (i === 'new' && this.initNew === false) {
      this.initNew = true;
      this.initHot = false;
      actions.fetchActive('new');
      if (news.length < 1 && lastUpdatedNew !== true && isFetching === false) {
        actions.fetchNewElectives(20);
      }
    } else if (i === 'hot' && this.initHot === false) {
      this.initNew = false;
      this.initHot = true;
      actions.fetchActive('hot');
      if (hot.length < 1 && lastUpdatedHot !== true && isFetching === false) {
        actions.fetchHotElectives(20);
      }
    }
  }
  linkTo(item) {
    const temp = item;
    if (!item.plan) {
      temp.plan = { id: 0 };
    }
    const type = item.item_type || item.type;
    const id = item.item_id || item.id;
    const pid = temp.plan.id;
    switch (type) {
      case 'course':
        return `/plan/${pid}/series/0/courses/${id}`;    // todo 链接修改：跳转到在线课程详情
      case 'solution':
        return `/plan/${pid}/series/${id}`;              // todo 链接修改：跳转到系列课详情
      case 'exam':
        return `/plan/${pid}/series/0/exams/${id}`;      // todo 链接修改：跳转到考试详情
      default:
        return null;
    }
  }
  getData() {
    const { actions, active, lastUpdatedHot, lastUpdatedNew, isFetching } = this.props;
    switch (active) {
      case 'hot':
        if (lastUpdatedHot !== true && isFetching === false) {
          actions.fetchHotElectives(20);
        }
        break;
      case 'new':
        if (lastUpdatedNew !== true && isFetching === false) {
          actions.fetchNewElectives(20);
        }
        break;
      default:
        break;
    }
  }
  outPut(data) {
    if (data.length !== 0) {
      this.btnShow = true;
      return (
        <div className="listBox">
          {
           data.map((p, i) => (
              <Card
                key={`${i}-${p.id}`}
                type={p.type}
                img={p.thumbnail_url}
                name={p.name}
                to={this.linkTo(p)}
                style={((i + 1) % 5) ? null : { marginRight: 0 }}
              />
            ))
          }
        </div>
      );
    }
    return (
      <div className="empty">
        <img src={empty} />
        <a><FormattedMessage {...messages.courses} /></a>
      </div>
    );
  }
  render() {
    const { news, hot, active, lastUpdatedHot, lastUpdatedNew, isFetching } = this.props;
    let btn = false;
    const hotClass = (active === 'hot') ? 'navTab active' : 'navTab';
    const newClass = (active === 'new') ? 'navTab active' : 'navTab';
    switch (active) {
      case 'hot':
        btn = (lastUpdatedHot === false ? true : false);
        break;
      case 'new':
        btn = (lastUpdatedNew === false ? true : false);
        break;
      default:
        btn = false;
        break;
    }
    return (
      <div>
        <DxHeader />
        <Loading
          isShow={isFetching}
        />
        <div className="navList">
          <div className="nav">
            <div className="navTitle">
              <img src={title} alt="多学" />
              <p><FormattedMessage {...messages.myElectives} /></p>
            </div>
            <div className={newClass} onClick={() => this.tab('new')}><FormattedMessage {...messages.new} /></div>
            <div className={hotClass} onClick={() => this.tab('hot')}><FormattedMessage {...messages.hottes} /></div>
          </div>
        </div>
        {this.props.active === 'new' ? this.outPut(news) : this.outPut(hot)}
        <div className="clickMore">
          {this.btnShow ? btn ? <div className="clickMoreBtn" onClick={this.getData}><FormattedMessage {...messages.clickMore} /></div> : <div className="clickMoreBtn"><FormattedMessage {...messages.noMore} /></div> : ''}
        </div>
        <DxFooter />
      </div>
    );
  }
}

Electives.propTypes = propTypes;

export default connect(state => (
  {
    news: state.electives.new || [],
    hot: state.electives.hot || [],
    isFetching: state.electives.isFetching || false,
    active: state.electives.active || 'new',
    lastUpdatedHot: state.electives.lastUpdatedHot || false,  // true即表示已经加载完
    lastUpdatedNew: state.electives.lastUpdatedNew || false,  // true即表示已经加载完
  }
), dispatch => (
  {
    actions: bindActionCreators(electivesActions, dispatch),
  }
))(Electives);
