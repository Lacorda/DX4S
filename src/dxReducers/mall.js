import update from 'immutability-helper';
import {
  FETCH_CLASSIFICATIONS_PRODUCTS_REQUEST,
  FETCH_CLASSIFICATIONS_PRODUCTS_FAILURE,
  FETCH_CLASSIFICATIONS_PRODUCTS_SUCCESS,
  FETCH_RECOMMEND_PRODUCTS_REQUEST,
  FETCH_RECOMMEND_PRODUCTS_SUCCESS,
  FETCH_RECOMMEND_PRODUCTS_FAILURE,
  FETCH_MALL_HOME_STATS_REQUEST,
  FETCH_MALL_HOME_STATS_SUCCESS,
  FETCH_MALL_HOME_STATS_FAILURE,
  FETCH_MALL_MORE_PRODUCTS_REQUEST,
  FETCH_MALL_MORE_PRODUCTS_SUCCESS,
  FETCH_MALL_MORE_PRODUCTS_FAILURE,
  FETCH_MALL_MORE_CLASSIFICATION_REQUEST,
  FETCH_MALL_MORE_CLASSIFICATION_SUCCESS,
  FETCH_MALL_MORE_CLASSIFICATION_FAILURE,
  RESET_MALL_MORE_PAGEINFO,
  SET_MALL_MORE_NEXT_PAGE,
  SET_MALL_MORE_ACTIVE_CLASSIFICATION,
  SET_MALL_HOME_CLOSE_MARK,

  FETCH_LIVE_PRODUCTS_REQUEST,
  FETCH_LIVE_PRODUCTS_SUCCESS,
  FETCH_LIVE_PRODUCTS_FAILURE,
  FETCH_MALL_BANNER_REQUEST,
  FETCH_MALL_BANNER_SUCCESS,
  FETCH_MALL_BANNER_FAILURE,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  mallHomeStats: {},
  classificationProducts: [],
  recommendProducts: [],
  morePageInfo: { index: 1, postId: '', size: 10, id: '', end: false },
  moreProductList: [],
  classifications: [],
  showmark: true,
  liveProducts: [],
};

const mall = (state = initialState, action) => {
  const { type, payload } = action;
  let moreInfo;
  switch (type) {
    case FETCH_CLASSIFICATIONS_PRODUCTS_REQUEST :
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_CLASSIFICATIONS_PRODUCTS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        classificationProducts: payload,
      });
    case FETCH_CLASSIFICATIONS_PRODUCTS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        classificationProducts: payload,
      });

    case FETCH_RECOMMEND_PRODUCTS_REQUEST :
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_RECOMMEND_PRODUCTS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        recommendProducts: payload,
      });
    case FETCH_RECOMMEND_PRODUCTS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        recommendProducts: payload,
      });

    case FETCH_MALL_HOME_STATS_REQUEST :
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_MALL_HOME_STATS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        mallHomeStats: payload,
      });
    case FETCH_MALL_HOME_STATS_FAILURE:
      return {
        ...state,
        isFetching: false,
        mallHomeStats: payload,
      };
    case RESET_MALL_MORE_PAGEINFO:
      moreInfo = update(state.morePageInfo, { index: { $set: 1 }, end: { $set: false } });
      return {
        ...state,
        isFetching: false,
        morePageInfo: moreInfo,
      };
    case FETCH_MALL_MORE_PRODUCTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_MALL_MORE_PRODUCTS_SUCCESS:
      let list;
      let pageinfo = state.morePageInfo;
      if (pageinfo.index === 1) {
        list = payload;
      } else {
        list = state.moreProductList.concat(payload);
      }
      if (payload.length !== state.morePageInfo.size) {
        pageinfo = update(state.morePageInfo, { end: { $set: true } });
      } else {
        pageinfo = update(state.morePageInfo, { end: { $set: false } });
      }
      return {
        ...state,
        isFetching: false,
        moreProductList: list,
        morePageInfo: pageinfo,
      };
    case FETCH_MALL_MORE_PRODUCTS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    case FETCH_MALL_MORE_CLASSIFICATION_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_MALL_MORE_CLASSIFICATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        classifications: payload,
      };
    case FETCH_MALL_MORE_CLASSIFICATION_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    case SET_MALL_MORE_NEXT_PAGE:
      const currentIndex = state.morePageInfo.index + 1;
      moreInfo = update(state.morePageInfo, { index: { $set: currentIndex } });
      return {
        ...state,
        morePageInfo: moreInfo,
      };
    case SET_MALL_MORE_ACTIVE_CLASSIFICATION:
      const obj = payload;
      let setMoreInfo = state.morePageInfo;
      if (obj.id) {
        setMoreInfo = update(setMoreInfo, {
          id: { $set: obj.id }, postId: { $set: obj.postId }, index: { $set: 1 },
        });
      }
      else {
        setMoreInfo = update(setMoreInfo, { id: { $set: '' }, postId: { $set: '' }, index: { $set: 1 }, });
      }
      return {
        ...state,
        morePageInfo: setMoreInfo,
      };
    case SET_MALL_HOME_CLOSE_MARK:
      return {
        ...state,
        showmark: false,
      };

    case FETCH_LIVE_PRODUCTS_REQUEST :
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_LIVE_PRODUCTS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        liveProducts: payload,
      });
    case FETCH_LIVE_PRODUCTS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        liveProducts: payload,
      });
    case FETCH_MALL_BANNER_REQUEST :
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_MALL_BANNER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        mallBanner: payload,
      });
    case FETCH_MALL_BANNER_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        mallBanner: payload,
      });
    default:
      return state;
  }
};

export default mall;
