import {
  FETCH_ACCOUNT_BIZ_REQUEST,
  FETCH_ACCOUNT_BIZ_FAILURE,
  FETCH_ACCOUNT_BIZ_SUCCESS,
} from '../../dxConstants/action-types/account';

const initialState = {
  isFetching: false,
  didInvalidate: true,
  lastUpdated: null,
  err: null,
  id: null,
  name: '',
};
function biz(state = initialState, action) {
  switch (action.type) {
    case FETCH_ACCOUNT_BIZ_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_ACCOUNT_BIZ_FAILURE:
      return { ...state, isFetching: false, err: action.err };
    case FETCH_ACCOUNT_BIZ_SUCCESS:
      return { ...state, isFetching: false, lastUpdated: new Date(), ...action.info };
    default:
      return state;
  }
}

export default biz;
