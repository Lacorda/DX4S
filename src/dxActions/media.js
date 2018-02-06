import api from 'utils/api';

import { createActions } from 'redux-actions';

import {
  FETCH_MEDIA_REQUEST,
  FETCH_MEDIA_FAILURE,
  FETCH_MEDIA_SUCCESS,
} from '../dxConstants/action-types/';

const {
  fetchMediaRequest,
  fetchMediaFailure,
  fetchMediaSuccess,
} = createActions(FETCH_MEDIA_REQUEST,
    FETCH_MEDIA_FAILURE,
    FETCH_MEDIA_SUCCESS);

export function fetchNewMedia() {
  return (dispatch) => {
    dispatch(fetchMediaRequest());
    return api({
      method: 'GET',
      url: '/training/plan/node/5441?node_id=5441',
    }).then((res) => {
      dispatch(fetchMediaSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchMediaFailure(err));
    });
  };
}
