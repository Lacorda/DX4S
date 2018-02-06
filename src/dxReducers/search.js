import {
  FETCH_SEARCH_REQUEST,
  FETCH_SEARCH_SUCCESS,
  NEXT_SEARCH,
  RESET_SEARCH,
} from '../dxConstants/action-types/';

const initialState = {
  isFetching: false,
  items: [],
  page: {
    size: 10,
    index: 1,
    end: false,
  },
};

function search(state = initialState, action) {
  const { payload } = action;
  switch (action.type) {
    case FETCH_SEARCH_REQUEST:
      return {...state, isFetching: true };
    case FETCH_SEARCH_SUCCESS:
      {
        let list;
        let page = state.page;
        const items = payload.items || [];

        if (state.page.index === 1) {
          list = items;
        } else {
          list = state.items.concat(items);
        }
        if (items.length < state.page.size) {
          page = {...state.page, end: true };
        }
        return {...state, items: list, page };
      }
    case NEXT_SEARCH:
      return {...state, page: {...state.page, index: state.page.index + 1 } };
    case RESET_SEARCH:
      return {...state,
        page: {
          size: 10,
          index: 1,
          end: false,
        },
      };
    default:
      return state;
  }
}

export default search;