import {
  FETCH_COMMENT_LIST_REQUEST,
  FETCH_COMMENT_LIST_FAILURE,
  FETCH_COMMENT_LIST_SUCCESS,
  FETCH_COMMENT_LIST_INIT,

  FETCH_COMMENT_REQUEST,
  FETCH_COMMENT_FAILURE,
  FETCH_COMMENT_SUCCESS,

  ADD_COMMENT_REQUEST,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  ADD_MY_COMMENT,
} from '../dxConstants/action-types';

const defaultState = {
  isFetching: false,
  didInvalidate: true,
  lastUpdated: null,
  items: [],
};

const initialState = {
  list: { ...defaultState, fetchCommentSize: 10, isCommentList: true },
  detail: { ...defaultState, info: {}, content: {}, addMsg: {} },
};

function comment(state = initialState, action) {
  switch (action.type) {
    // comment list
    case FETCH_COMMENT_LIST_REQUEST:
      // better
      return { ...state, list: { ...state.list, isFetching: true } };
    case FETCH_COMMENT_LIST_FAILURE:
      return { ...state, list: { ...state.list, isFetching: false } };
    case FETCH_COMMENT_LIST_SUCCESS:
      return { ...state,
              list: { ...state.list,
                      isCommentList: action.items.length === state.list.fetchCommentSize,
                      isFetching: false,
                      items: state.list.items.concat(action.items),
                    },
             };
    case FETCH_COMMENT_LIST_INIT:
      return { ...state, list: { ...state.list, items: [] } };

    // comment detail
    case FETCH_COMMENT_REQUEST:
      // better
      return { ...state, detail: { ...state.detail, isFetching: true, addMsg: {} } };
    case FETCH_COMMENT_FAILURE:
      return { ...state, detail: { ...state.detail, isFetching: false } };
    case FETCH_COMMENT_SUCCESS:
      return { ...state, detail: { ...state.detail, isFetching: false, info: action.detail } };

    // add comment
    case ADD_COMMENT_REQUEST:
      // better
      return { ...state, detail: { ...state.detail, isFetching: true, addMsg: {} } };
    case ADD_COMMENT_FAILURE:
      return { ...state, detail: { ...state.detail, isFetching: false, addMsg: { errMsg: action.message } } };
    case ADD_COMMENT_SUCCESS:
      return { ...state, detail: { ...state.detail, isFetching: false, addMsg: { saveSuccess: true } } };
      // return { ...state, detail: { ...state.detail, isFetching: false, id: action.id } };
    case ADD_MY_COMMENT:
      {
        const comments = state.list.items;
        comments.unshift(action.myComment);
        return { ...state,
          list: { ...state.list,
            items: comments,
          },
        };
      }
    default:
      return state;
  }
}

export default comment;
