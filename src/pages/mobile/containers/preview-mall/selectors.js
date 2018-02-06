import { createSelector } from 'reselect';

export const nodeIdSelector = state => state.previewMall.nodeId;
export const nodesSelector = state => state.products.nodes;
export const nodeIdsSelector = state => state.products.nodeIds;

export const getCurrentNode = createSelector(
  nodesSelector,
  nodeIdSelector,
  (nodes, nodeId) => nodes[nodeId]
);

export const getNodeType = createSelector(
  getCurrentNode,
  node => (node && node.type) || null,
);

export const getNodeName = createSelector(
  getCurrentNode,
  node => (node && node.name) || ''
);

export const getNodeUrls = createSelector(
  getCurrentNode,
  node => (node && node.url) || [],
);

export const getNodeUrl = createSelector(
  getCurrentNode,
  node => (node && node.url) || '',
);

export const getDuration = createSelector(
  getCurrentNode,
  node => (node && node.previewDuration) || null,
);


export const getNodesLength = createSelector(
  nodeIdsSelector,
  nodeIds => nodeIds.length,
);

export const getNodeIndex = createSelector(
  nodeIdsSelector,
  nodeIdSelector,
  (nodeIds, nodeId) => nodeIds.findIndex(id => id === Number(nodeId))
);
