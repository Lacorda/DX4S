import {
  FETCH_STAFF_TASK_LIST_REQUEST,
  FETCH_STAFF_TASK_LIST_SUCCESS,
  FETCH_STAFF_TASK_DETAIL_REQUEST,
  FETCH_STAFF_TASK_DETAIL_SUCCESS,
  RESET_STAFF_TASK_PAGE,
  NEXT_STAFF_TASK_PAGE,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  tasks: [],
  detail: {},
  page: {
    size: 10,
    index: 1,
    end: false,
  },
};

const staffTask = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_STAFF_TASK_LIST_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_STAFF_TASK_LIST_SUCCESS:
      {
        let tasks;
        let page = state.page;

        if (page.index === 1) {
          tasks = payload;
        } else {
          tasks = state.tasks.concat(payload);
        }
        if (payload.length !== state.page.size) {
          page = Object.assign({}, state.page, {
            end: true,
          });
        }
        return Object.assign({}, state, {
          isFetching: false,
          tasks,
          page,
        });
      }
    case FETCH_STAFF_TASK_DETAIL_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_STAFF_TASK_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        detail: payload,
      });
    case RESET_STAFF_TASK_PAGE:
      return Object.assign({}, state, {
        page: {
          size: 10,
          index: 1,
          end: false,
        },
      });
    case NEXT_STAFF_TASK_PAGE:
      return Object.assign({}, state, {
        page: Object.assign({}, state.page, {
          index: state.page.index + 1,
        }),
      });
    default:
      return state;
  }
};

export default staffTask;
