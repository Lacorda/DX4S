import { createActions } from 'redux-actions';
import api from 'utils/api';

import {
  FETCH_ELECTIVES_NEW_REQUEST,
  FETCH_ELECTIVES_NEW_FAILURE,
  FETCH_ELECTIVES_NEW_SUCCESS,
  FETCH_ELECTIVES_HOT_REQUEST,
  FETCH_ELECTIVES_HOT_FAILURE,
  FETCH_ELECTIVES_HOT_SUCCESS,
  FETCH_ELECTIVES_ACTIVE,
  FETCH_ELECTIVES_REFRESH_NEW,
  FETCH_ELECTIVES_REFRESH_HOT,
} from '../dxConstants/action-types/';

const {
  fetchElectivesNewRequest,
  fetchElectivesNewFailure,
  fetchElectivesNewSuccess,
  fetchElectivesHotRequest,
  fetchElectivesHotFailure,
  fetchElectivesHotSuccess,
  fetchElectivesActive,
  fetchElectivesRefreshNew,
  fetchElectivesRefreshHot,
} = createActions(FETCH_ELECTIVES_NEW_REQUEST,
  FETCH_ELECTIVES_NEW_FAILURE,
  FETCH_ELECTIVES_NEW_SUCCESS,
  FETCH_ELECTIVES_HOT_REQUEST,
  FETCH_ELECTIVES_HOT_FAILURE,
  FETCH_ELECTIVES_HOT_SUCCESS,
  FETCH_ELECTIVES_ACTIVE,
  FETCH_ELECTIVES_REFRESH_NEW,
  FETCH_ELECTIVES_REFRESH_HOT);

let hotIndex = 1;
let newIndex = 1;
export function fetchNewElectives(size = 10) {
  return (dispatch) => {
    dispatch(fetchElectivesNewRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        index: newIndex,
        size,
      },
      url: '/training/optional-course/search-newest-by-classification',
    }).then((res) => {
      newIndex += 1;
      const data = { list: res.data, size };
      dispatch(fetchElectivesNewSuccess(data));
    }).catch((err) => {
      dispatch(fetchElectivesNewFailure(err));
    });
  };
}

export function fetchHotElectives(size = 10) {
  return (dispatch) => {
    dispatch(fetchElectivesHotRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        index: hotIndex,
        size,
      },
      url: '/training/optional-course/search-hottest-by-classification',
    }).then((res) => {
      hotIndex += 1;
      const data = { list: res.data, size };
      dispatch(fetchElectivesHotSuccess(data));
    }).catch((err) => {
      dispatch(fetchElectivesHotFailure(err));
    });
  };
}


export function fetchActive(status) {
  return (dispatch) => {
    dispatch(fetchElectivesActive(status));
  };
}

export function fetchRefreshNew(status) {
  return (dispatch) => {
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        index: 1,
        size: 10,
      },
      url: '/training/optional-course/search-newest-by-classification',
    }).then((res) => {
      newIndex = 2;
      dispatch(fetchElectivesRefreshNew(res.data));
    }).catch((err) => {

    });
  };
}

export function fetchRefreshHot(status) {
  return (dispatch) => {
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: {
        index: 1,
        size: 10,
      },
      url: '/training/optional-course/search-hottest-by-classification',
    }).then((res) => {
      hotIndex = 2;
      dispatch(fetchElectivesRefreshHot(res.data));
    }).catch((err) => {
    });
  };
}
