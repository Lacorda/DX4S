import api from 'utils/api';

import { createActions } from 'redux-actions';

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
} from '../dxConstants/action-types/';


const {
  fetchPlansAllRequest,
  fetchPlansAllFailure,
  fetchPlansAllSuccess,
  fetchPlansRequiredRequest,
  fetchPlansRequiredFailure,
  fetchPlansRequiredSuccess,
  fetchPlansElectiveRequest,
  fetchPlansElectiveFailure,
  fetchPlansElectiveSuccess,
  fetchPlansOwnpurchaseRequest,
  fetchPlansOwnpurchaseFailure,
  fetchPlansOwnpurchaseSuccess,
  fetchPlansActive,
  fetchPlansNew,
} = createActions(
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
  FETCH_PLANS_NEW);
let allIndex = 1;
let requiredIndex = 1;
let minorsIndex = 1;
let ownPurchaseIndex = 1;
//
export function fetchAllPlans(index = 0, size = 10) {
  if (index === 1) allIndex = 1;
  return (dispatch) => {
    dispatch(fetchPlansAllRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        index:  allIndex,
        size,
      },
      url: '/training/studyArrange/h5/more/list',
    }).then((res) => {
      allIndex += 1;
      const data = { index, list: res.data, size };
      dispatch(fetchPlansAllSuccess(data));
    }).catch((err) => {
      dispatch(fetchPlansAllFailure(err));
    });
  };
}

//必修
export function fetchRequiredPlans(index = 0, size = 10) {
  if (index === 1) requiredIndex = 1;
  return (dispatch) => {
    dispatch(fetchPlansRequiredRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        task_source:'training',
        index: requiredIndex,
        size,
      },
      url: '/training/studyArrange/h5/more/list',
    }).then((res) => {
      requiredIndex += 1;
      const data = { index, list: res.data, size };
      dispatch(fetchPlansRequiredSuccess(data));
    }).catch((err) => {
      dispatch(fetchPlansRequiredFailure(err));
    });
  };
}

export function fetchElectivePlans(index = 0, size = 10) {
  if (index === 1) minorsIndex = 1;
  return (dispatch) => {
    dispatch(fetchPlansElectiveRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        task_source: 'elective',
        index: minorsIndex,
        size,
      },
      url: '/training/studyArrange/h5/more/list',
    }).then((res) => {
      minorsIndex += 1;
      const data = { index, list: res.data, size };
      dispatch(fetchPlansElectiveSuccess(data));
    }).catch((err) => {
      dispatch(fetchPlansElectiveFailure(err));
    });
  };
}

export function fetchOwnPurchasePlans(index = 0, size = 10) {
  if (index === 1) ownPurchaseIndex = 1;
  return (dispatch) => {
    dispatch(fetchPlansOwnpurchaseRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        task_source: 'personal',
        index: ownPurchaseIndex,
        size,
      },
      url: '/training/studyArrange/h5/more/list',
    }).then((res) => {
      ownPurchaseIndex += 1;
      const data = { index, list: res.data, size };
      dispatch(fetchPlansOwnpurchaseSuccess(data));
    }).catch((err) => {
      dispatch(fetchPlansOwnpurchaseFailure(err));
    });
  };
}

export function fetchActive(status) {
  return (dispatch) => {
    dispatch(fetchPlansActive(status));
  };
}


export function fetchNew() {
  return (dispatch) => {
    dispatch(fetchPlansNew());
  };
}
