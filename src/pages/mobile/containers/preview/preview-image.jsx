import React from 'react';
import { connect } from 'react-redux';
import { setHasRead } from 'dxActions/preview';

import ImageViewer from '../../components/imageviewer';

import { nodeIdSelector, isNodePassed } from './selectors';

class ImagePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
    };
  }

  getCurrentTime(seconds) {
    if (this.props.isNodePassed) return;
    if (seconds === this.props.pass && !this.state.isFetching) {
      this.props.setHasRead();
      this.setState({ isFetching: true });
    }
  }

  render() {
    return (
      <div>
        <ImageViewer
          key={this.props.nodeId}
          imageUrl={this.props.url}
          onTimeCallback={seconds => this.getCurrentTime(seconds)}
        />
      </div>
    );
  }
}

ImagePreview.propTypes = {
  setHasRead: React.PropTypes.func,
  url: React.PropTypes.string,
  pass: React.PropTypes.number,
  nodeId: React.PropTypes.string,
  isNodePassed: React.PropTypes.bool,
};

/* ImagePreview.defaultProps = {
 query: {
 plan_id: 2661,
 solution_id: 0,
 course_id: 9559,
 node_id: 11609,
 },
 url: 'http://dev-file.xm.duoxue/dev/1/img/74641fa39c8b4b57929013cac5ea761f.jpg',
 pass: 3,
 }*/

const mapStateToProps = state => ({
  nodeId: nodeIdSelector(state),
  url: state.course.nodes[state.preview.node_id].url,
  pass: state.course.nodes[state.preview.node_id].pass,
  isNodePassed: isNodePassed(state),
})

const mapDispatchToProps = { setHasRead };

export default connect(mapStateToProps, mapDispatchToProps)(ImagePreview);
