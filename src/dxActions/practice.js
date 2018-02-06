import api from 'utils/api';

import { createActions } from 'redux-actions';

import {
  FETCH_PRACTICE_REQUEST,
  FETCH_PRACTICE_SUCCESS,
  FETCH_PRACTICE_READ_REQUEST,
  FETCH_PRACTICE_READ_SUCCESS,
  FETCH_PRACTICE_READ_FAILURE,
} from '../dxConstants/action-types/';

const {
  fetchPracticeRequest,
  fetchPracticeSuccess,
  fetchPracticeReadRequest,
  fetchPracticeReadSuccess,
  fetchPracticeReadFailure,
} = createActions(FETCH_PRACTICE_REQUEST, FETCH_PRACTICE_SUCCESS, FETCH_PRACTICE_READ_REQUEST, FETCH_PRACTICE_READ_SUCCESS, FETCH_PRACTICE_READ_FAILURE);

export function fetchPractices(params) {
  // 11627
//  const url = `/training/plan/node/${params.nodeId}`;
  const { planId, solutionId, courseId, nodeId } = params;
  const url = `/training/plan/${planId}/solution/${solutionId}/course/${courseId}/node/${nodeId}`;
  return (dispatch) => {
    dispatch(fetchPracticeRequest());
    api({
      method: 'GET',
      url,
    }).then((res) => {
      dispatch(fetchPracticeSuccess(res.data));
    });
  };
}

export function fetchPracticesRead(params) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/course/${params.courseId}/chapter-node/${params.nodeId}`;
  return (dispatch) => {
    dispatch(fetchPracticeReadRequest());
    return api({
      method: 'PUT',
      url,
      data: {
        has_read: true,
      },
    }).then((res) => {
      dispatch(fetchPracticeReadSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchPracticeReadFailure(err.response.data));
    });
  };
}
