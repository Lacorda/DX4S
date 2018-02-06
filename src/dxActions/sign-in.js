import api from 'utils/api';

import {
  FETCH_IS_SIGNED_REQUEST,
  FETCH_IS_SIGNED_FAILURE,
  FETCH_IS_SIGNED_SUCCESS,
  FETCH_SIGN_LIST_REQUEST,
  FETCH_SIGN_LIST_FAILURE,
  FETCH_SIGN_LIST_SUCCESS,
  SIGN_IN_REQUEST,
  SIGN_IN_FAILURE,
  SIGN_IN_SUCCESS,
  SIGN_IN_FROM_HOME,
  REMOVE_FROM_HOME,
  RESET_STATE,
} from '../dxConstants/action-types';

// is_signed
export function fetchIsSignedFailure() {
  return {
    type: FETCH_IS_SIGNED_FAILURE,
  };
}

export function fetchIsSignedSuccess(data) {
  return {
    type: FETCH_IS_SIGNED_SUCCESS,
    payload: data.flag,
  };
}

export function fetchIsSigned() {
  return (dispatch) => {
    dispatch({
      type: FETCH_IS_SIGNED_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/account/account/isTodaySignin',
    })
      .then((res) => {
        dispatch(fetchIsSignedSuccess(res.data));
      })
      .catch((err) => {
        dispatch(fetchIsSignedFailure(err.response.data));
      });
  };
}

// sign_list
export function fetchSignListFailure() {
  return {
    type: FETCH_SIGN_LIST_FAILURE,
  };
}

export function fetchSignListSuccess(days) {
  return {
    type: FETCH_SIGN_LIST_SUCCESS,
    payload: days,
  };
}

export function fetchSignList(params) {
  return (dispatch) => {
    dispatch({
      type: FETCH_SIGN_LIST_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/account/account/getSigninList',
      params,
    })
      .then((res) => {
        const data = res.data;
        const days = [];
        data.days.forEach((day) => {
          const dayStr = (day.toString().length === 1) ? `0${day}` : day;
          days.push(`${data.year}-${data.month}-${dayStr}`);
        });
        dispatch(fetchSignListSuccess(days));
      })
      .catch((err) => {
        dispatch(fetchSignListFailure(err.response.data));
      });
  };
}

// sign_in
export function signInFromHome() {
  return {
    type: SIGN_IN_FROM_HOME,
  };
}

export function removeFromHome() {
  return {
    type: REMOVE_FROM_HOME,
  };
}

export function signInFailure() {
  return {
    type: SIGN_IN_FAILURE,
  };
}

export function signInSuccess() {
  return {
    type: SIGN_IN_SUCCESS,
  };
}

export function signIn() {
  return (dispatch) => {
    dispatch({
      type: SIGN_IN_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/account/account/signin',
    })
      .then((res) => {
        dispatch(signInSuccess(res.data));
      })
      .catch((err) => {
        dispatch(signInFailure(err.response.data));
      });
  };
}

export function resetState() {
  return (dispatch) => {
    dispatch({
      type: RESET_STATE,
    });
  };
}
