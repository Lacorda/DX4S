import {
  FETCH_ORDER_CONFIRM_REQUEST,
  FETCH_ORDER_CONFIRM_FAILURE,
  FETCH_ORDER_CONFIRM_SUCCESS,
  FETCH_ORDER_SUBMIT_REQUEST,
  FETCH_ORDER_SUBMIT_FAILURE,
  FETCH_ORDER_SUBMIT_SUCCESS,
  FETCH_ORDER_LIST_REQUEST,
  FETCH_ORDER_LIST_FAILURE,
  FETCH_ORDER_LIST_SUCCESS,
  FETCH_ORDER_TITLE_ACTIVE,
  FETCH_ORDER_CLEARUP_ACTIVE,
  FETCH_ORDER_DETAIL_REQUEST,
  FETCH_ORDER_DETAIL_FAILURE,
  FETCH_ORDER_DETAIL_SUCCESS,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  title: 'enterprise',
  nav: '',
  lastUpdatedUnfinish: true,
  datas: {
    enterprise: [],
    enterprisePayings: [],
    enterprisePaids: [],
    enterpriseCanceleds: [],

    personal: [],
    personalPayings: [],
    personalPaids: [],
    personalCanceleds: [],
  },
};

function order(state = initialState, action) {
  switch (action.type) {
    // list title
    case FETCH_ORDER_TITLE_ACTIVE:
      return Object.assign({}, state, { title: action.payload.title, nav: action.payload.nav, lastUpdatedUnfinish: true });
    // list clearup
    case FETCH_ORDER_CLEARUP_ACTIVE:
      return Object.assign({}, state, { datas: {} });
    // list
    case FETCH_ORDER_LIST_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_ORDER_LIST_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_ORDER_LIST_SUCCESS: {
      const { title, nav, list, isUpdate } = action.payload;
      const lastUpdatedUnfinishVal = (list.length === 5 ? true : false);
      // 判断update
      if (isUpdate === true) {
        return Object.assign({}, state, {
          isFetching: false,
          datas: Object.assign({}, state.datas, {
            [`${title}${nav}`]: list,
          }),
          lastUpdatedUnfinish: lastUpdatedUnfinishVal,
        });
      } else if (list.length < 5) {
        return Object.assign({}, state, {
          isFetching: false,
          datas: Object.assign({}, state.datas, {
            [`${title}${nav}`]: state.datas[`${title}${nav}`].concat(list),
          }),
          lastUpdatedUnfinish: false,
        });
      }
      // 下一页
      return Object.assign({}, state, {
        isFetching: false,
        datas: Object.assign({}, state.datas, {
          [`${title}${nav}`]: state.datas[`${title}${nav}`].concat(list),
        }),
        lastUpdatedUnfinish: true,
      });
    }
    // confirm request
    case FETCH_ORDER_CONFIRM_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_ORDER_CONFIRM_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_ORDER_CONFIRM_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        confirm: action.payload.products,
      });
    }
    // confirm submit
    case FETCH_ORDER_SUBMIT_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_ORDER_SUBMIT_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        confirm_msg: '请求失败',
      });
    case FETCH_ORDER_SUBMIT_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        confirm_id: action.payload,
      });
    }
    // detail request
    case FETCH_ORDER_DETAIL_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_ORDER_DETAIL_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        detail_msg: '请求失败',
      });
    case FETCH_ORDER_DETAIL_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        detail: action.payload,
      });
    }
    default:
      return state;
  }
}

export default order;
