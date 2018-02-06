import {
  FETCH_MEDIA_REQUEST,
  FETCH_MEDIA_FAILURE,
  FETCH_MEDIA_SUCCESS,
} from '../dxConstants/action-types';

const defaultState = {
  isFetching: false,
  didInvalidate: true,
  lastUpdated: null,
  items: [],
  detail: {},
};

const initialState = { ...defaultState, draggable: false };

// const initialState = {
//   detail: { ...defaultState, draggable: false },
// };

function media(state = initialState, action) {
  switch (action.type) {
    // course
    case FETCH_MEDIA_REQUEST:
      // better
      return { ...state, isFetching: true };
    case FETCH_MEDIA_FAILURE:
      return { ...state, isFetching: false };
    case FETCH_MEDIA_SUCCESS:
      return { ...state, detail: { ...state.detail, ...action.payload } };
    default:
      return state;
  }
}

export default media;
