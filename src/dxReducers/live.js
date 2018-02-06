import {
  FETCH_LIVE_MEETING_REQUEST,
  FETCH_LIVE_MEETING_FAILURE,
  FETCH_LIVE_MEETING_SUCCESS,
  FETCH_LIVE_PUBLICS_REQUEST,
  FETCH_LIVE_PUBLICS_FAILURE,
  FETCH_LIVE_PUBLICS_SUCCESS,
  FETCH_LIVE_OWNPURCHASE_REQUEST,
  FETCH_LIVE_OWNPURCHASE_FAILURE,
  FETCH_LIVE_OWNPURCHASE_SUCCESS,
  FETCH_LIVE_ACTIVE,
  FETCH_LIVE_NEW,
  FETCH_LIVE_URL_REQUEST,
  FETCH_LIVE_URL_SUCCESS,
  FETCH_CODE_REQUEST,
  FETCH_CODE_SUCCESS,
  FETCH_NOTIFICATION_REQUEST,
  FETCH_NOTIFICATION_SUCCESS,
  FETCH_RECORD_URL_REQUEST,
  FETCH_RECORD_URL_SUCCESS,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  didInvalidate: true,
  meetingEnd: false,
  publicsEnd: false,
  ownBuyEnd: false,
  active: 'meeting',
  url: {},
  getCode: false,
  recordUrl: {},
  hasNotification: false,
};
let meetingData = [];
let publicsData = [];
let ownPurchaseData = [];
function live(state = initialState, action) {

  switch (action.type) {
    // ===== meeting =====
    case FETCH_LIVE_MEETING_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_LIVE_MEETING_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_LIVE_MEETING_SUCCESS: {
      // 判断index
      if (action.payload.index === 1) {
        meetingData = action.payload.list;
        return Object.assign({}, state, { isFetching: false, meeting: meetingData, meetingEnd: meetingData.length >= action.payload.size ? false : true });
      } else if (action.payload.list.length < action.payload.size) {
        meetingData = meetingData.concat(action.payload.list);
        return Object.assign({}, state,
          { isFetching: false, meeting: meetingData, meetingEnd: true });
      }
      // 下一页
      meetingData = meetingData.concat(action.payload.list);
      return Object.assign({}, state, { isFetching: false, meeting: meetingData });
    }
    // ===== publics =====
    case FETCH_LIVE_PUBLICS_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_LIVE_PUBLICS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_LIVE_PUBLICS_SUCCESS: {
      // 判断index
      if (action.payload.index === 1) {
        publicsData = action.payload.list;
        return Object.assign({}, state, { isFetching: false, publics: publicsData, publicsEnd: publicsData.length >= action.payload.size ? false : true });
      } else if (action.payload.list.length < action.payload.size) {
        publicsData = publicsData.concat(action.payload.list);
        return Object.assign({}, state,
          { isFetching: false, publics: publicsData, publicsEnd: true });
      }
      // 下一页
      publicsData = publicsData.concat(action.payload.list);
      return Object.assign({}, state, { isFetching: false, publics: publicsData });
    }

    // ===== ownPurchase =====
    case FETCH_LIVE_OWNPURCHASE_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_LIVE_OWNPURCHASE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_LIVE_OWNPURCHASE_SUCCESS: {
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
    case FETCH_LIVE_ACTIVE:
      return Object.assign({}, state, { active: action.payload });
    case FETCH_LIVE_NEW: {
      return Object.assign({}, state,
        {
          isFetching: false,
          meetingEnd: false,
          publicsEnd: false,
          ownBuyEnd: false,
        });
    }
    case FETCH_LIVE_URL_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_LIVE_URL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        url: action.payload,
      });
    case FETCH_CODE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        getCode: false,
      });
    case FETCH_CODE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        getCode: true,
      });
    case FETCH_NOTIFICATION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        hasNotification: false,
      });
    case FETCH_NOTIFICATION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        hasNotification: true,
      });
    case FETCH_RECORD_URL_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_RECORD_URL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        recordUrl: action.payload,
      });
    default:
      return state;
  }
}

export default live;
