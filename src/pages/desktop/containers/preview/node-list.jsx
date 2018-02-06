import React from 'react';
import { connect } from 'react-redux';
import { NODE_TYPE } from 'dxConstants/dict-type';
import { turnToNode } from 'dxActions/preview';
import { eqLex } from 'utils/fn';
import * as selectors from './selectors';
import Chapter from './chapter';
import Node from './node';

class NodeList extends React.Component {

  turnTo = (nodeId) => {
    if (eqLex(nodeId, this.props.nodeId)) return null; // do nothing when current node is clicked
    const { nodeReadStates, isOrdered } = this.props;
    if (!isOrdered || nodeReadStates[nodeId]) return this.props.turnToNode(nodeId);
    const { passedNodeCount, nodes } = this.props;
    const clickedNodeIndex = Object.keys(nodes).findIndex(eqLex(nodeId));
    if (passedNodeCount >= clickedNodeIndex) return this.props.turnToNode(nodeId);
    return this.props.onBlockedNodeClick(nodeId);
  };

  renderChapterNodes = (chapter, index) => {
    const { nodes, isOrdered, nodeId, nodeReadStates, nextNode, currentNodePassed } = this.props;
    const chapterNodes = chapter.nodes.map(id => nodes[id]);
    const nodeEls = chapterNodes.map(({ type, name, id }) => (
      <Node
        key={id}
        name={name}
        isOrdered={isOrdered}
        active={+nodeId === +id}
        hasRead={nodeReadStates[id]}
        type={NODE_TYPE[type]}
        unlocked={+nextNode === +id && currentNodePassed}
        onClick={() => this.turnTo(id)}
      />
    ));
    return [<Chapter key={chapter.id} index={index + 1} name={chapter.name} />, ...nodeEls];
  };

  render() {
    const { chapters } = this.props;
    return (
      <div className="preview-chapter-index">
        <div className="node-line" />
        <div className="preview-chapter-wrapper">
          {
            chapters
              .map(this.renderChapterNodes)
              .reduce((children, child) => children.concat(child), [])
          }
        </div>
      </div>
    );
  }
}

const { object, arrayOf, bool, oneOfType, number, string, func } = React.PropTypes;

NodeList.propTypes = {
  nodes: object, // eslint-disable-line react/forbid-prop-types
  nodeReadStates: object, // eslint-disable-line react/forbid-prop-types
  nextNode: object, // eslint-disable-line react/forbid-prop-types
  chapters: arrayOf(object),
  isOrdered: bool,
  nodeId: oneOfType([string, number]),
  turnToNode: func,
  passedNodeCount: number,
  onBlockedNodeClick: func,
  currentNodePassed: bool,
};

const mapStateToProps = state => ({
  nodes: state.course.nodes,
  chapters: state.course.chapter.items,
  isOrdered: selectors.isOrderedSelector(state),
  nodeId: selectors.nodeIdSelector(state),
  nodeReadStates: selectors.passedNodesSelector(state),
  currentNodeIndex: selectors.getNodeIndex(state),
  passedNodeCount: selectors.passedNodeCount(state),
  nextNode: selectors.getNextNode(state),
  currentNodePassed: selectors.isNodePassed(state),
});

const mapDispatchToProps = ({
  turnToNode,
});

export default connect(mapStateToProps, mapDispatchToProps)(NodeList);
