import {
  TURN_TO_NODE,
  PASS_THE_NODE,
  BLOCK_THE_NODE,
  FETCH_NODE_SUCCESS,
  FETCH_DONE_STATUS,
  FETCH_NODE_MEDIA_SUCCESS,
  ENTER_FULL_SCREEN_MODE,
  EXIT_FULL_SCREEN_MODE,
  FETCH_ORDER_STATUS_SUCCESS,
  INIT_PREVIEW,
  FETCH_PROGRESS_RECORD,
  CONTINUE_TO_LEARN,
} from '../dxConstants/action-types/preview';

const initialNodeState = {
  pass_time: Infinity,
  resource_url: '',
  // 视频音频断点
  break_points: [],
};

// 观看历史
const history = {
  shouldContinue: false, // 是否继续
  latestNodeId: '', // 上一次停止的节点ID
  elapse: 0, // 上一次停止的进度
};

const initialState = {
  is_order: true,
  fullScreenMode: false,
  plan_id: '',
  solution_id: '',
  course_id: '',
  node_id: '',
  passedNodes: {},
  ...history,
  ...initialNodeState,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT_PREVIEW:
      return initialState;
    case FETCH_NODE_SUCCESS:
    case FETCH_NODE_MEDIA_SUCCESS:
      return { ...state, ...action.payload };
    case FETCH_ORDER_STATUS_SUCCESS:
      return { ...state, is_order: action.payload };
    case TURN_TO_NODE:
      return { ...state, ...initialNodeState, node_id: `${action.payload}` };
    case PASS_THE_NODE:
      return { ...state, passedNodes: { ...state.passedNodes, [action.payload]: true } };
    case BLOCK_THE_NODE:
      return { ...state, passedNodes: { ...state.passedNodes, [action.payload]: false } };
    case FETCH_DONE_STATUS:
      return { ...state, passedNodes: action.payload };
    case ENTER_FULL_SCREEN_MODE:
      return { ...state, fullScreenMode: true };
    case EXIT_FULL_SCREEN_MODE:
      return { ...state, fullScreenMode: false };
    case FETCH_PROGRESS_RECORD: {
      const { nodeId: latestNodeId, elapse } = action.payload;
      return { ...state, latestNodeId: `${latestNodeId}`, elapse };
    }
    case CONTINUE_TO_LEARN:
      return { ...state, shouldContinue: true };
    default:
      return state;
  }
}

export default reducer;
