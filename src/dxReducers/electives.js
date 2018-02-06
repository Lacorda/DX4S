import {
  FETCH_ELECTIVES_NEW_REQUEST,
  FETCH_ELECTIVES_NEW_FAILURE,
  FETCH_ELECTIVES_NEW_SUCCESS,
  FETCH_ELECTIVES_HOT_REQUEST,
  FETCH_ELECTIVES_HOT_FAILURE,
  FETCH_ELECTIVES_HOT_SUCCESS,
  FETCH_ELECTIVES_ACTIVE,
  FETCH_ELECTIVES_REFRESH_HOT,
  FETCH_ELECTIVES_REFRESH_NEW,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  didInvalidate: true,
  lastUpdatedNew: false,
  lastUpdatedHot: false,
  active: 'new',
};
let hotData = [];
let newData = [];
function electives(state = initialState, action) {
  switch (action.type) {
    // electives
    case FETCH_ELECTIVES_NEW_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_ELECTIVES_NEW_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_ELECTIVES_NEW_SUCCESS: {
      newData = newData.concat(action.payload.list.optionalCourses);
      return Object.assign({}, state, { isFetching: false, new: newData, lastUpdatedNew: action.payload.list.optionalCourses.length < action.payload.size ? true : false });
    }
    case FETCH_ELECTIVES_HOT_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_ELECTIVES_HOT_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        msg: '请求失败',
      });
    case FETCH_ELECTIVES_HOT_SUCCESS: {
      hotData = hotData.concat(action.payload.list.optionalCourses);
      return Object.assign({}, state, { isFetching: false, hot: hotData, lastUpdatedHot: action.payload.list.optionalCourses.length < action.payload.size ? true : false });
    }
    case FETCH_ELECTIVES_ACTIVE:
      return Object.assign({}, state, { active: action.payload });
    case FETCH_ELECTIVES_REFRESH_NEW:
      newData = action.payload.optionalCourses;
      return Object.assign({}, state, { isFetching: false, new: newData, lastUpdatedNew: false })
    case FETCH_ELECTIVES_REFRESH_HOT:
      hotData = action.payload.optionalCourses;
      return Object.assign({}, state, { isFetching: false, hot: hotData, lastUpdatedHot: false })
    default:
      return state;
  }
}

export default electives;
