import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { truncate } from 'utils/strings';
import { setTitle } from 'utils/dx/nav';
import { previewMall as previewMallActions, products as productsActions } from '../../actions';

import DocPreviewer from './preview-doc';
import MediaPreviewer from './preview-media';

import {
  nodeIdSelector,
  getNodesLength,
  getNodeIndex,
  getNodeName,
  getNodeType,
} from './selectors';

class PreviewMall extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.fetch();
  }

  componentWillReceiveProps({ paramNodeId }) {
    if (paramNodeId !== this.props.paramNodeId) this.fetch(paramNodeId);
  }

  async fetch(id) {
    const nodeId = id || this.props.paramNodeId;
    const { fetchParams, location } = this.props;
    await Promise.all([
      this.props.fetchProduct(fetchParams, location.query.type || null),
      this.props.fetchNodeSuccess(nodeId),
    ]);
    setTitle({ title: truncate(12, this.props.nodeName) });
  }

  renderPreview() {
    switch (this.props.nodeType) {
      case 'doc':
        return <DocPreviewer />;
      case 'audio':
      case 'video':
        return <MediaPreviewer />;
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="preview">
        <div className="preview-box">
          <div key={this.props.nodeId} style={{ width: '100%', height: '100%' }}>
            {this.renderPreview()}
          </div>
        </div>
        <div className="chapter-number">
          <div className="fixed-bottom">
            <span className="preview-footer-page">
              {`${this.props.currentNodeIndex + 1}/${this.props.nodesLength}`}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

PreviewMall.propTypes = {
  location: React.PropTypes.object,   // eslint-disable-line
  nodeId: React.PropTypes.string,
  nodesLength: React.PropTypes.number,
  nodeName: React.PropTypes.string,
  nodeType: React.PropTypes.string,
  currentNodeIndex: React.PropTypes.number,
  fetchParams: React.PropTypes.object.isRequired,  // eslint-disable-line
  paramNodeId: React.PropTypes.string,
  fetchProduct: React.PropTypes.func,
  fetchNodeSuccess: React.PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  nodeId: nodeIdSelector(state),
  nodesLength: getNodesLength(state),
  nodeName: getNodeName(state),
  nodeType: getNodeType(state),
  currentNodeIndex: getNodeIndex(state),
  fetchParams: { productId: ownProps.params.product_id },
  paramNodeId: ownProps.params.node_id,
});


const mapDispatchToProps = dispatch => ({
  fetchProduct: bindActionCreators(productsActions.fetchProduct, dispatch),
  fetchNodeSuccess: bindActionCreators(previewMallActions.fetchNodeSuccess, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewMall);
