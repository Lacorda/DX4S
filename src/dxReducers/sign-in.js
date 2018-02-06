import {
  FETCH_IS_SIGNED_SUCCESS,
  FETCH_SIGN_LIST_SUCCESS,
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_IN_FROM_HOME,
  REMOVE_FROM_HOME,
  RESET_STATE,
} from '../dxConstants/action-types/sign-in';

const initialState = {
  is_signed: false,
  from: '',
  sign_list: [],
  signSuccess: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_IS_SIGNED_SUCCESS:
      return { ...state, is_signed: action.payload };
    case FETCH_SIGN_LIST_SUCCESS:
      return { ...state, sign_list: action.payload };
    case SIGN_IN_REQUEST:
      return { ...state };
    case SIGN_IN_SUCCESS:
      return { ...state, is_signed: true, signSuccess: true };
    case SIGN_IN_FROM_HOME:
      return { ...state, from: 'home' };
    case REMOVE_FROM_HOME:
      return { ...state, from: '' };
    case RESET_STATE:
      return { ...state, signSuccess: false };
    default:
      return state;
  }
}

export default reducer;
