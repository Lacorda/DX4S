import React from 'react';
import { connect } from 'react-redux';
import DocViewer from '../../components/docviewer';

import {
  nodeIdSelector,
  getNodeUrls,
} from './selectors';

class DocPreview extends React.Component {

  render() {
    return (
      <DocViewer
        ref={(ref) => { this.viewer = ref; }}
        key={this.props.nodeId}
        imageUrls={this.props.urls}
        isLimited
      />
    );
  }
}

DocPreview.propTypes = {
  nodeId: React.PropTypes.string,
  urls: React.PropTypes.arrayOf(React.PropTypes.string),
};


const mapStateToProps = state => ({
  nodeId: nodeIdSelector(state),
  urls: getNodeUrls(state),
});

export default connect(mapStateToProps)(DocPreview);
