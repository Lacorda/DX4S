import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { truncate } from 'utils/strings';
import { setTitle } from 'utils/dx/nav';
import {
  turnToNode,
  initPreview,
  turnToNextNode,
  turnToPrevNode,
  fetchDoneStatus,
  enterFullScreenMode,
  exitFullScreenMode,
  fetchCourseOrderStatus,
  fetchHistory,
  continueToLearn,
  recordToHistory,
} from 'dxActions/preview';

import {
  fetchChapter,
} from 'dxActions/course';

import {
  nodeIdSelector,
  isNodePassed,
  getNodesLength,
  getNodeIndex,
  getNodeType,
  getFullScreenMode,
  makePreviewPropSelector,
  getNodeName,
  getLatestNodeId,
} from './selectors';

import messages from './messages';
import H5Previewer from './preview-h5';
import MediaPreviewer from './preview-media';
import DocPreviewer from './preview-doc';
import ImagePreviewer from './preview-image';
import SurveyPreviewer from './preview-survey';
import PracticePreviewer from './preview-practice';

import './preview.styl';

class Preview extends React.Component {
  constructor() {
    super();
    this.turnToPrevNode = ::this.turnToPrevNode;
    this.turnToNextNode = ::this.turnToNextNode;
    this.getPreviewer = ::this.getPreviewer;
    this.turnBack = ::this.turnBack;
  }

  componentWillMount() {
    // eslint-disable-next-line react/prop-types
    this.props.fetchHistory(this.props.params.course_id);
  }

  async componentDidMount() {
    this.props.exitFullScreenMode();
    this.resetPreviewerHeight();
    // eslint-disable-next-line react/prop-types
    const { plan_id, solution_id, course_id } = this.props.params;
    const query = { plan_id, solution_id, course_id };
    await Promise.all([
      this.props.fetchCourseOrderStatus(query),
      this.props.fetchChapter(query),
    ]);
    this.props.fetchDoneStatus();
    const params = this.props.location.query;
    const shouldContinue = Object.prototype.hasOwnProperty.call(params, 'continue');
    const latestNodeId = this.props.latestNodeId;
    if (shouldContinue && latestNodeId) {
      this.props.continueToLearn();
      this.props.turnToNode(plan_id, solution_id, course_id, latestNodeId);
    } else {
      this.props.turnToNode(plan_id, solution_id, course_id, params.node_id);
      this.props.recordToHistory();
    }
  }

  componentWillReceiveProps({ nodeName: newNodeName }) {
    const oldNodeName = this.props.nodeName;
    if (newNodeName && oldNodeName !== newNodeName) {
      setTitle({ title: truncate(12, newNodeName) });
    }
  }

  componentDidUpdate() {
    const { isPassed, nodeType, fullScreenMode } = this.props;
    const nodeTypeCouldLeadFullScreen = nodeType === 'practice';
    if (nodeTypeCouldLeadFullScreen) {
      if (!isPassed && !fullScreenMode) this.props.enterFullScreenMode();
      if (isPassed && fullScreenMode) this.props.exitFullScreenMode();
    }
  }

  componentWillUnmount() {
    this.props.initPreview();
    this.props.exitFullScreenMode();
  }

