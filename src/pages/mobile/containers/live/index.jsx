import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import * as selectors from 'dxSelectors/trainingLive';
import * as trainingLiveActions from 'dxActions/live';
import withAuth from 'hocs/withAuth';
import api from 'utils/api';
import Toast from 'components/modal/toast';
import {
  FETCHING_RECORDING,
  WITHOUT_RECORDING,
  HAS_RECORDING,

  NOT_START,
  ABOUT_TO_START,
  ON_LIVE,
  OVER,
} from 'dxConstants/live-type';
import openLink from 'utils/open-link';
import {
  getLiveSubscriptionSMSCode,
  verifySMSCodeLiveSubscribed,
} from '../../apis.js';
import SMSConfirm from '../../components/SMSConfirm';

import Loading from '../../components/loading';
import BasicLiveContainer from './BasicContainer';

import './style.styl';
import messages from './messages';

function transformToBasicLive(live) {
  return {
    cover: live.img,
    lecturer: live.lecture,
    name: live.name,
    beginTime: live.time,
    description: live.description,
    price: live.price,
    tags: live.labels,
    status: live.status,
    type: live.type,
    vacancyNum: live.rest_count,
    seatNum: live.max_participants,
    free: live.price === 0,
  };
}

class LiveContainer extends Component {
  constructor() {
    super();
    this.state = {
      initialized: false,
      isFetching: false,
      openSMSConfirm: true,
      openSMSDisabledAlert: false,
      basicLive: null,
      liveRoomURL: null,
      liveRecordURL: null,
      showToast: false,
      toastMessageId: messages.subscribed.id,
    };
  }

  async componentDidMount() {
    const { actions, liveId } = this.props;
    await actions.fetchTrainingLive(liveId);
    this.setState({ initialized: true }); // eslint-disable-line react/no-did-mount-set-state
  }

  onRequestCode = (phone) => {
    getLiveSubscriptionSMSCode(phone);
  };

  onLiveSubscribed = () => {
    const { actions, liveId } = this.props;
    this.closeSMSConfirm();
    this.openSubscriptionSuccessfulToast();
    actions.fetchTrainingLive(liveId);
  };

  // eslint-disable-next-line arrow-parens
  verifySMSCode = async(phone, code) => {
    try {
      await verifySMSCodeLiveSubscribed({ code, phone, liveId: this.props.liveId });
    } catch (e) {
      return false;
    }
    return true;
  };

  openSMSConfirm = () => {
    this.SMSConfirm.open();
  };

  closeSMSConfirm = () => {
    this.SMSConfirm.close();
  };

  openDisabledSubscriptionToast = () => {
//    this.setState({ showToast: true, toastMessageId: messages. });
  };

  openNoSeatToast = () => this.setState({
    showToast: true,
    toastMessageId: messages.noSeat,
  }, () => setTimeout(this.closeToast, 2000));

  openSubscriptionSuccessfulToast = () => this.setState({
    showToast: true,
    toastMessageId: messages.subscribed.id,
  }, () => setTimeout(this.closeToast, 2000));
  closeToast = () => this.setState({ showToast: false });

  enterLiveRoom = () => {
    const live = this.props.live;
    const withoutVacancy = live.rest_count === 0;
    const isFreeOpenCourse = live.type !== 'meeting' && live.price === 0;
    if (withoutVacancy && isFreeOpenCourse) {
      this.openNoSeatToast();
      return;
    }
    const liveRoomURL = this.state.liveRoomURL;
    if (!liveRoomURL) return;
    openLink(liveRoomURL);
    this.refreshLiveRoomURL();
  };

  enterReplayRoom = () => {
    const liveRecordURL = this.state.liveRecordURL;
    if (!liveRecordURL) return;
    openLink(liveRecordURL);
    this.refreshRecordURL();
  };

  refreshLiveRoomURL = () => {
    const liveId = this.props.liveId;
    api.get(`/training/live/${liveId}/url-h5`)
       .then(({ data }) => this.setState({ liveRoomURL: data.room_url }));
  };

  refreshRecordURL = () => {
    const liveId = this.props.liveId;
    api.get(`/training/live/${liveId}/record-h5`)
       .then(({ data }) => this.setState({ liveRecordURL: data.record_urls[0] }));
  };

  renderFooterWithLiveNotStart = () => {
    const {
      time: beginTime,
      has_notification: subscribed,
    } = this.props.live;
    let smsButtonAttr;
    let smsButtonClass;
    let smsButtonMessage;

    if (!subscribed) {
      const isBefore30Min = moment().add(30, 'minutes').isBefore(beginTime);
      if (isBefore30Min) { // 尚未订阅且在直播开始30分钟之前
        smsButtonAttr = { onClick: this.openSMSConfirm };
        smsButtonClass = 'button sms';
      } else { // 尚未订阅但直播即将开始
        smsButtonAttr = { onClick: this.openDisabledSubscriptionToast };
        smsButtonClass = 'button sms disabled';
      }
      smsButtonMessage = <FormattedMessage {...messages.sms} />;
    } else { // 已经订阅
      smsButtonAttr = {};
      smsButtonClass = 'button sms disabled';
      smsButtonMessage = <FormattedMessage {...messages.alerted} />;
    }
    return [
      <div key="sms1" {...smsButtonAttr} className={smsButtonClass}>{smsButtonMessage}</div>,
      <div key="enter1" className="button enter disabled"><FormattedMessage {...messages.enter} />
      </div>,
    ];
  };

