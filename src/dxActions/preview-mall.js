import {
  FETCH_MALL_NODE_SUCCESS,
} from '../dxConstants/action-types/preview-mall';

export function fetchNodeSuccess(nodeId) {
  return (dispatch) => {
    dispatch({
      type: FETCH_MALL_NODE_SUCCESS,
      nodeId,
    });
  };
}
