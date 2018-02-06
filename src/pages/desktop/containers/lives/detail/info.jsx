import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import openLink from 'utils/open-link';
import {
  LIVE,
  MEETING,
  OPEN,
  NOT_START,
  ABOUT_TO_START,
  ON_LIVE,
  OVER,
  FETCHING_RECORDING,
  HAS_RECORDING,
  WITHOUT_RECORDING,
  CAN_SMS,
  CAN_NOT_SMS,
  HAS_NOTIFICATION,
} from 'dxConstants/live-type';
import Errors from './errors.jsx';
import Confirm from '../../../components/confirm';
import { live as liveActions } from '../../../actions';
import './styles.styl';

import phoneIcon from './img/icon_phone.png';
import codeIcon from './img/icon_code.png';

function checkPhone(phone) {
  if (!(/^1[34578]\d{9}$/.test(phone))) {
    return false;
  }
  return true;
}

const propTypes = {
  actions: PropTypes.object.isRequired,
  fetchParams: PropTypes.object.isRequired,
  trainingLive: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired,
  getCode: PropTypes.bool.isRequired,
  hasNotification: PropTypes.bool.isRequired,
  recordUrl: PropTypes.object.isRequired,
};

class Info extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      isConfirmOpen: false,
      isErrorShow: false,
      errorContent: '手机号码格式不正确',
      hasInitPhone: false,
      phone: '',
      code: '',
      hasSend: false,
      countdown: 60,
      phoneInput: '',
      isCountdownShow: false,
    };
    this.liveType = {
      [LIVE]: '直播公开课',
      [MEETING]: '企业会议',
      [OPEN]: '直播公开课',
    };
    this.intervalID = '';
    this.intervalCB = ::this.intervalCB;
    this.didPhoneInit = false;
    this.onCancel = ::this.onCancel;
    this.onConfrim = ::this.onConfrim;
    this.onConfrimClose = ::this.onConfrimClose;
    this.onConfrimOpen = ::this.onConfrimOpen;
    this.handlePhoneChange = ::this.handlePhoneChange;
    this.handleCodeChange = ::this.handleCodeChange;
    this.getCode = ::this.getCode;
    this.onStudy = ::this.onStudy;
    this.onSMS = ::this.onSMS;
    this.onPlayback = ::this.onPlayback;
    this.notification = ::this.notification;
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchTrainingLive(fetchParams.liveId);
    document.body.scrollTop = 0;
  }

  componentWillReceiveProps(nextProps) {
    const {
      user: { telephone },
      url: { room_url: roomUrl },
      getCode,
      recordUrl: { record_urls: recordUrls },
    } = nextProps;
    if (!this.didPhoneInit && telephone) {
      this.didPhoneInit = true;
      this.phoneInput.value = telephone;
      this.setState({ hasInitPhone: true, phone: telephone });
    }
    if (roomUrl) {
      openLink(roomUrl);
    }
    if (getCode) {
      clearInterval(this.intervalID);
      this.setState({
        countdown: 60,
        isCountdownShow: true,
      });
      this.intervalID = setInterval(this.intervalCB, 1000);
    }
    if (recordUrls && recordUrls.length) {
      window.location.href = recordUrls[0];
    }
  }

  onConfrimClose() {
    this.setState({ isConfirmOpen: false });
  }

  onConfrimOpen() {
    this.setState({ isConfirmOpen: true });
  }

  onCancel() {
    this.onConfrimClose();
  }

  onConfrim() {
    this.notification();
  }

  onStudy() {
    const { fetchParams, actions } = this.props;
    actions.fetchLiveUrl(fetchParams.liveId);
  }

  onPlayback() {
    const { fetchParams, actions } = this.props;
    actions.fetchRecordUrl(fetchParams.liveId);
  }

  onSMS() {
    this.onConfrimOpen();
  }

  getCode() {
    const { actions } = this.props;
    const { phone } = this.state;
    if (checkPhone(phone)) {
      this.setState({ isErrorShow: false });
      actions.fetchCode(phone);
      return;
    }
    this.setState({
      isErrorShow: true,
      errorContent: '手机号码格式不正确',
    });
  }

  intervalCB() {
    if (this.state.countdown === 0) {
      clearInterval(this.intervalID);
      this.setState({
        countdown: 60,
        isCountdownShow: false,
      });
      return;
    }
    this.setState({
      countdown: this.state.countdown - 1,
    });
  }

  notification() {
    const { code, phone } = this.state;
    if (!checkPhone(phone)) {
      this.setState({
        isErrorShow: true,
        errorContent: '手机号码格式不正确',
      });
      return;
    }
    if (!code) {
      this.setState({
        isErrorShow: true,
        errorContent: '请输入验证码',
      });
      return;
    }
    const { fetchParams, actions } = this.props;
    const params = {
      courseId: fetchParams.liveId,
      code,
      phone,
    };
    actions.fetchNotification(params);
    this.onConfrimClose();
    this.setState({
      isErrorShow: false,
    });
  }

  handlePhoneChange(event) {
    this.setState({ phone: event.target.value });
  }

  handleCodeChange(event) {
    this.setState({ code: event.target.value });
  }

  renderSMS(hasNotification, startTime) {
    const canSMS = !hasNotification && moment().add(30, 'm').isBefore(startTime);
    const html = {
      [CAN_SMS]: <a className="blue sms" onClick={this.onSMS}>短信提醒</a>,
      [HAS_NOTIFICATION]: <a className="blue pass">已提醒</a>,
      [CAN_NOT_SMS]: <a className="gray sms">短信提醒</a>,
    };

    let status;
    if (hasNotification) status = HAS_NOTIFICATION;
    else if (canSMS) status = CAN_SMS;
    else status = CAN_NOT_SMS;

    return html[status];
  }

  renderStudyAndPlayback(status, recording) {
    const html = {
      [ON_LIVE]: <a className="blue start" onClick={this.onStudy}>开始学习</a>,
      [NOT_START]: <a className="gray start">开始学习</a>,
      [ABOUT_TO_START]: <a className="gray start">开始学习</a>,
      [OVER]: {
        [FETCHING_RECORDING]: <a className="gray">等待回放资源取回</a>,
        [HAS_RECORDING]: <a className="blue start" onClick={this.onPlayback}>查看回放</a>,
        [WITHOUT_RECORDING]: <a className="gray">已结束，无回放</a>,
      },
    };

    return status === OVER ? html[status][recording] : html[status];
  }

  renderLiveStatus(status) {
    const statusHtml = {
      [NOT_START]: null,
      [ABOUT_TO_START]: <span className="live-status about-to-start">即将开始</span>,
      [ON_LIVE]: <span className="live-status on-live">正在进行</span>,
      [OVER]: <span className="live-status over">已结束</span>,
    };

    return statusHtml[status] ? statusHtml[status] : null;
  }

  render() {
    const { trainingLive, hasNotification } = this.props;
    const {
      isErrorShow,
      errorContent,
      code,
      hasInitPhone,
      isCountdownShow,
      countdown,
    } = this.state;
    return (
      <div>
        <div className="banner">
          <div className="banner-face">
            <img width="100%" height="100%" src={trainingLive.img} alt={trainingLive.name} />
          </div>
          <div className="banner-info">
            <div className="banner-info-head">
              <div className="banner-info-title">
                {trainingLive.name}
              </div>
            </div>
            <div className="banner-info-tag">
              {
                trainingLive.labels.map((label, index) => (
                  <span key={index}>{label.name}</span>
                ))
              }
            </div>
            <div className="banner-info-time">
              开始时间: {moment(trainingLive.time).format('YYYY-MM-DD HH:mm')}
              {this.renderLiveStatus(trainingLive.status)}
            </div>
            <div className="banner-info-type">课堂类型: {this.liveType[trainingLive.type]}</div>
            <div className="banner-info-leture">讲师: {trainingLive.lecture}</div>
            <div className="banner-info-operate">
              {this.renderStudyAndPlayback(trainingLive.status, trainingLive.has_record)}
              {this.renderSMS(trainingLive.has_notification || hasNotification, trainingLive.time)}
            </div>
          </div>
        </div>
        <Confirm
          isOpen={this.state.isConfirmOpen}
          cancel={this.onCancel}
          confirm={this.onConfrim}
          confirmButton={this.context.intl.messages['app.lives.ok']}
          cancelButton={this.context.intl.messages['app.lives.cancel']}
        >
          <div>
            {hasInitPhone ? null : <div className="info">直播开始前30分钟，我们会发送预约短信到您的手机，请输入手机号码</div>}
            <div className="formInput">
              <Errors
                isOpen={isErrorShow}
              >
                {errorContent}
              </Errors>
              <img src={phoneIcon} alt="icon" />
              <input
                type="text" maxLength="50" name="tel" placeholder="请输入手机号码"
                onBlur={this.handlePhoneChange}
                ref={(c) => { this.phoneInput = c; }}
              />
            </div>
            <div className="formInput">
              <img src={codeIcon} alt="icon" />
              <input
                type="text" name="code" className="code" placeholder="请输入验证码"
                value={code}
                onChange={this.handleCodeChange}
              />
              <div className="line" />
              <div className="sent" onClick={this.getCode}>{isCountdownShow ? <span>{countdown}s</span> : <span style={{ color: '#009aec' }}>发送</span>}</div>
            </div>
          </div>
        </Confirm>
      </div>
    );
  }
}

Info.propTypes = propTypes;

const mapStateToProps = (state, ownProps) => ({
  fetchParams: {
    liveId: ownProps.params.live_id,
  },
  trainingLive: state.trainingLive,
  user: state.account.user,
  url: state.live.url,
  recordUrl: state.live.recordUrl,
  getCode: state.live.getCode,
  hasNotification: state.live.hasNotification,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({}, liveActions), dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Info);
