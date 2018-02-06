import React from 'react';
import { connect } from 'react-redux';

import { setTitle } from 'utils/dx/nav';
import { passTheNode } from 'dxActions/preview';
import {
  nodeIdSelector,
  isNodePassed,
  makeCurrentNodePropSelector,
  getNodeName,
} from './selectors';

class H5Previewer extends React.Component {
  async componentDidMount() {
    if (!this.props.isPassed) {
      await this.props.passTheNode(this.props.currentNodeId);
    }
  }

  render() {
    const { resourceUrl, nodeName: title } = this.props;
    return (
      <div className="h5-wrapper">
        <iframe
          className="h5"
          scrolling="yes"
          sandbox="allow-same-origin allow-scripts allow-forms"
          src={resourceUrl}
          onLoad={setTitle({ title })}
        />
      </div>
    );
  }
}

H5Previewer.propTypes = {
  // actions
  passTheNode: React.PropTypes.func,
  // state
  currentNodeId: React.PropTypes.string,
  isPassed: React.PropTypes.bool,
  resourceUrl: React.PropTypes.string,
  nodeName: React.PropTypes.string,
};

const getNodeUrl = makeCurrentNodePropSelector('url');
const mapStateToProps = state => ({
  currentNodeId: nodeIdSelector(state),
  isPassed: isNodePassed(state),
  resourceUrl: getNodeUrl(state),
  nodeName: getNodeName(state),
});
const mapDispatchToProps = {
  passTheNode,
};

export default connect(mapStateToProps, mapDispatchToProps)(H5Previewer);
