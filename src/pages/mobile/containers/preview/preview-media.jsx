import React from 'react';
import { connect } from 'react-redux';

import {
  passTheNode,
  fetchMediaResource,
  enterFullScreenMode,
  exitFullScreenMode,
  recordToHistory,
} from 'dxActions/preview';
import {
  makePreviewPropSelector,
  nodeIdSelector,
  isNodePassed,
  breakPointsSelector,
  getBreakPointsTime,
  getPassTime,
  getElapse,
  getShouldGoAhead,
} from './selectors';

import Media from '../../components/media';
import Practice from './breakpoint-practice';

class MediaPreviewer extends React.Component {
  constructor() {
    super();
    this.onProgress = ::this.onProgress;
    this.jumpIntoBreakPoint = ::this.jumpIntoBreakPoint;
    this.outOfBreakPoint = ::this.outOfBreakPoint;
    this.state = {
      isRequestingHasRead: false,
      atBreakPoint: false,
      breakPoint: null,
      handledBreakPointTime: [],
      indexOfBreakPoint: 0,
      // TODO onProgress shim
      timeout: null,
    };
  }

  async componentDidMount() {
    await this.props.fetchMediaResource();
    const { elapse, shouldGoAhead, breakPoints } = this.props;
    if (__platform__.wechat && breakPoints.length > 0) {
      // TODO i18n
      // eslint-disable-next-line no-alert
      window.alert('因受微信内的限制，' +
        '您如果无法查看当前课件的断点练习，' +
        '建议您通过系统浏览器打开查看课件');
    }

    let hasStarted = false;
    // TODO onProgress shim
    const timeout = setInterval(() => {
      const mediaPlayer = this.mediaPlayer;
      if (!mediaPlayer || !mediaPlayer.myPlayer) return;
      const player = mediaPlayer.myPlayer;
      const currentTime = player.currentTime();
      if (!hasStarted && shouldGoAhead && currentTime > 0) {
        player.currentTime(elapse);
        hasStarted = true;
      }
      this.onProgress(Math.floor(currentTime));
    }, 333);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ timeout });
  }

  componentWillReceiveProps({ isPassed }) {
    if (!this.mediaPlayer) return;
    if (isPassed) this.mediaPlayer.enableProgressBar();
    else this.mediaPlayer.disableProgressBar();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
  }

  async onProgress(time) {
    const recordTime = time > 5 ? time - 5 : 0;
    this.props.recordToHistory(recordTime);
    const { isPassed, breakPointsTime, passTime } = this.props;
    const { isRequestingHasRead, handledBreakPointTime, atBreakPoint } = this.state;
    if (time >= passTime && !isRequestingHasRead && !isPassed) {
      this.setState({ isRequestingHasRead: true });
      await this.props.passTheNode();
      this.setState({ isRequestingHasRead: false });
    }

    const isBreakPoint = breakPointsTime.includes(time);
    const unhandledBreakPoint = !handledBreakPointTime.includes(time);
    if (isBreakPoint && unhandledBreakPoint && !atBreakPoint) {
      this.jumpIntoBreakPoint(time);
    }
  }

  attachAttributes = (mediaRef) => {
    if (!mediaRef) return;
    if (!this.props.isPassed) mediaRef.disableProgressBar();
    this.mediaPlayer = mediaRef;
  };

  jumpIntoBreakPoint(time) {
    this.props.enterFullScreenMode();
    const { breakPoints } = this.props;
    const indexOfBreakPoint = breakPoints.findIndex(point => point.time === time);
    const breakPoint = breakPoints[indexOfBreakPoint];
    this.mediaPlayer.myPlayer.pause();
    this.setState({ atBreakPoint: true, breakPoint, indexOfBreakPoint });
  }

  outOfBreakPoint() {
    const { handledBreakPointTime, breakPoint } = this.state;
    this.setState({
      atBreakPoint: false,
      breakPoint: null,
      handledBreakPointTime: [...handledBreakPointTime, breakPoint.time],
    }, () => this.mediaPlayer.myPlayer.play());
    this.props.exitFullScreenMode();
  }

  render() {
    const { resourceUrl } = this.props;
    if (!resourceUrl) return null;

    const hiddenStyle = { display: 'none' };
    let mediaStyle = {};
    let practice = null;
    if (this.state.atBreakPoint) {
      mediaStyle = hiddenStyle;
      practice = (
        <div>
          <Practice
            afterSubmit={this.outOfBreakPoint}
            indexOfPractice={this.state.indexOfBreakPoint}
          />
        </div>
      );
    }

    return (
      <div>
        <div style={mediaStyle}>
          <Media
            controls
            ref={this.attachAttributes}
            src={resourceUrl}
          />
        </div>
        {practice}
      </div>
    );
  }
}

MediaPreviewer.propTypes = {
  // actions
  passTheNode: React.PropTypes.func,
  fetchMediaResource: React.PropTypes.func,
  enterFullScreenMode: React.PropTypes.func,
  exitFullScreenMode: React.PropTypes.func,
  recordToHistory: React.PropTypes.func,
  // state
  passTime: React.PropTypes.number,
  isPassed: React.PropTypes.bool,
  resourceUrl: React.PropTypes.string,
  breakPoints: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
  breakPointsTime: React.PropTypes.arrayOf(React.PropTypes.number),
  elapse: React.PropTypes.number,
  shouldGoAhead: React.PropTypes.bool,
};

const getResourceUrl = makePreviewPropSelector('resource_url');
const mapStateToProps = state => ({
  nodeId: nodeIdSelector(state),
  resourceUrl: getResourceUrl(state),
  passTime: getPassTime(state),
  isPassed: isNodePassed(state),
  breakPoints: breakPointsSelector(state),
  breakPointsTime: getBreakPointsTime(state),
  shouldGoAhead: getShouldGoAhead(state),
  elapse: getElapse(state),
});

const mapDispatchToProps = {
  passTheNode,
  fetchMediaResource,
  enterFullScreenMode,
  exitFullScreenMode,
  recordToHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaPreviewer);
