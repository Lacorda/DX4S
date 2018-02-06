import {
  FETCH_PRACTICE_REQUEST,
  FETCH_PRACTICE_SUCCESS,
  FETCH_PRACTICE_READ_REQUEST,
  FETCH_PRACTICE_READ_SUCCESS,
  FETCH_PRACTICE_READ_FAILURE,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  didInvalidate: true,
  lastUpdated: false,
};
function practice(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRACTICE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_PRACTICE_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        exercise: action.payload,
      });
    }
    case FETCH_PRACTICE_READ_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_PRACTICE_READ_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        is_read: 1,
      });
    }
    case FETCH_PRACTICE_READ_FAILURE: {
      return Object.assign({}, state, {
        isFetching: false,
        alreadySubmit: action.err.errorCode === 1,
      });
    }
    default:
      return state;
  }
}

export default practice;
