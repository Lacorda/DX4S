import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_FAILURE,
  FETCH_PROFILE_SUCCESS,
  POST_PASSWORD_REQUEST,
  POST_PASSWORD_FAILURE,
  POST_PASSWORD_SUCCESS,
  UPLOAD_PHOTO_SUCCESS,
  UPLOAD_PHOTO_REQUEST,
  UPLOAD_PHOTO_FAILURE,
} from '../dxConstants/action-types';

const defaultState = {
  isFetching: false,
  didInvalidate: true,
  lastUpdated: null,
  profile: null,
};

function profileDetail(state = defaultState, action) {
  const profile = { ...state.profile };
  switch (action.type) {
    // survey list
    case FETCH_PROFILE_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_PROFILE_FAILURE:
      return { ...state, isFetching: false };
    case FETCH_PROFILE_SUCCESS:
      return { ...state, profile: { ...state.detail, ...action.profile } };

    case POST_PASSWORD_REQUEST:
      return { ...state, isFetching: true };
    case POST_PASSWORD_FAILURE:
      return { ...state, isFetching: false, message: action.data.message };
    case POST_PASSWORD_SUCCESS:
      return { ...state, isFetching: false, isSuccess: true };

    case UPLOAD_PHOTO_SUCCESS:
      profile.header_url = action.headerUrl;
      return { ...state, profile, isUploading: false };
    case UPLOAD_PHOTO_REQUEST:
      return { ...state, isUploading: true };
    case UPLOAD_PHOTO_FAILURE:
      return { ...state, isUploading: false };

    default:
      return state;
  }
}

export default profileDetail;
