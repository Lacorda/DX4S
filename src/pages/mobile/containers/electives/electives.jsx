import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { nav } from 'utils/dx';

import { electives as electivesActions } from '../../actions';
import messages from './messages';
import noMessage from './img/noMessage.png';
import RefreshLoad from '../../components/refreshload';

const propTypes = {
  actions: PropTypes.object.isRequired,
  news: PropTypes.array.isRequired,
  hot: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  active: PropTypes.string.isRequired,
  lastUpdatedHot: PropTypes.bool.isRequired,
  lastUpdatedNew: PropTypes.bool.isRequired,
};

const contextTypes = {
  intl: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired,
};

class Electives extends Component {
  constructor(props, context) {
    super(props, context);
    this.listScroll = this.listScroll.bind(this);
    this.tab = this.tab.bind(this);
    this.initNew = true;
    this.initHot = false;
    this.setNavBar = this.setNavBar.bind(this);
    this.pullDownCallback = this.pullDownCallback.bind(this);
    this.pullUpCallBack = this.pullUpCallBack.bind(this);
    this.state = {
      key: 0,
    };
  }


  componentDidMount() {
    const self = this;
    const { actions } = self.props;
    actions.fetchActive('new');
    actions.fetchRefreshNew().then(() => {
      const rndNum = Math.random();
      self.setState({ key: rndNum });
    });
    actions.fetchRefreshHot();
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.elective.title'],
    });
  }

  pullDownCallback(cb) {
    const { actions, active } = this.props;
    if (active === 'new') {
      actions.fetchRefreshNew().then(() => {
        cb();
      });
    } else {
      actions.fetchRefreshHot().then(() => {
        cb();
      });
    }
  }

  pullUpCallBack(cb) {
    this.listScroll(cb);
  }

  tab(i) {
    const { actions, news, hot, lastUpdatedHot, lastUpdatedNew, isFetching } = this.props;
    if (i === 'new' && this.initNew === false) {
      this.initNew = true;
      this.initHot = false;
      actions.fetchActive('new');
      if (news.length < 1 && lastUpdatedNew !== true && isFetching === false) {
        actions.fetchNewElectives();
      }
    } else if (i === 'hot' && this.initHot === false) {
      this.initNew = false;
      this.initHot = true;
      actions.fetchActive('hot');
      if (hot.length < 1 && lastUpdatedHot !== true && isFetching === false) {
        actions.fetchHotElectives();
      }
    }
    const rndNum = Math.random();
    this.setState({ key: rndNum });
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.elective.title'],
    });
  }

  listScroll(callback) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const windowHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const { actions, active, lastUpdatedHot, lastUpdatedNew, isFetching } = this.props;
    if ((scrollTop + clientHeight) > (windowHeight - 20)) {
      if (active === 'new' && lastUpdatedNew !== true && isFetching === false) {
        actions.fetchNewElectives().then(() => {
          if (callback) callback();

        });
      } else if (active === 'hot' && lastUpdatedHot !== true && isFetching === false) {
        actions.fetchHotElectives().then(() => {
          if (callback) callback();
        });
      }
    }
  }

  outPut(list) {
    const { isFetching } = this.props;
    if (list.length > 0) {
      return (
        <ul id="electivesUl" className="card card-horizontal">
          {list.map((item, index) => {
            let iconFont;
            let linkTo = '';
            let iconBg;
            switch (item.type) {
              case 'course':
                iconFont = <FormattedMessage {...messages.mini} />;
                linkTo = `/plan/${item.plan.id}/series/${item.solution_id || 0}/courses/${item.id}`;
                iconBg = 'type-icon';
                break;
              case 'exam':
                iconFont = <FormattedMessage {...messages.exam} />;
                linkTo = `/plan/${item.plan.id}/series/${item.solution_id || 0}/exams/${item.id}`;
                iconBg = 'type-icon icon-bg-exam';
                break;
              case 'trainingClass':
                iconFont = <FormattedMessage {...messages.trainingClass} />;
                iconBg = 'type-icon icon-bg-trainingClass';
                break;
              case 'solution':
                iconFont = <FormattedMessage {...messages.solution} />;
                linkTo = `plan/${item.plan.id}/series/${item.id}`;
                iconBg = 'type-icon icon-bg-solution';
                break;
              default:
            }
            return (
              <li
                key={`${item.id}_${index}`}
                onClick={() => {
                  const path = linkTo;
                  this.context.router.push(path);
                }}
              >
                <div className="card-img">
                  <Link to={linkTo}>
                    <img alt={item.name} src={item.thumbnail_url} />
                    {
                      item.type != 'course' ? <span className={iconBg}>{iconFont}</span> : null
                    }
                  </Link>
                </div>
                <div className="card-text electivesText">
                  <p><Link to={linkTo}>{item.name}</Link></p>
                </div>
              </li>
            );
          })
          }
        </ul>
      );
    } else if (isFetching === false && list.length === 0) {
      return (
        <div className="noMessage">
          <img alt="electivesImg" src={noMessage} />
          <p><FormattedMessage {...messages.emptyFont} /></p>
        </div>
      );
    }
    return null;
  }

  render() {
    const { news, hot, isFetching, active, lastUpdatedHot, lastUpdatedNew } = this.props;
    const newClass = (active === 'new') ? 'active newSelect' : 'new';
    const hotClass = (active === 'hot') ? 'active hotSelect' : 'hot';
    const loadingNewShow = news.length > 0 ? 'block' : 'none';
    const loadingHotShow = hot.length > 0 ? 'block' : 'none';
    let loadingNew;
    let loadingHot;
    this.setNavBar();
    if (lastUpdatedNew === true) {
      loadingNew = <FormattedMessage {...messages.noMore} />;
    } else if (isFetching === true) {
      loadingNew = <FormattedMessage {...messages.loding} />;
    } else {
      loadingNew = '';
    }
    if (lastUpdatedHot === true) {
      loadingHot = <FormattedMessage {...messages.noMore} />;
    } else if (isFetching === true) {
      loadingHot = <FormattedMessage {...messages.loding} />;
    } else {
      loadingHot = '';
    }


    let needPullUp = true;
    if (active === 'new') {
      needPullUp = !lastUpdatedNew;
      if (news.length < 10) needPullUp = false;
    } else {
      needPullUp = !lastUpdatedHot;
      if (hot.length < 10) needPullUp = false;
    }

    return (
      <div id="electives" key={this.state.key}>
        <ul className="tab">
          <li>
            <span
              className={newClass}
              onClick={() => this.tab('new')}
            >
              <FormattedMessage {...messages.electiveNew} />
            </span>
          </li>
          <li>
            <span
              className={hotClass}
              onClick={() => this.tab('hot')}
            ><FormattedMessage {...messages.electiveHot} />
            </span>
          </li>
        </ul>
        <RefreshLoad
          isSpecial={true}
          needPullUp={needPullUp}
          pullDownCallBack={this.pullDownCallback}
          pullUpCallBack={this.pullUpCallBack}
        >
          {this.props.active === 'new' ? this.outPut(news) : this.outPut(hot)}
          <p
            className="loading"
            style={{
              display: active === 'new'
                ? loadingNewShow
                : loadingHotShow,
            }}
          >{active === 'new' ? loadingNew : loadingHot}</p>
        </RefreshLoad>
      </div>
    );
  }
}

Electives.propTypes = propTypes;
Electives.contextTypes = contextTypes;

export default connect(state => (
  {
    news: state.electives.new || [],
    hot: state.electives.hot || [],
    isFetching: state.electives.isFetching || false,
    active: state.electives.active || 'new',
    lastUpdatedHot: state.electives.lastUpdatedHot || false,
    lastUpdatedNew: state.electives.lastUpdatedNew || false,
  }
), dispatch => (
  {
    actions: bindActionCreators(electivesActions, dispatch),
  }
))(Electives);
