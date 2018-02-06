import api from 'utils/api';

import {
  FETCH_PUBLISHED_ELECTIVES_LIST_FAILURE,
  FETCH_PUBLISHED_ELECTIVES_LIST_SUCCESS,
  FETCH_PUBLISHED_ELECTIVES_LIST_REQUEST,
  UPDATE_PUBLISHED_ELECTIVES_LIST_FAILURE,
  UPDATE_PUBLISHED_ELECTIVES_LIST_SUCCESS,
  UPDATE_PUBLISHED_ELECTIVES_LIST_REQUEST,
  FETCH_ELECTIVES_LIST_FAILURE,
  FETCH_ELECTIVES_LIST_SUCCESS,
  FETCH_ELECTIVES_LIST_REQUEST,
  RESET_PUBLISH_ELECTIVES_REDUX,
  UPDATE_SELECTED_ELECTIVES,
  RESET_SELECTED_ELECTIVES,
} from '../dxConstants/action-types';

const size = 10;
let publishedElectivesIndex = 1;
let electivesIndex = 1;

// fetch published-electives list
export function fetchPublishedElectivesListFailure(err) {
  return {
    type: FETCH_PUBLISHED_ELECTIVES_LIST_FAILURE,
    err,
  };
}

export function fetchPublishedElectivesListSuccess(items, lastPublishedElectives, firstPublishedElectives) {
  return {
    type: FETCH_PUBLISHED_ELECTIVES_LIST_SUCCESS,
    items,
    lastPublishedElectives,
    firstPublishedElectives,
  };
}

export function fetchPublishedElectivesList(name = '', reset = false) {
  publishedElectivesIndex = reset ? 1 : publishedElectivesIndex;
  return (dispatch) => {
    dispatch({
      type: FETCH_PUBLISHED_ELECTIVES_LIST_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/training/elective/list/published',
      params: { index: publishedElectivesIndex, size, name },
    })
      .then((res) => {
        publishedElectivesIndex += 1;
        const lastPublishedElectives = !res.data.length || res.data.length < size;
        dispatch(fetchPublishedElectivesListSuccess(res.data, lastPublishedElectives, reset));
      })
      .catch((err) => {
        dispatch(fetchPublishedElectivesListFailure(err.response.data.message));
      });
  };
}

export function reFetchPublishedElectivesList(name = '') {
  return fetchPublishedElectivesList(name, true);
}

// fetch electives list
export function fetchElectivesListFailure(err) {
  return {
    type: FETCH_ELECTIVES_LIST_FAILURE,
    err,
  };
}

export function fetchElectivesListSuccess(data, lastElectives, firstElectives) {
  return {
    type: FETCH_ELECTIVES_LIST_SUCCESS,
    items: data.items,
    lastElectives,
    firstElectives,
  };
}

export function fetchElectivesList(name = '', resource = '', reset = false) {
  electivesIndex = reset ? 1 : electivesIndex;
  return (dispatch) => {
    dispatch({
      type: FETCH_ELECTIVES_LIST_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/training/elective/list/course/reference',
      params: { index: electivesIndex, size, name, resource },
    })
      .then((res) => {
        electivesIndex += 1;
        const lastElectives = !res.data.items.length || res.data.items.length < size;
        dispatch(fetchElectivesListSuccess(res.data, lastElectives, reset));
      })
      .catch((err) => {
        dispatch(fetchElectivesListFailure(err.response.data.message));
      });
  };
}

export function updateSelectElectives(ids, items) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_SELECTED_ELECTIVES,
      selectedIds: ids,
      selectedItems: items,
    });
  };
}

export function reFetchElectivesList(name = '', resource = '') {
  return fetchElectivesList(name, resource, true);
}

// update published-electives list
export function updatePublishedElectivesListFailure(err) {
  return {
    type: UPDATE_PUBLISHED_ELECTIVES_LIST_FAILURE,
    err,
  };
}

export function updatePublishedElectivesListSuccess(data, updatedSuccess) {
  return {
    type: UPDATE_PUBLISHED_ELECTIVES_LIST_SUCCESS,
    updatedSuccess,
  };
}

export function updatePublishedElectivesList(ids) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_PUBLISHED_ELECTIVES_LIST_REQUEST,
    });
    return api({
      method: 'PUT',
      url: '/training/elective/publish',
      data: { ids },
    })
      .then((res) => {
        dispatch(updatePublishedElectivesListSuccess(res.data, true));
      })
      .catch((err) => {
        dispatch(updatePublishedElectivesListFailure(err.response.data.message));
      });
  };
}

export function resetPublishElectivesRedux() {
  return (dispatch) => {
    dispatch({
      type: RESET_PUBLISH_ELECTIVES_REDUX,
    });
  };
}

export function resetSelectedElectives() {
  return (dispatch) => {
    dispatch({
      type: RESET_SELECTED_ELECTIVES,
    });
  };
}
