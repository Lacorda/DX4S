import React from 'react';
import { connect } from 'react-redux';
import { setHasRead, recordToHistory } from 'dxActions/preview';
import {
  nodeIdSelector,
  isNodePassed,
  getShouldGoAhead,
  getElapse,
} from './selectors';

import DocViewer from '../../components/docviewer';

class DocPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetched: !this.props.pass,
    };
    if (!this.props.pass) {
      this.props.setHasRead();
    }
  }

  componentDidMount() {
    const { shouldGoAhead, elapse } = this.props;
    if (shouldGoAhead) {
      this.viewer.scrollTo(elapse);
    }
  }

  async onPageTurn(page) {
    this.props.recordToHistory(page);
    if (this.props.isNodePassed) return;
    if (page >= this.props.pass && !this.state.isFetched) {
      await this.props.setHasRead();
      this.setState({ isFetched: true });
    }
  }

  render() {
    return (
      <DocViewer
        ref={(ref) => { this.viewer = ref; }}
        key={this.props.nodeId}
        imageUrls={this.props.urls}
        onPageTurn={page => this.onPageTurn(page)}
      />
    );
  }
}

DocPreview.propTypes = {
  nodeId: React.PropTypes.string,
  setHasRead: React.PropTypes.func,
  recordToHistory: React.PropTypes.func,
  elapse: React.PropTypes.number,
  urls: React.PropTypes.arrayOf(React.PropTypes.string),
  pass: React.PropTypes.number,
  isNodePassed: React.PropTypes.bool,
  shouldGoAhead: React.PropTypes.bool,
};

const mapStateToProps = state => ({
  urls: state.course.nodes[state.preview.node_id].url,
  pass: state.course.nodes[state.preview.node_id].pass,
  nodeId: nodeIdSelector(state),
  isNodePassed: isNodePassed(state),
  elapse: getElapse(state),
  shouldGoAhead: getShouldGoAhead(state),
});

const mapDispatchToProps = { setHasRead, recordToHistory };

export default connect(mapStateToProps, mapDispatchToProps)(DocPreview);
