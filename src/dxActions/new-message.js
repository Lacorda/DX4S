import api from 'utils/api';

import {
  FETCH_NEW_MESSAGE_REQUEST,
  FETCH_NEW_MESSAGE_FAILURE,
  FETCH_NEW_MESSAGE_SUCCESS,
} from '../dxConstants/action-types';

export function fetchNewMessageFailure(err) {
  return {
    type: FETCH_NEW_MESSAGE_FAILURE,
    err,
  };
}

export function fetchNewMessageSuccess(newMessage) {
  return {
    type: FETCH_NEW_MESSAGE_SUCCESS,
    newMessage,
  };
}

export function fetchNewMessage() {
  return (dispatch) => {
    dispatch({
      type: FETCH_NEW_MESSAGE_REQUEST,
    });
    return api({
      method: 'GET',
      headers: {
        version: '2.3',
      },
      url: '/account/announcement/hasNewMsg',
    })
    .then((res) => {
      dispatch(fetchNewMessageSuccess(res.data));
      return res.data;
    })
    .catch((err) => {
      dispatch(fetchNewMessageFailure(err.response.data));
    });
  };
}
