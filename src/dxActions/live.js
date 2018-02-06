import api from 'utils/api';
import { createActions } from 'redux-actions';
import * as actions from 'dxConstants/action-types/live';

import * as apis from '../pages/mobile/apis';

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
} from '../dxConstants/action-types/';


const {
  fetchLiveMeetingRequest,
  fetchLiveMeetingFailure,
  fetchLiveMeetingSuccess,
  fetchLivePublicsRequest,
  fetchLivePublicsFailure,
  fetchLivePublicsSuccess,
  fetchLiveOwnpurchaseRequest,
  fetchLiveOwnpurchaseFailure,
  fetchLiveOwnpurchaseSuccess,
  fetchLiveActive,
  fetchLiveNew,
  fetchLiveUrlRequest,
  fetchLiveUrlSuccess,
  fetchCodeRequest,
  fetchCodeSuccess,
  fetchNotificationRequest,
  fetchNotificationSuccess,
  fetchRecordUrlRequest,
  fetchRecordUrlSuccess,
} = createActions(
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
  FETCH_RECORD_URL_SUCCESS);
let meetingIndex = 1;
let publicsIndex = 1;
let ownPurchaseIndex = 1;

//
export function fetchMeetingLive(index = 0, size = 10) {
  if (index === 1) meetingIndex = 1;
  return (dispatch) => {
    dispatch(fetchLiveMeetingRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        index: meetingIndex,
        size,
        type: 'meeting',
      },
      url: '/training/lives',
    }).then((res) => {
      meetingIndex += 1;
      const data = { index, list: res.data, size };
      dispatch(fetchLiveMeetingSuccess(data));
    }).catch((err) => {
      dispatch(fetchLiveMeetingFailure(err));
    });
  };
}


export function fetchPublicsLive(index = 0, size = 10) {
  if (index === 1) publicsIndex = 1;
  return (dispatch) => {
    dispatch(fetchLivePublicsRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        type: 'open_en',
        index: publicsIndex,
        size,
      },
      url: '/training/lives',
    }).then((res) => {
      publicsIndex += 1;
      const data = { index, list: res.data, size };
      dispatch(fetchLivePublicsSuccess(data));
    }).catch((err) => {
      dispatch(fetchLivePublicsFailure(err));
    });
  };
}

export function fetchOwnPurchaseLive(index = 0, size = 10) {
  if (index === 1) ownPurchaseIndex = 1;
  return (dispatch) => {
    dispatch(fetchLiveOwnpurchaseRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        type: 'open_per',
        index: ownPurchaseIndex,
        size,
      },
      url: '/training/lives',
    }).then((res) => {
      ownPurchaseIndex += 1;
      const data = { index, list: res.data, size };
      dispatch(fetchLiveOwnpurchaseSuccess(data));
    }).catch((err) => {
      dispatch(fetchLiveOwnpurchaseFailure(err));
    });
  };
}

export function fetchActive(status) {
  return (dispatch) => {
    dispatch(fetchLiveActive(status));
  };
}


export function fetchNew() {
  return (dispatch) => {
    dispatch(fetchLiveNew());
  };
}

export function fetchLiveUrl(liveId) {
  const url = `/training/live/${liveId}/url-h5`;
  return (dispatch) => {
    dispatch(fetchLiveUrlRequest());
    return api({
      method: 'GET',
      url,
    }).then((res) => {
      dispatch(fetchLiveUrlSuccess(res.data));
    });
  };
}

export function fetchCode(phone) {
  const url = '/training/live/notification/code';
  return (dispatch) => {
    dispatch(fetchCodeRequest());
    return api({
      method: 'GET',
      params: {
        phone,
      },
      url,
    }).then(() => {
      dispatch(fetchCodeSuccess());
    });
  };
}

export function fetchRecordUrl(liveId) {
  const url = `/training/live/${liveId}/record-h5`;
  return (dispatch) => {
    dispatch(fetchRecordUrlRequest());
    return api({
      method: 'GET',
      url,
    }).then((res) => {
      dispatch(fetchRecordUrlSuccess(res.data));
    });
  };
}

export function fetchNotification(data) {
  const url = '/training/live/notification';
  return (dispatch) => {
    dispatch(fetchNotificationRequest());
    return api({
      method: 'POST',
      data: {
        phone: data.phone,
        courseId: data.courseId,
        code: data.code,
      },
      url,
    }).then((res) => {
      dispatch(fetchNotificationSuccess(res.data));
    });
  };
}

async function fetchLiveHistoryAndDispatch(liveId, dispatch) {
  const live = await apis.getTrainingLive(liveId);
  dispatch({ type: actions.FETCH_LIVE_HISTORY_SUCCESS, payload: live });
  return live;
}

export function fetchTrainingLive(liveId) {
  return dispatch => fetchLiveHistoryAndDispatch(liveId, dispatch);
}
