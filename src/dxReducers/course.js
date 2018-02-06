import update from 'immutability-helper';

import {
  FETCH_COURSE_REQUEST,
  FETCH_COURSE_FAILURE,
  FETCH_COURSE_SUCCESS,

  FETCH_CHAPTER_REQUEST,
  FETCH_CHAPTER_FAILURE,
  FETCH_CHAPTER_SUCCESS,
  UPDATE_NODE_URL,

  FETCH_ASSESSMENT_REQUEST,
  FETCH_ASSESSMENT_FAILURE,
  FETCH_ASSESSMENT_SUCCESS,

  FACOR_COURSE_SUCCESS,
  ARRANGE_COURSE_SUCCESS,
  INIT_COURSE,

} from '../dxConstants/action-types';

const defaultState = {
  isFetching: false,
  didInvalidate: true,
  lastUpdated: null,
  items: [],
  err: null,
};

const initialState = {
  detail: { ...defaultState, info: { labels: [] } },
  chapter: { ...defaultState },
  assessment: { ...defaultState, info: {} },
  nodes: {},
};

function course(state = initialState, action) {
  const detail = { ...state.detail, isFetching: true };
  switch (action.type) {
    case INIT_COURSE:
      // better
      return initialState;
    // course
    case FETCH_COURSE_REQUEST:
      // better
      return { ...state, detail: { ...state.detail, isFetching: true } };
    case FETCH_COURSE_FAILURE:
      return { ...state, detail: { ...state.detail, isFetching: false, err: action.err } };
    case FETCH_COURSE_SUCCESS:
      return { ...state, detail: { ...state.detail, isFetching: false, info: action.info } };

    // chapter
    case FETCH_CHAPTER_REQUEST:
      // better
      return { ...state, chapter: { ...state.chapter, isFetching: true } };
    case FETCH_CHAPTER_FAILURE:
      return { ...state, chapter: { ...state.chapter, isFetching: false } };
    case FETCH_CHAPTER_SUCCESS:
      return {
        ...state,
        chapter: { ...state.chapter, isFetching: false, items: action.chapters },
        nodes: { ...action.nodes },
      };
    case UPDATE_NODE_URL: {
      const { nodeId, url } = action.payload;
      const nodes = update(state.nodes, { [nodeId]: { url: { $set: url } } });
      return { ...state, nodes };
    }
    // chapter
    case FETCH_ASSESSMENT_REQUEST:
      // better
      return { ...state, assessment: { ...state.assessment, isFetching: true } };
    case FETCH_ASSESSMENT_FAILURE:
      return { ...state, assessment: { ...state.assessment, isFetching: false } };
    case FETCH_ASSESSMENT_SUCCESS:
      return { ...state, assessment: { ...state.assessment, isFetching: false, info: action.assessment } };

    case FACOR_COURSE_SUCCESS:
      detail.info.is_favor = action.favor;
      return { ...state, detail };
    case ARRANGE_COURSE_SUCCESS:
      detail.info.is_arranged = action.arrange;
      return { ...state, detail };
    default:
      return state;
  }
}

export default course;