  renderFooterWithAboutToStart = () => {
    const { has_notification: subscribed } = this.props.live;
    let smsButtonMessage;

    if (subscribed) smsButtonMessage = <FormattedMessage {...messages.alerted} />;
    else smsButtonMessage = <FormattedMessage {...messages.sms} />;

    return [
      <div key="sms_about_to_start" className="button sms disabled">{smsButtonMessage}</div>,
      <div key="enter_about_to_start" className="button enter disabled">
        <FormattedMessage {...messages.enter} />
      </div>,
    ];
  };

  renderFooterWithOnLive = () => {
    const live = this.props.live;
    const subscribed = live.has_notification;
    const liveRoomURL = this.state.liveRoomURL;
    if (!liveRoomURL) this.refreshLiveRoomURL();
    let smsButtonClass;
    let smsButtonMessage;
    if (subscribed) {
      smsButtonClass = classnames('button sms', { disabled: liveRoomURL });
      smsButtonMessage = <FormattedMessage {...messages.alerted} />;
    } else {
      smsButtonClass = 'button sms disabled';
      smsButtonMessage = <FormattedMessage {...messages.sms} />;
    }
    let enterButtonClass = 'button enter ';
    const withoutVacancy = live.rest_count === 0;
    const isFreeOpenCourse = live.type !== 'meeting' && live.price === 0;
    // 没有空位的免费直播就别想进去啦
    if (withoutVacancy && isFreeOpenCourse) enterButtonClass += 'disabled';

    return [
      <div key="sms2" className={smsButtonClass}>{smsButtonMessage}</div>,
      <div
        key="enter2"
        className={enterButtonClass}
        onClick={this.enterLiveRoom}
      >
        <FormattedMessage {...messages.enter} />
      </div>,
    ];
  };

  renderFooterWithLiveOver = () => {
    const recordStatus = this.props.live.has_record;
    const liveRecordURL = this.state.liveRecordURL;
    let recordI18nMessageId;
    let disabled = true;

    if (recordStatus === HAS_RECORDING) {
      recordI18nMessageId = 'ready';
      disabled = true;
      if (!liveRecordURL) this.refreshRecordURL();
    }
    if (recordStatus === FETCHING_RECORDING) {
      recordI18nMessageId = 'fetching';
    }
    if (recordStatus === WITHOUT_RECORDING) {
      recordI18nMessageId = 'without';
    }
    const className = disabled ? 'disabled button button-primary' : 'button button-primary';
    return (
      <div className={className} onClick={this.enterReplayRoom}>
        <FormattedMessage id={`app.live.footer.record.${recordI18nMessageId}`} />
      </div>
    );
  };

  renderFooter = () => {
    const status = this.props.live.status;
    let footerButtonGroup;
    if (status === NOT_START) {
      footerButtonGroup = this.renderFooterWithLiveNotStart();
    } else if (status === ABOUT_TO_START) {
      footerButtonGroup = this.renderFooterWithAboutToStart();
    } else if (status === ON_LIVE) {
      footerButtonGroup = this.renderFooterWithOnLive();
    } else if (status === OVER) {
      footerButtonGroup = this.renderFooterWithLiveOver();
    }

    return (
      <div className="dx-footer">
        {footerButtonGroup}
      </div>
    );
  };

  render() {
    if (!this.state.initialized || this.state.isFetching) {
      return <Loading />;
    }
    const { live } = this.props;
    return (
      <div className="live">
        <BasicLiveContainer {...transformToBasicLive(live)} />
        {this.renderFooter()}
        <SMSConfirm
          ref={(ref) => { this.SMSConfirm = ref; }}
          defaultPhone={this.props.userPhone}
          onRequestCode={this.onRequestCode}
          verify={this.verifySMSCode}
          onVerified={this.onLiveSubscribed}
        >
          <FormattedMessage {...messages.smsTip} />
        </SMSConfirm>
        <Toast isOpen={this.state.showToast}>
          <FormattedMessage id={this.state.toastMessageId} />
        </Toast>
      </div>
    );
  }
}

const { string, shape, func } = React.PropTypes;
LiveContainer.propTypes = {
  liveId: string,
  actions: shape({ fetchTrainingLive: func }),
  live: shape({}),
  userPhone: string,
};

const mapStateToProps = (state, { params }) => ({
  liveId: params.id,
  live: selectors.trainingLiveSelector(state),
  userPhone: state.account.user.telephone,
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(trainingLiveActions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuth
)(LiveContainer);
