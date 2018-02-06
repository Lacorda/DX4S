import { createSelector } from 'reselect';
import { NODE_TYPE } from 'dxConstants/dict-type';

export const nodeIdSelector = state => state.preview.node_id;
export const breakPointsSelector = state => state.preview.break_points;
export const nodesSelector = state => state.course.nodes;
export const passedNodesSelector = state => state.preview.passedNodes;
export const getFullScreenMode = state => state.preview.fullScreenMode;
export const getPassTime = state => state.preview.pass_time;

export const getCurrentNode = createSelector(
  nodesSelector,
  nodeIdSelector,
  (nodes, nodeId) => nodes[nodeId]
);

export const getNodeName = createSelector(
  getCurrentNode,
  node => (node && node.name) || ''
);

export const isNodePassed = createSelector(
  passedNodesSelector,
  nodeIdSelector,
  (passedNodes, nodeId) => passedNodes[nodeId]
);

export const getNodesLength = createSelector(
  nodesSelector,
  nodes => Object.keys(nodes).length,
);

export const getNodeIndex = createSelector(
  nodesSelector,
  nodeIdSelector,
  (nodes, nodeId) => Object.keys(nodes).findIndex(id => id === nodeId)
);

export const getNextNode = createSelector(
  nodesSelector,
  getNodeIndex,
  (nodes, currentNodeIndex) => Object.keys(nodes)[currentNodeIndex + 1]
);

export const passedNodeCount = createSelector(
  passedNodesSelector,
  passedNodes =>
    Object
      .values(passedNodes)
      .reduce((count, passed) => count + (passed ? 1 : 0), 0)
);

export const isFirstNodeSelector = createSelector(
  getNodeIndex,
  index => index === 0
);

export const isLastNodeSelector = createSelector(
  getNodeIndex,
  getNodesLength,
  (index, length) => index === length - 1
);

export const getNodeType = createSelector(
  getCurrentNode,
  node => (node ? NODE_TYPE[node.type] : null)
);

export const makeCurrentNodePropSelector = prop => createSelector(
  getCurrentNode,
  node => node[prop]
);

export const makePreviewPropSelector = prop => createSelector(
  state => state.preview,
  preview => preview[prop],
);

export const isOrderedSelector = makePreviewPropSelector('is_order');

export const getBreakPointsTime = createSelector(
  breakPointsSelector,
  breakPoints => Object.values(breakPoints).map(point => point.time),
);

export const getElapse = makePreviewPropSelector('elapse');
export const getLatestNodeId = makePreviewPropSelector('latestNodeId');
export const getShouldContinue = makePreviewPropSelector('shouldContinue');
export const getShouldGoAhead = createSelector(
  nodeIdSelector,
  getLatestNodeId,
  getShouldContinue,
  (nodeId, latestNodeId, shouldContinue) => shouldContinue && (nodeId === latestNodeId)
);
