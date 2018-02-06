import { FETCH_MALL_NODE_SUCCESS } from '../dxConstants/action-types/preview-mall';

const initialState = {
  nodeId: '',
};

function previewMall(state = initialState, action) {
  switch (action.type) {
    case FETCH_MALL_NODE_SUCCESS:
      return { ...state, nodeId: action.nodeId };
    default:
      return state;

  }
}

export default previewMall;
