import {
  FETCH_PUBLISHED_ELECTIVES_LIST_REQUEST,
  FETCH_PUBLISHED_ELECTIVES_LIST_SUCCESS,
  FETCH_PUBLISHED_ELECTIVES_LIST_FAILURE,
  FETCH_ELECTIVES_LIST_REQUEST,
  FETCH_ELECTIVES_LIST_SUCCESS,
  FETCH_ELECTIVES_LIST_FAILURE,
  RESET_PUBLISH_ELECTIVES_REDUX,
  UPDATE_PUBLISHED_ELECTIVES_LIST_REQUEST,
  UPDATE_PUBLISHED_ELECTIVES_LIST_SUCCESS,
  UPDATE_PUBLISHED_ELECTIVES_LIST_FAILURE,
  UPDATE_SELECTED_ELECTIVES,
  RESET_SELECTED_ELECTIVES,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  lastPublishedElectives: false,
  firstPublishedElectives: true,
  publishedElectives: [],
  lastElectives: false,
  firstElectives: true,
  electives: [],
  errMsg: '',
  updatedSuccess: false,
  selectedIds: [],
  selectedItems: [],
  count: 0,
};

let allPublishedElectives = [];
let allElectives = []

function publishElectives(state = initialState, action) {
  switch (action.type) {
    case FETCH_PUBLISHED_ELECTIVES_LIST_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_PUBLISHED_ELECTIVES_LIST_SUCCESS: {
      if (action.firstPublishedElectives) {
        allPublishedElectives = action.items;
        return {
          ...state,
          isFetching: false,
          lastPublishedElectives: action.lastPublishedElectives,
          publishedElectives: allPublishedElectives,
        };
      }
      allPublishedElectives = allPublishedElectives.concat(action.items);
      return {
        ...state,
        isFetching: false,
        lastPublishedElectives: action.lastPublishedElectives,
        publishedElectives: allPublishedElectives,
      };
    }
    case FETCH_PUBLISHED_ELECTIVES_LIST_FAILURE:
      return { ...state, isFetching: false, errMsg: action.err };
    case FETCH_ELECTIVES_LIST_REQUEST:
      return { ...state, isFetching: true };
    case FETCH_ELECTIVES_LIST_SUCCESS:
      if (action.firstElectives) {
        allElectives = action.items;
        return {
          ...state,
          isFetching: false,
          lastElectives: action.lastElectives,
          electives: allElectives,
        };
      }
      allElectives = allElectives.concat(action.items);
      return {
        ...state,
        isFetching: false,
        lastElectives: action.lastElectives,
        electives: allElectives,
      };
    case FETCH_ELECTIVES_LIST_FAILURE:
      return { ...state, isFetching: false, errMsg: action.err };
    case UPDATE_SELECTED_ELECTIVES:
      return {
        ...state,
        selectedIds: action.selectedIds,
        selectedItems: action.selectedItems,
        count: action.selectedIds.length,
      };
    case RESET_PUBLISH_ELECTIVES_REDUX:
      return {
        ...state,
        isFetching: false,
        lastPublishedElectives: false,
        lastElectives: false,
        updatedSuccess: false,
      };
    case RESET_SELECTED_ELECTIVES:
      return {
        ...state,
        selectedIds: [],
        selectedItems: [],
        count: 0,
      };
    case UPDATE_PUBLISHED_ELECTIVES_LIST_REQUEST:
      return { ...state, isFetching: true };
    case UPDATE_PUBLISHED_ELECTIVES_LIST_SUCCESS:
      return { ...state, isFetching: false, updatedSuccess: action.updatedSuccess };
    case UPDATE_PUBLISHED_ELECTIVES_LIST_FAILURE:
      return { ...state, isFetching: false, errMsg: action.err };
    default:
      return state;
  }
}

export default publishElectives;
