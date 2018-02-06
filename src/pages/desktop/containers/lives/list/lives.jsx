import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { live as liveActions } from '../../../actions';
import DxHeader from '../../../components/header';
import DxFooter from '../../../components/footer';
import Card from '../../../components/card';
import Loading from '../../../components/loading';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';

import title from './img/plansTitle.png';
import empty from './img/empty.png';

const propTypes = {
  actions: PropTypes.object.isRequired,
  meeting: PropTypes.array.isRequired,
  publics: PropTypes.array.isRequired,
  OwnPurchase: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  active: PropTypes.string.isRequired,
  meetingEnd: PropTypes.bool.isRequired,
  publicsEnd: PropTypes.bool.isRequired,
  ownBuyEnd: PropTypes.bool.isRequired,
};
// meeting  public  OwnPurchase
class Lives extends Component {
  constructor(props) {
    super(props);
    this.btnShow = false;
    this.tab = this.tab.bind(this);
    this.outPut = this.outPut.bind(this);
    this.linkTo = this.linkTo.bind(this);
    this.getData = this.getData.bind(this);
  }
  componentWillMount() {
    const { actions } = this.props;
    actions.fetchNew();
  }
  componentDidMount() {
    const { actions, active } = this.props;
    const self = this;
    let fetchPromise = null;
    // 激活tab
    actions.fetchActive('meeting');
    // 按状态调用数据
    switch (active) {
      case 'meeting':
        fetchPromise = actions.fetchMeetingLive(1, 20);
        break;
      case 'publics':
        fetchPromise = actions.fetchPublicsLive(1, 20);
        break;
      case 'ownPurchase':
        fetchPromise = actions.fetchOwnPurchaseLive(1, 20);
        break;
      default:
        break;
    }
    // 回调
    fetchPromise.then(() => {
      // 重设初始化
      self.initUnfinish = false;
      self.initFinish = true;
    });
  }
  tab(i) {
    const {
      actions, meeting, publics, OwnPurchase, meetingEnd, publicsEnd, ownBuyEnd, isFetching,
    } = this.props;
    // 判断tab
    actions.fetchActive(i);
    switch (i) {
      case 'meeting': // 企业会议
        if (meetingEnd !== true && isFetching === false) {
          if (meeting.length < 1) {
            actions.fetchMeetingLive(1, 20).then(() => {
              this.initAll = true;
            });
          }
        }
        break;
      case 'publics': // 公开课
        if (publicsEnd !== true && isFetching === false) {
          if (publics.length < 1) {
            actions.fetchPublicsLive(1, 20).then(() => {
              this.initRequire = true;
            });
          }
        }
        break;
      case 'ownPurchase': // 自购
        if (ownBuyEnd !== true && isFetching === false) {
          if (OwnPurchase.length < 1) {
            actions.fetchOwnPurchaseLive(1, 20).then(() => {
              this.initElective = true;
            });
          }
        }
        break;
      default:
        break;
    }
  }
  getData() {
    const { actions, active, meetingEnd, publicsEnd, ownBuyEnd, isFetching } = this.props;
    switch (active) {
      case 'meeting':
        if (meetingEnd !== true && isFetching === false) {
          actions.fetchMeetingLive(0, 20);
        }
        break;
      case 'publics':
        if (publicsEnd !== true && isFetching === false) {
          actions.fetchPublicsLive(0, 20);
        }
        break;
      case 'ownPurchase':
        if (ownBuyEnd !== true && isFetching === false) {
          actions.fetchOwnPurchaseLive(0, 20);
        }
        break;
      default:
        break;
    }
  }
  linkTo(item) {
    // const temp = item;
    // if (!item.plan) {
    //   temp.plan = { id: 0 };
    // }
    // const type = item.item_type || item.type;
    const id = item.id;
    return `/lives/${id}`;
  }
  outPut(data) {
    const { active } = this.props;
    if (data.length !== 0) {
      this.btnShow = true;
      return (
        <div className="listBox">
          {
           data.map((p, i) => (
              <Card
                key={`${i}-${p.id}`}
                type="live"
                img={p.img}
                name={p.name}
                to={this.linkTo(p)}
                beginTime={p.begin_time}
                liveStatus={p.status}
                style={((i + 1) % 5) ? null : { marginRight: 0 }}
              />
            ))
          }
        </div>
      );
    } else {
      this.btnShow = false;
    }
    return (
      <div className="empty">
        <img src={empty} />
        <a><FormattedMessage {...messages.NO} /></a>
      </div>
    );
  }
  render() {
    const {
      meeting, publics, OwnPurchase,
      meetingEnd, publicsEnd, ownBuyEnd, active, isFetching,
    } = this.props;
    let btn = false;
    const allClass = (active === 'meeting') ? 'navTab active' : 'navTab';
    const requiredClass = (active === 'publics') ? 'navTab active' : 'navTab';
    const minorsClass = (active === 'ownPurchase') ? 'navTab active' : 'navTab';
    switch (active) {
      case 'meeting':
        btn = (meetingEnd === false ? true : false);
        break;
      case 'publics':
        btn = (publicsEnd === false ? true : false);
        break;
      case 'ownPurchase':
        btn = (ownBuyEnd === false ? true : false);
        break;
      default:
        btn = false;
        break;
    }
    return (
      <div>
        <Loading
          isShow={isFetching}
        />
        <DxHeader />
        <div className="navList">
          <div className="nav">
            <div className="navTitle">
              <img src={title} alt="多学" />
              <p><FormattedMessage {...messages.myLearn} /></p>
            </div>
            <div className={allClass} onClick={() => this.tab('meeting')}><FormattedMessage {...messages.meeting} /></div>
            <div className={requiredClass} onClick={() => this.tab('publics')}><FormattedMessage {...messages.publics} /></div>
            <div className={minorsClass} onClick={() => this.tab('ownPurchase')}><FormattedMessage {...messages.OwnPurchase} /></div>
          </div>
        </div>
        {active === 'meeting' ? this.outPut(meeting) : (active === 'publics' ? this.outPut(publics) : this.outPut(OwnPurchase))}
        <div className="clickMore">
          {this.btnShow ? btn ? <div className="clickMoreBtn" onClick={this.getData}><FormattedMessage {...messages.more} /></div> : <div className="clickMoreBtn"><FormattedMessage {...messages.noMore} /></div> : ''}
        </div>
        <DxFooter />
      </div>
    );
  }
}

Lives.propTypes = propTypes;

export default connect(state => ({
  meeting: state.live.meeting || [],
  publics: state.live.publics || [],
  OwnPurchase: state.live.ownPurchase || [],
  isFetching: state.live.isFetching || false,
  active: state.live.active || 'meeting',
  meetingEnd: state.live.meetingEnd || false,
  publicsEnd: state.live.publicsEnd || false,
  ownBuyEnd: state.live.ownBuyEnd || false,
}), dispatch => ({
  actions: bindActionCreators(liveActions, dispatch),
}
))(Lives);