  getPreviewer() {
    const type = this.props.nodeType;
    switch (type) {
      case 'video':
      case 'audio':
        return <MediaPreviewer />;
      case 'h5':
        return <H5Previewer />;
      case 'doc':
        return <DocPreviewer />;
      case 'img':
        return <ImagePreviewer />;
      case 'survey':
        return <SurveyPreviewer />;
      case 'practice':
        return <PracticePreviewer />;
      default:
        return null;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  resetPreviewerHeight(/* isFullScreenMode = false */) {
    window.scrollTo(0, 0);
    /* reset height of previewer */
    // const previewContainerTop = this.previewContainer.getBoundingClientRect().top +
    // window.pageYOffset - document.documentElement.clientTop;
    // const footerHeight = this.footerContainer.getBoundingClientRect().height;
    // const bodyHeight = screen.height;
    // let previewHeight;
    // if (isFullScreenMode) previewHeight = bodyHeight - previewContainerTop;
    // else previewHeight = bodyHeight - previewContainerTop - footerHeight;
    // this.previewContainer.style.height = `${previewHeight}px`;
    // console.log({ previewContainerTop, footerHeight, bodyHeight, previewHeight });
  }

  isFirstNode() {
    return this.props.currentNodeIndex <= 0;
  }

  isLastNode() {
    return this.props.currentNodeIndex === this.props.nodesLength - 1;
  }

  canTurnNext() {
    const { isOrdered, isPassed } = this.props;
    const isUnorderedCourse = !isOrdered;
    return isUnorderedCourse || isPassed;
  }

  turnTo(prevOrNext) {
    window.scrollTo(0, 0);
    if (prevOrNext === 'prev') this.props.turnToPrevNode();
    else if (prevOrNext === 'next') this.props.turnToNextNode();
    this.props.recordToHistory();
  }

  turnToPrevNode() {
    this.turnTo('prev');
  }

  turnToNextNode() {
    this.turnTo('next');
  }

  turnBack() {
    const { planId, solutionId, courseId } = this.props;
    const path = `/plan/${planId}/series/${solutionId}/courses/${courseId}/detail`;
    this.context.router.push(path);
  }

  render() {
    const shouldShowFooter = !this.props.fullScreenMode;
    const hiddenStyle = { display: 'none' };
    const footerStyle = shouldShowFooter ? {} : hiddenStyle;
    const prevBtnAttrs = this.isFirstNode()
      ? { className: 'disabled' }
      : { onClick: this.turnToPrevNode };
    const nextBtnAttrs = !this.canTurnNext()
      ? { className: 'disabled' }
      : { onClick: this.turnToNextNode };

    const prevLink = (
      <a {...prevBtnAttrs}> <FormattedMessage {...messages.prev} /> </a>
    );

    const nextLinkText = this.isLastNode()
      ? <FormattedMessage {...messages.back} />
      : <FormattedMessage {...messages.next} />;

    let nextLink = (
      <a {...nextBtnAttrs}> {nextLinkText} </a>
    );

    if (this.isLastNode() && this.canTurnNext()) {
      nextLink = (
        <a onClick={this.turnBack}> {nextLinkText} </a>
      );
    }

    const previewer = this.getPreviewer();

    const page = `${this.props.currentNodeIndex + 1} / ${this.props.nodesLength}`;
    return (
      <div className="preview">
        <div className="preview-box">
          <div key={this.props.nodeId} style={{ width: '100%', height: '100%' }}>
            {previewer}
          </div>
        </div>

        <div
          style={footerStyle}
          className="chapter-number"
          id="preview-bottom"
        >
          <div className="fixed-bottom">
            {prevLink}
            <span className="preview-footer-page">{page}</span>
            {nextLink}
          </div>
        </div>
      </div>
    );
  }
}

Preview.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

Preview.propTypes = {
  // router
  location: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  // actions
  fetchCourseOrderStatus: React.PropTypes.func,
  initPreview: React.PropTypes.func,
  fetchChapter: React.PropTypes.func,
  turnToNode: React.PropTypes.func,
  turnToNextNode: React.PropTypes.func,
  turnToPrevNode: React.PropTypes.func,
  fetchDoneStatus: React.PropTypes.func,
  enterFullScreenMode: React.PropTypes.func,
  exitFullScreenMode: React.PropTypes.func,
  fetchHistory: React.PropTypes.func,
  continueToLearn: React.PropTypes.func,
  recordToHistory: React.PropTypes.func,
  // states
  isPassed: React.PropTypes.bool,
  isOrdered: React.PropTypes.bool,
  nodeId: React.PropTypes.string,
  nodeName: React.PropTypes.string,
  planId: React.PropTypes.string,
  courseId: React.PropTypes.string,
  solutionId: React.PropTypes.string,
  nodesLength: React.PropTypes.number,
  currentNodeIndex: React.PropTypes.number,
  nodeType: React.PropTypes.string,
  fullScreenMode: React.PropTypes.bool,
  latestNodeId: React.PropTypes.string,
};

const mapStateToProps = state => ({
  planId: makePreviewPropSelector('plan_id')(state),
  courseId: makePreviewPropSelector('course_id')(state),
  solutionId: makePreviewPropSelector('solution_id')(state),
  isOrdered: makePreviewPropSelector('is_order')(state),
  nodeName: getNodeName(state),
  currentNodeIndex: getNodeIndex(state),
  nodesLength: getNodesLength(state),
  isPassed: isNodePassed(state),
  nodeType: getNodeType(state),
  nodeId: nodeIdSelector(state),
  fullScreenMode: getFullScreenMode(state),
  latestNodeId: getLatestNodeId(state),
});
const mapDispatchToProps = {
  fetchCourseOrderStatus,
  fetchChapter,
  turnToNode,
  turnToNextNode,
  turnToPrevNode,
  fetchDoneStatus,
  enterFullScreenMode,
  exitFullScreenMode,
  initPreview,
  fetchHistory,
  continueToLearn,
  recordToHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
