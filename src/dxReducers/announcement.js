import {
  FETCH_ANNOUNCEMENT_LIST_REQUEST,
  FETCH_ANNOUNCEMENT_LIST_SUCCESS,
  FETCH_ANNOUNCEMENT_DETAIL_REQUEST,
  FETCH_ANNOUNCEMENT_DETAIL_SUCCESS,
  FETCH_ANNOUNCEMENT_COMMENTS_COUNT_REQUEST,
  FETCH_ANNOUNCEMENT_COMMENTS_COUNT_SUCCESS,
  SUBMIT_ANNOUNCEMENT_COMMENT_REQUEST,
  SUBMIT_ANNOUNCEMENT_COMMENT_SUCCESS,
  SUBMIT_ANNOUNCEMENT_COMMENT_FAILURE,
  FETCH_ANNOUNCEMENT_COMMENTS_REQUEST,
  FETCH_ANNOUNCEMENT_COMMENTS_SUCCESS,
  FETCH_ANNOUNCEMENT_LIKE_REQUEST,
  FETCH_ANNOUNCEMENT_LIKE_SUCCESS,
  RESET_ANNOUNCEMENT_PAGE_LIST,
  NEXT_ANNOUNCEMENT_PAGE_LIST,
  RESET_ANNOUNCEMENT_PAGE_COMMENTS,
  NEXT_ANNOUNCEMENT_PAGE_COMMENTS,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  list: [],
  detail: {},
  commentsCount: 0,
  comments: [],
  pageList: {},
  pageComments: {},
};

const announcement = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_ANNOUNCEMENT_LIST_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_ANNOUNCEMENT_LIST_SUCCESS:
      {
        let list;
        let pageList = state.pageList;

        if (state.pageList.index === 1) {
          list = payload;
        } else {
          list = state.list.concat(payload);
        }
        if (payload.length !== state.pageList.size) {
          pageList = Object.assign({}, state.pageList, {
            end: true,
          });
        }
        return Object.assign({}, state, {
          isFetching: false,
          list,
          pageList,
        });
      }
    case FETCH_ANNOUNCEMENT_DETAIL_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_ANNOUNCEMENT_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        detail: payload,
      });
    case FETCH_ANNOUNCEMENT_COMMENTS_COUNT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_ANNOUNCEMENT_COMMENTS_COUNT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        commentsCount: payload.comments_count,
      });
    case SUBMIT_ANNOUNCEMENT_COMMENT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case SUBMIT_ANNOUNCEMENT_COMMENT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case SUBMIT_ANNOUNCEMENT_COMMENT_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case FETCH_ANNOUNCEMENT_COMMENTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_ANNOUNCEMENT_COMMENTS_SUCCESS:
      {
        let comments;
        let pageComments;

        if (state.pageComments.lastItemId === 0) {
          comments = payload;
        } else {
          comments = state.comments.concat(payload);
        }
        if (payload.length !== state.pageComments.pageCount) {
          pageComments = Object.assign({}, state.pageComments, {
            end: true,
          });
        } else {
          pageComments = Object.assign({}, state.pageComments, {
            end: false,
          });
        }
        return Object.assign({}, state, {
          isFetching: false,
          comments,
          pageComments,
        });
      }
    case FETCH_ANNOUNCEMENT_LIKE_REQUEST:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case FETCH_ANNOUNCEMENT_LIKE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        detail: Object.assign({}, state.detail, {
          has_liked: !state.detail.has_liked,
          like_count: state.detail.has_liked ?
            state.detail.like_count - 1 : state.detail.like_count + 1,
        }),
      });
    case RESET_ANNOUNCEMENT_PAGE_LIST:
      return Object.assign({}, state, {
        pageList: {
          size: 20,
          index: 1,
          end: false,
        },
      });
    case NEXT_ANNOUNCEMENT_PAGE_LIST:
      return Object.assign({}, state, {
        pageList: Object.assign({}, state.pageList, {
          index: state.pageList.index + 1,
        }),
      });
    case RESET_ANNOUNCEMENT_PAGE_COMMENTS:
      return Object.assign({}, state, {
        pageComments: {
          pageCount: 20,
          lastItemId: 0,
          end: false,
        },
      });
    case NEXT_ANNOUNCEMENT_PAGE_COMMENTS:
      return Object.assign({}, state, {
        pageComments: Object.assign({}, state.pageComments, {
          lastItemId: payload,
        }),
      });
    default:
      return state;
  }
};

export default announcement;
