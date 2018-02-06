import api from 'utils/api';

import {
  INIT_PRODUCT,
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
} from '../dxConstants/action-types';

export function initProduct() {
  return dispatch => dispatch({ type: INIT_PRODUCT });
}

export function fetchProductSuccess(product, nodes, nodeIds) {
  return {
    type: FETCH_PRODUCT_SUCCESS,
    product,
    nodes,
    nodeIds,
  };
}

export function fetchProduct(params, type) {
  const requestUrl = (type === 'series' || type === 'view') ? `/mall/course/${params.productId}` : `/mall/products/${params.productId}`;
  return (dispatch) => {
    dispatch({
      type: FETCH_PRODUCT_REQUEST,
    });
    return api({
      method: 'GET',
      url: requestUrl,
    })
    .then((res) => {
      const product = res.data;
      product.chapters = product.chapters || [];
      const nodes = {};
      const nodeIds = [];

      product.chapters.forEach((item) => {
        item.nodes.forEach((node) => {
          const nodeId = node.id;
          nodeIds.push(nodeId);
          nodes[nodeId] = {
            id: nodeId,
            chapterId: item.id,
            name: node.name,
            type: node.type,
            url: node.url,
            previewDuration: node.preview_duration,
          };
          if (node.node_images) {
            const url = [];
            node.node_images.imgs.forEach((img) => {
              url.push(node.node_images.url + img);
            });
            nodes[nodeId].url = url;
          }
        });
      });

      dispatch(fetchProductSuccess(res.data, nodes, nodeIds));
    });
  };
}
