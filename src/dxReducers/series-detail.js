import {
  FETCH_SERIES_DETAIL_REQUEST,
  FETCH_SERIES_DETAIL_FAILURE,
  FETCH_SERIES_DETAIL_SUCCESS,
} from '../dxConstants/action-types';


const initialState = {
  isFetching: false,
  detailInfo: {},
};

const SeriesDetail = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_SERIES_DETAIL_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_SERIES_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        detailInfo: payload,
      });
    // case FETCH_SERIES_DETAIL_FAILURE:
    //
    //   break;
    default:
      return state;
  }
};

export default SeriesDetail;
