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

const initialState = {
  isFetching: false,
  info: {},
  records: {},
  ranks: {},
  processSubmit: {},
  processSubmitBest: {},
  review: {},
  exercise: {},
};

const exams = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_EXAMS_INFO_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_EXAMS_INFO_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        info: payload,
      });
    case FETCH_EXAMS_INFO_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        info: payload,
      });
    case FETCH_EXAMS_HISTORY_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_EXAMS_HISTORY_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        records: {
          list: payload.records,
          status: payload.status,
          passType: payload.pass_type,
          reviewable: payload.reviewable,
        },
      });
    case FETCH_EXAMS_RANK_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_EXAMS_RANK_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        ranks: {
          list: payload.rank_data && payload.rank_data.map(rank => (
            Object.assign({}, rank, {
              pass_type: payload.pass_type,
            })
          )),
          rank: payload.my_rank,
          score: payload.best_score,
          passType: payload.pass_type,
        },
      });
    }
    case FETCH_EXAMS_PROCESS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_EXAMS_PROCESS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        exercise: payload,
      });
    case FETCH_EXAMS_PROCESS_SUBMIT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_EXAMS_PROCESS_SUBMIT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        processSubmit: payload,
      });
    case RESET_EXAMS_PROCESS_SUBMIT:
      return Object.assign({}, state, {
        processSubmit: {},
      });
    case FETCH_EXAMS_REVIEW_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_EXAMS_REVIEW_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        review: payload,
      });
    case RESET_EXAMS_PROCESS_SUBMIT_BEST:
      return Object.assign({}, state, {
        processSubmitBest: {},
      });
    case FETCH_EXAMS_PROCESS_SUBMIT_BEST_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_EXAMS_PROCESS_SUBMIT_BEST_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        processSubmitBest: payload,
      });
    case FETCH_EXAMS_PLAN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_EXAMS_PLAN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
      });
    default:
      return state;
  }
};

export default exams;
