import {
  INIT_SURVEY,
  FETCH_SURVEY_REQUEST,
  FETCH_SURVEY_FAILURE,
  FETCH_SURVEY_SUCCESS,

  SUBMIT_SURVEY_SUCCESS,
  SUBMIT_SURVEY_FAILURE,

  READ_SURVEY_SUCCESS,
  READ_SURVEY_FAILURE,
} from '../dxConstants/action-types';

const defaultState = {
  isFetching: false,
  didInvalidate: true,
  lastUpdated: null,
  items: [],
  title: null,
  alreadySubmit: false,
  readSurvey: false,
};

const initialState = {
  detail: { ...defaultState },
};

function survey(state = initialState, action) {
  switch (action.type) {
    case INIT_SURVEY:
    return initialState;
    // survey list
    case FETCH_SURVEY_REQUEST:
      return { ...state, detail: { ...state.detail, isFetching: true } };
    case FETCH_SURVEY_FAILURE:
      return { ...state, detail: { ...state.detail, isFetching: false, alreadySubmit: action.err.errorCode === 1 } };
    case FETCH_SURVEY_SUCCESS:
      return { ...state, detail: { ...state.detail, isFetching: false, items: action.survey.questions, title: action.survey.name, alreadySubmit: false } };
    case SUBMIT_SURVEY_SUCCESS:
      return { ...state, detail: { ...state.detail, isFetching: false, alreadySubmit: true } };
    case SUBMIT_SURVEY_FAILURE:
      return { ...state, detail: { ...state.detail, isFetching: false, alreadySubmit: action.err.errorCode === 1 } };
    case READ_SURVEY_SUCCESS:
      return { ...state, detail: { ...state.detail, isFetching: false, readSurvey: true } };
    case READ_SURVEY_FAILURE:
      return { ...state, detail: { ...state.detail, isFetching: false, readSurvey: false } };
    default:
      return state;
  }
}

export default survey;
