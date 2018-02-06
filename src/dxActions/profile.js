import api from 'utils/api';

import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_FAILURE,
  FETCH_PROFILE_SUCCESS,
  POST_PASSWORD_REQUEST,
  POST_PASSWORD_FAILURE,
  POST_PASSWORD_SUCCESS,
  UPLOAD_PHOTO_REQUEST,
  UPLOAD_PHOTO_FAILURE,
  UPLOAD_PHOTO_SUCCESS,
} from '../dxConstants/action-types';

// profile
export function fetchProfileFailure() {
  return {
    type: FETCH_PROFILE_FAILURE,
  };
}

export function fetchProfileSuccess(profile) {
  return {
    type: FETCH_PROFILE_SUCCESS,
    profile,
  };
}

export function fetchProfile(params) {
  return (dispatch) => {
    dispatch({
      type: FETCH_PROFILE_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/account/account/getLoginInfo',
    })
    .then((res) => {
      if (res.data.modules && res.data.modules.mall) {
        Cookie.set('mallIcon', res.data.modules.mall);
      } else {
        Cookie.set('mallIcon', true);
      }
      dispatch(fetchProfileSuccess(res.data));
    })
    .catch((err) => {
      dispatch(fetchProfileFailure(err.response.data));
    });
  };
}

// change password
export function postPasswordFailure(data) {
  return {
    type: POST_PASSWORD_FAILURE,
    data,
  };
}

export function postPasswordSuccess(data) {
  return {
    type: POST_PASSWORD_SUCCESS,
    data,
  };
}

export function postPassword(params) {
  return (dispatch) => {
    dispatch({
      type: POST_PASSWORD_REQUEST,
    });
    return api({
      method: 'POST',
      url: '/account/account/changePass',
      data: params,
    })
    .then((res) => {
      dispatch(postPasswordSuccess(res.data));
    })
    .catch((err) => {
      dispatch(postPasswordFailure(err.response.data));
    });
  };
}

export function uploadPhotoFailure() {
  return {
    type: UPLOAD_PHOTO_FAILURE,
  };
}

export function uploadPhotoSuccess(headerUrl) {
  return {
    type: UPLOAD_PHOTO_SUCCESS,
    headerUrl,
  };
}

export function uploadPhoto(formData) {
  return (dispatch) => {
    dispatch({
      type: UPLOAD_PHOTO_REQUEST,
    });
    return api({
      method: 'POST',
      enctype: 'multipart/form-data',
      data: formData,
      url: '/account/account/uploadPhoto',
    })
    .then((res) => {
      dispatch(uploadPhotoSuccess(res.data.filepath));
    });
  };
}
