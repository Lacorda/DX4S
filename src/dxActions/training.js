import { createActions } from 'redux-actions';
import api from 'utils/api';

import {
  FETCH_TRAINING_EXAMS_REQUEST,
  FETCH_TRAINING_EXAMS_SUCCESS,
  FETCH_TRAINING_EXAMS_SUBMIT_REQUEST,
  FETCH_TRAINING_EXAMS_SUBMIT_SUCCESS,
  FETCH_TRAINING_PRACTICE_SUBMIT_REQUEST,
  FETCH_TRAINING_PRACTICE_SUBMIT_SUCCESS,
} from '../dxConstants/action-types';

export const {
  fetchTrainingExamsRequest,
  fetchTrainingExamsSuccess,
  fetchTrainingExamsSubmitRequest,
  fetchTrainingExamsSubmitSuccess,
  fetchTrainingPracticeSubmitRequest,
  fetchTrainingPracticeSubmitSuccess,
} = createActions(
  FETCH_TRAINING_EXAMS_REQUEST,
  FETCH_TRAINING_EXAMS_SUCCESS,
  FETCH_TRAINING_EXAMS_SUBMIT_REQUEST,
  FETCH_TRAINING_EXAMS_SUBMIT_SUCCESS,
  FETCH_TRAINING_PRACTICE_SUBMIT_REQUEST,
  FETCH_TRAINING_PRACTICE_SUBMIT_SUCCESS,
);


export function fetchTrainingExams(params) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/course/${params.courseId}/exercise`;
  return (dispatch) => {
    dispatch(fetchTrainingExamsRequest());
    api({
      method: 'GET',
      url,
    }).then((res) => {
      dispatch(fetchTrainingExamsSuccess(res.data));
    });
  };
}

export function fetchTrainingExamsSubmit(params, data) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/course/${params.courseId}/exercise`;
  return (dispatch) => {
    dispatch(fetchTrainingExamsSubmitRequest());
    api({
      method: 'POST',
      data,
      url,
    }).then((res) => {
      dispatch(fetchTrainingExamsSubmitSuccess(res.data));
    });
  };
}

export function fetchTrainingPracticeSubmit(params, data) {
  const url = `/training/h5/plan/${params.planId}/solution/${params.solutionId}/course/${params.courseId}/exercise`;
  return (dispatch) => {
    dispatch(fetchTrainingPracticeSubmitRequest());
    api({
      method: 'POST',
      data,
      url,
    }).then((res) => {
      dispatch(fetchTrainingPracticeSubmitSuccess(res.data));
    });
  };
}
