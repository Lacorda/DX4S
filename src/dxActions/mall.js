import api from 'utils/api';

import { createActions } from 'redux-actions';

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
  FETCH_MALL_MORE_CLASSIFICATION_REQUEST,
  FETCH_MALL_MORE_CLASSIFICATION_SUCCESS,
  FETCH_MALL_MORE_CLASSIFICATION_FAILURE,
  FETCH_MALL_MORE_PRODUCTS_REQUEST,
  FETCH_MALL_MORE_PRODUCTS_SUCCESS,
  FETCH_MALL_MORE_PRODUCTS_FAILURE,
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

export const {
  fetchClassificationsProductsRequest,
  fetchClassificationsProductsFailure,
  fetchClassificationsProductsSuccess,
  fetchRecommendProductsRequest,
  fetchRecommendProductsSuccess,
  fetchRecommendProductsFailure,
  fetchMallHomeStatsRequest,
  fetchMallHomeStatsSuccess,
  fetchMallHomeStatsFailure,
  fetchMallMoreClassificationRequest,
  fetchMallMoreClassificationSuccess,
  fetchMallMoreClassificationFailure,
  fetchMallMoreProductsRequest,
  fetchMallMoreProductsSuccess,
  fetchMallMoreProductsFailure,
  resetMallMorePageinfo,
  setMallMoreNextPage,
  setMallMoreActiveClassification,
  setMallHomeCloseMark,
  fetchLiveProductsRequest,
  fetchLiveProductsSuccess,
  fetchLiveProductsFailure,
  fetchMallBannerRequest,
  fetchMallBannerSuccess,
  fetchMallBannerFailure,

} = createActions(
  FETCH_CLASSIFICATIONS_PRODUCTS_REQUEST,
  FETCH_CLASSIFICATIONS_PRODUCTS_FAILURE,
  FETCH_CLASSIFICATIONS_PRODUCTS_SUCCESS,
  FETCH_RECOMMEND_PRODUCTS_REQUEST,
  FETCH_RECOMMEND_PRODUCTS_SUCCESS,
  FETCH_RECOMMEND_PRODUCTS_FAILURE,
  FETCH_MALL_HOME_STATS_REQUEST,
  FETCH_MALL_HOME_STATS_SUCCESS,
  FETCH_MALL_HOME_STATS_FAILURE,
  FETCH_MALL_MORE_CLASSIFICATION_REQUEST,
  FETCH_MALL_MORE_CLASSIFICATION_SUCCESS,
  FETCH_MALL_MORE_CLASSIFICATION_FAILURE,
  FETCH_MALL_MORE_PRODUCTS_REQUEST,
  FETCH_MALL_MORE_PRODUCTS_SUCCESS,
  FETCH_MALL_MORE_PRODUCTS_FAILURE,
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
);

export function fetchClassficiationProducts() {
  const url = '/mall/home/h5/classification';
  return (dispatch) => {
    dispatch(fetchClassificationsProductsRequest());
    return api({
      method: 'GET',
      url,
      r: Math.random(),
    }).then((res) => {
      dispatch(fetchClassificationsProductsSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchClassificationsProductsFailure(err.response.data));
    });
  };
}
export function fetchMallHomeStats() {
  const url = '/training/statistics/yesterday';
  return (dispatch) => {
    dispatch(fetchMallHomeStatsRequest());
    return api({
      method: 'GET',
      url,
      r: Math.random(),
    }).then((res) => {
      dispatch(fetchMallHomeStatsSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchMallHomeStatsFailure(err.response.data));
    });
  };
}

export function fetchRecommendProducts() {
  const url = '/mall/home/h5/recommend';
  return (dispatch) => {
    dispatch(fetchRecommendProductsRequest());
    return api({
      method: 'GET',
      url,
      r: Math.random(),
    }).then((res) => {
      dispatch(fetchRecommendProductsSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchRecommendProductsFailure(err.response.data));
    });
  };
}

export function fetchLiveProducts(params) {
  const url = '/mall/products';
  return (dispatch) => {
    dispatch(fetchLiveProductsRequest());
    return api({
      method: 'GET',
      params: {
        type: 'live',
        index: params.index,
        size: params.size,
        r: Math.random(),
      },
      url,
    }).then((res) => {
      dispatch(fetchLiveProductsSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchLiveProductsFailure(err.response.data));
    });
  };
}


export function fetchMallMoreProducts() {
  const url = '/mall/home/h5/more/classification-product';
  return (dispatch, getState) => {
    const pageParams = getState().mall.morePageInfo;
    dispatch(fetchMallMoreProductsRequest());
    return api({
      method: 'GET',
      params: {
        index: pageParams.index,
        size: pageParams.size,
        id: pageParams.id > 0 ? pageParams.id : '',
        post_id: pageParams.postId,
      },
      url,
    }).then((res) => {
      dispatch(fetchMallMoreProductsSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchMallMoreProductsFailure(err.response.data));
    });
  };
}

export function fetchMallMoreClassifications() {
  const url = '/mall/home/h5/classification/more';
  return (dispatch, getState) => {
    dispatch(fetchMallMoreClassificationRequest());
    return api({
      method: 'GET',
      url,
    }).then((res) => {
      dispatch(fetchMallMoreClassificationSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchMallMoreClassificationFailure(err.response.data));
    });
  };
}

export function fetchMallBanner() {
  const url = '/training/advertisement/list';
  return (dispatch) => {
    dispatch(fetchMallBannerRequest());
    return api({
      method: 'GET',
      url,
      params: {
        type: 6,
      },
    }).then((res) => {
      dispatch(fetchMallBannerSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchMallBannerFailure(err.response.data));
    });
  };
}

export function setActiveClassification(id, postId) {
  return (dispatch, getState) => {
    return dispatch(setMallMoreActiveClassification({ id: id, postId: postId }));
  };
}





