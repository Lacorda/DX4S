import api from 'utils/api';

import {
  INIT_SURVEY,
  FETCH_SURVEY_REQUEST,
  FETCH_SURVEY_FAILURE,
  FETCH_SURVEY_SUCCESS,
  SUBMIT_SURVEY_REQUEST,
  SUBMIT_SURVEY_FAILURE,
  SUBMIT_SURVEY_SUCCESS,
  READ_SURVEY_REQUEST,
  READ_SURVEY_FAILURE,
  READ_SURVEY_SUCCESS,
} from '../dxConstants/action-types';

// survey
export function initSurvey() {
  return dispatch => dispatch({ type: INIT_SURVEY });
}

export function fetchSurveyFailure(err) {
  return {
    type: FETCH_SURVEY_FAILURE,
    err,
  };
}

export function fetchSurveySuccess(survey) {
  return {
    type: FETCH_SURVEY_SUCCESS,
    survey,
  };
}

export function fetchSurvey(params) {
  return (dispatch) => {
    dispatch({
      type: FETCH_SURVEY_REQUEST,
    });
    return api({
      method: 'GET',
      url: `/account/survey/get?id=${params.id}&plan_id=${params.plan_id}&solution_id=${params.solution_id}&course_id=${params.course_id}&chap_id=${params.chap_id}&chap_node_id=${params.chap_node_id}&from=teacher`,
    })
    .then((res) => {
      // const questions = res.data.questions || [];
      dispatch(fetchSurveySuccess(res.data));
    })
    .catch((err) => {
      dispatch(fetchSurveyFailure(err.response.data));
      throw new Error(err.response.data.errorCode);
    });
  };
}

// submit survey
export function submitSurveyFailure(err) {
  return {
    type: SUBMIT_SURVEY_FAILURE,
    err,
  };
}

export function submitSurveySuccess(items) {
  return {
    type: SUBMIT_SURVEY_SUCCESS,
    items,
  };
}

export function submitSurvey(args) {
  return (dispatch) => {
    dispatch({
      type: SUBMIT_SURVEY_REQUEST,
    });
    return api({
      method: 'POST',
      url: '/account/survey/submit',
      data: args,
    })
    .then((res) => {
      dispatch(submitSurveySuccess(res.data));
    })
    .catch((err) => {
      dispatch(submitSurveyFailure(err.response.data));
    });
  };
}

// read survey
export function readSurveyFailure(err) {
  return {
    type: READ_SURVEY_FAILURE,
    err,
  };
}

export function readSurveySuccess() {
  return {
    type: READ_SURVEY_SUCCESS,
  };
}

export function readSurvey(params) {
  return (dispatch) => {
    dispatch({
      type: READ_SURVEY_REQUEST,
    });
    return api({
      method: 'PUT',
      url: `/training/plan/${params.plan_id}/solution/${params.solution_id}/course/${params.course_id}/chapter-node/${params.chap_node_id}`,
      data: {
        has_read: true,
      },
    })
    .then((res) => {
      dispatch(readSurveySuccess(res.data));
    })
    .catch((err) => {
      dispatch(readSurveyFailure(err.response.data));
    });
  };
}
