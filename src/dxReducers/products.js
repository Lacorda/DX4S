import {
  INIT_PRODUCT,
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  detail: {},
  nodes: {},
  nodeIds: [],
};

function ProductInfo(state = initialState, action) {
  switch (action.type) {
    case INIT_PRODUCT:
      return initialState;
    case FETCH_PRODUCT_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        detail: action.product,
        nodes: action.nodes,
        nodeIds: action.nodeIds,
      });
    default:
      return state;
  }
}

export default ProductInfo;
