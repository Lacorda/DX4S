import {
  FETCH_PLANS_ALL_REQUEST,
  FETCH_PLANS_ALL_FAILURE,
  FETCH_PLANS_ALL_SUCCESS,
  FETCH_PLANS_REQUIRED_REQUEST,
  FETCH_PLANS_REQUIRED_FAILURE,
  FETCH_PLANS_REQUIRED_SUCCESS,
  FETCH_PLANS_ELECTIVE_REQUEST,
  FETCH_PLANS_ELECTIVE_FAILURE,
  FETCH_PLANS_ELECTIVE_SUCCESS,
  FETCH_PLANS_OWNPURCHASE_REQUEST,
  FETCH_PLANS_OWNPURCHASE_FAILURE,
  FETCH_PLANS_OWNPURCHASE_SUCCESS,
  FETCH_PLANS_ACTIVE,
  FETCH_PLANS_NEW,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  didInvalidate: true,
  allEnd: false,
  requiredEnd: false,
  electiveEnd: false,
  ownBuyEnd: false,
  active: 'all',
};
let allData = [];
let requiredData = [];
let minorsData = [];
let ownPurchaseData = [];
function plans(state = initialState, action) {

  switch (action.type) {
    // ===== all =====
    case FETCH_PLANS_ALL_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_PLANS_ALL_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_PLANS_ALL_SUCCESS: {
      // 判断index
      if (action.payload.index === 1) {
        allData = action.payload.list;
        return Object.assign({}, state, { isFetching: false, all: allData, allEnd: allData.length >= action.payload.size ? false : true });
      } else if (action.payload.list.length < action.payload.size) {
        allData = allData.concat(action.payload.list);
        return Object.assign({}, state,
          { isFetching: false, all: allData, allEnd: true });
      }
      // 下一页
      allData = allData.concat(action.payload.list);
      return Object.assign({}, state, { isFetching: false, all: allData });
    }
    // ===== required =====
    case FETCH_PLANS_REQUIRED_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_PLANS_REQUIRED_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_PLANS_REQUIRED_SUCCESS: {
      // 判断index
      if (action.payload.index === 1) {
        requiredData = action.payload.list;
        return Object.assign({}, state, { isFetching: false, required: requiredData, requiredEnd: requiredData.length >= action.payload.size ? false : true });
      } else if (action.payload.list.length < action.payload.size) {
        requiredData = requiredData.concat(action.payload.list);
        return Object.assign({}, state,
          { isFetching: false, required: requiredData, requiredEnd: true });
      }
      // 下一页
      requiredData = requiredData.concat(action.payload.list);
      return Object.assign({}, state, { isFetching: false, required: requiredData });
    }
    // ===== minors =====
    case FETCH_PLANS_ELECTIVE_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_PLANS_ELECTIVE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_PLANS_ELECTIVE_SUCCESS: {
      // 判断index
      if (action.payload.index === 1) {
        minorsData = action.payload.list;
        return Object.assign({}, state, { isFetching: false, minors: minorsData, electiveEnd: minorsData.length >= action.payload.size ? false : true });
      } else if (action.payload.list.length < action.payload.size) {
        minorsData = minorsData.concat(action.payload.list);
        return Object.assign({}, state,
          { isFetching: false, minors: minorsData, electiveEnd: true });
      }
      // 下一页
      minorsData = minorsData.concat(action.payload.list);
      return Object.assign({}, state, { isFetching: false, minors: minorsData });
    }
    // ===== ownPurchase =====
    case FETCH_PLANS_OWNPURCHASE_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_PLANS_OWNPURCHASE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_PLANS_OWNPURCHASE_SUCCESS: {
      // 判断index
      if (action.payload.index === 1) {
        ownPurchaseData = action.payload.list;
        return Object.assign({}, state, { isFetching: false, ownPurchase: ownPurchaseData, ownBuyEnd: ownPurchaseData.length >= action.payload.size ? false : true });
      } else if (action.payload.list.length < action.payload.size) {
        ownPurchaseData = ownPurchaseData.concat(action.payload.list);
        return Object.assign({}, state,
          { isFetching: false, ownPurchase: ownPurchaseData, ownBuyEnd: true });
      }
      // 下一页
      ownPurchaseData = ownPurchaseData.concat(action.payload.list);
      return Object.assign({}, state, { isFetching: false, ownPurchase: ownPurchaseData });
    }
    // ===== active =====
    case FETCH_PLANS_ACTIVE:
      return Object.assign({}, state, { active: action.payload });
    case FETCH_PLANS_NEW: {
      return Object.assign({}, state,
        {
          isFetching: false,
          allEnd: false,
          requiredEnd: false,
          electiveEnd: false,
          ownBuyEnd: false,
        });
    }
    default:
      return state;
  }
}

export default plans;
