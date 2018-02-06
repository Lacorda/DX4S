import {
  FETCH_TRAINING_EXAMS_REQUEST,
  FETCH_TRAINING_EXAMS_SUCCESS,
  FETCH_TRAINING_EXAMS_SUBMIT_REQUEST,
  FETCH_TRAINING_EXAMS_SUBMIT_SUCCESS,
  FETCH_TRAINING_PRACTICE_SUBMIT_REQUEST,
  FETCH_TRAINING_PRACTICE_SUBMIT_SUCCESS,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  exercise: {},
  exerSubmit: {},
  backOfAnswer: {},
};

const training = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_TRAINING_EXAMS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_TRAINING_EXAMS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        exercise: payload,
      });
    case FETCH_TRAINING_EXAMS_SUBMIT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_TRAINING_EXAMS_SUBMIT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        exerSubmit: payload,
      });
    case FETCH_TRAINING_PRACTICE_SUBMIT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_TRAINING_PRACTICE_SUBMIT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        backOfAnswer: payload,
      });
    default:
      return state;
  }
};

export default training;
