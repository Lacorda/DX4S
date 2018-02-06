import api from 'utils/api';

import { createActions } from 'redux-actions';

import {
  FETCH_EXAMS_INFO_REQUEST,
  FETCH_EXAMS_INFO_FAILURE,
  FETCH_EXAMS_INFO_SUCCESS,
  FETCH_EXAMS_HISTORY_REQUEST,
  FETCH_EXAMS_HISTORY_SUCCESS,
  FETCH_EXAMS_RANK_REQUEST,
  FETCH_EXAMS_RANK_SUCCESS,
  FETCH_EXAMS_PROCESS_REQUEST,
  FETCH_EXAMS_PROCESS_SUCCESS,
  RESET_EXAMS_PROCESS_SUBMIT,
  FETCH_EXAMS_PROCESS_SUBMIT_REQUEST,
  FETCH_EXAMS_PROCESS_SUBMIT_SUCCESS,
  RESET_EXAMS_PROCESS_SUBMIT_BEST,
  FETCH_EXAMS_PROCESS_SUBMIT_BEST_REQUEST,
  FETCH_EXAMS_PROCESS_SUBMIT_BEST_SUCCESS,
  FETCH_EXAMS_REVIEW_REQUEST,
  FETCH_EXAMS_REVIEW_SUCCESS,
  FETCH_EXAMS_PLAN_REQUEST,
  FETCH_EXAMS_PLAN_SUCCESS,
} from '../dxConstants/action-types';

export const {
  fetchExamsInfoRequest,
  fetchExamsInfoFailure,
  fetchExamsInfoSuccess,
  fetchExamsHistoryRequest,
  fetchExamsHistorySuccess,
  fetchExamsRankRequest,
  fetchExamsRankSuccess,
  fetchExamsProcessRequest,
  fetchExamsProcessSuccess,
  resetExamsProcessSubmit,
  fetchExamsProcessSubmitRequest,
  fetchExamsProcessSubmitSuccess,
  resetExamsProcessSubmitBest,
  fetchExamsProcessSubmitBestRequest,
  fetchExamsProcessSubmitBestSuccess,
  fetchExamsReviewRequest,
  fetchExamsReviewSuccess,
  fetchExamsPlanRequest,
  fetchExamsPlanSuccess,
} = createActions(
  FETCH_EXAMS_INFO_REQUEST,
  FETCH_EXAMS_INFO_FAILURE,
  FETCH_EXAMS_INFO_SUCCESS,
  FETCH_EXAMS_HISTORY_REQUEST,
  FETCH_EXAMS_HISTORY_SUCCESS,
  FETCH_EXAMS_RANK_REQUEST,
  FETCH_EXAMS_RANK_SUCCESS,
  FETCH_EXAMS_PROCESS_REQUEST,
  FETCH_EXAMS_PROCESS_SUCCESS,
  RESET_EXAMS_PROCESS_SUBMIT,
  FETCH_EXAMS_PROCESS_SUBMIT_REQUEST,
  FETCH_EXAMS_PROCESS_SUBMIT_SUCCESS,
  RESET_EXAMS_PROCESS_SUBMIT_BEST,
  FETCH_EXAMS_PROCESS_SUBMIT_BEST_REQUEST,
  FETCH_EXAMS_PROCESS_SUBMIT_BEST_SUCCESS,
  FETCH_EXAMS_REVIEW_REQUEST,
  FETCH_EXAMS_REVIEW_SUCCESS,
  FETCH_EXAMS_PLAN_REQUEST,
  FETCH_EXAMS_PLAN_SUCCESS,
  );


export function fetchExamsInfo(params) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/quiz/${params.quizId}`;
  return (dispatch) => {
    dispatch(fetchExamsInfoRequest());
    api({
      method: 'GET',
      url,
      r: Math.random(),
    }).then((res) => {
      dispatch(fetchExamsInfoSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchExamsInfoFailure(err.response.data));
    });
  };
}

export function fetchExamsHistory(params) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/quiz/${params.quizId}/record`;
  return (dispatch) => {
    dispatch(fetchExamsHistoryRequest());
    return api({
      method: 'GET',
      params: {
        index: 1,
        size: 30,
        r: Math.random(),
      },
      url,
    }).then((res) => {
      dispatch(fetchExamsHistorySuccess(res.data));
    });
  };
}

export function fetchExamsReview(params) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/quiz/${params.quizId}/record/${params.recordId}`;
  return (dispatch) => {
    dispatch(fetchExamsReviewRequest());
    api({
      method: 'GET',
      params: {
        index: 1,
        size: 30,
        r: Math.random(),
      },
      url,
    }).then((res) => {
      dispatch(fetchExamsReviewSuccess(res.data));
    });
  };
}

export function fetchExamsRank(params) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/quiz/${params.quizId}/rank`;
  return (dispatch) => {
    dispatch(fetchExamsRankRequest());
    return api({
      method: 'GET',
      params: {
        size: 10,
      },
      url,
    }).then((res) => {
      dispatch(fetchExamsRankSuccess(res.data));
    });
  };
}

export function fetchExamsProcess(params) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/quiz/${params.quizId}/exercise`;
  return (dispatch) => {
    dispatch(fetchExamsProcessRequest());
    api({
      method: 'GET',
      url,
    }).then((res) => {
      dispatch(fetchExamsProcessSuccess(res.data));
    });
  };
}

export function fetchExamsProcessSubmit(params, data) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/quiz/${params.quizId}/exercise`;
  return (dispatch) => {
    dispatch(fetchExamsProcessSubmitRequest());
    api({
      method: 'POST',
      data,
      url,
    }).then((res) => {
      dispatch(fetchExamsProcessSubmitSuccess(res.data));
    });
  };
}

export function fetchExamsProcessSubmitBest(params) {
  const url = `/training/plan/${params.planId}/solution/${params.solutionId}/quiz/${params.quizId}/exercise/optimum`;
  return (dispatch) => {
    dispatch(fetchExamsProcessSubmitBestRequest());
    api({
      method: 'PUT',
      url,
    }).then((res) => {
      dispatch(fetchExamsProcessSubmitBestSuccess(res.data));
    });
  };
}

export function fetchExamsPlan(params, data) {
  const url = data.is_arranged ? `/training/plan/${params.planId}/exam/${params.quizId}` : `/training/plan/${params.planId}/solution/${params.solutionId}/quiz/${params.quizId}/quit`;
  return (dispatch) => {
    dispatch(fetchExamsPlanRequest());
    api({
      method: 'PUT',
      data,
      url,
    }).then(() => {
      const infoUrl = `/training/plan/${params.planId}/solution/${params.solutionId}/quiz/${params.quizId}`;
      api({
        method: 'GET',
        url: infoUrl,
        r: Math.random(),
      }).then((res) => {
        dispatch(fetchExamsInfoSuccess(res.data));
      });
    });
  };
}
