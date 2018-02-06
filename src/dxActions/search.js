import api from 'utils/api';

import { createActions } from 'redux-actions';

import {
  FETCH_SEARCH_REQUEST,
  FETCH_SEARCH_SUCCESS,
  NEXT_SEARCH,
  RESET_SEARCH,
} from '../dxConstants/action-types';

export const {
  fetchSearchRequest,
  fetchSearchSuccess,
  nextSearch,
  resetSearch,
} = createActions(
  FETCH_SEARCH_REQUEST,
  FETCH_SEARCH_SUCCESS,
  NEXT_SEARCH,
  RESET_SEARCH,
);

export function fetchSearch(params = {}) {
  const url = '/mall/products/h5/search';
  return (dispatch, getState) => {
    const page = getState().search.page;
    dispatch(fetchSearchRequest());
    return api({
      method: 'GET',
      params: Object.assign({}, page, params),
      url,
    }).then((res) => {
      dispatch(fetchSearchSuccess(res.data));
    });
  };
}

// export function fetchSearch(params = {}) {
//   params = {...defaultParams, ...params };
//   return async function fetchAndDispatchSearch(dispatch, getState) {
//     const state = getState();
//     dispatch({
//       type: FETCH_SEARCH_REQUEST,
//     });
//     try {
//       const res = await api({
//         url: '/mall/products/h5/search',
//         method: 'GET',
//         params, //{ index, size, keyword, sort_field, sort_order, type }            
//       });
//       dispatch({
//         type: FETCH_SEARCH_SUCCESS,
//         payload: res.data.items,
//       });
//       return res;
//     } catch (err) {
//       dispatch({
//         type: FETCH_SEARCH_FAILURE,
//         payload: JSON.stringify(err.response, null, 2),
//       });
//     }
//   };
// }

// export function appendSearch(params = {}) {
//   params = {...defaultParams, ...params };
//   return async function appendAndDispatchSearch(dispatch, getState) {
//     const state = getState();
//     dispatch({
//       type: APPEND_SEARCH_REQUEST,
//     });
//     try {
//       const res = await api({
//         url: '/mall/products/h5/search',
//         method: 'GET',
//         params, //{ index, size, keyword, sort_field, sort_order, type }            
//       });
//       dispatch({
//         type: APPEND_SEARCH_SUCCESS,
//         payload: res.data.items,
//       });
//       return res;
//     } catch (err) {
//       dispatch({
//         type: APPEND_SEARCH_FAILURE,
//         payload: JSON.stringify(err.response, null, 2),
//       });
//     }
//   };
// }

// export function nextSearchIndex() {
//   return function nextAndDispatchSearchIndex(dispatch) {
//     dispatch({
//       type: NEXT_SEARCH_INDEX,
//     });
//   };
// }

// export function restSearchIndex() {
//   return function restAndDispatchSearchIndex(dispatch) {
//     dispatch({
//       type: RESET_SEARCH_INDEX,
//     });
//   };
// }



// const {
//     fetchSearchRequest,
//     fetchSearchFailure,
//     fetchSearchSuccess,
// } = createActions(
//     FETCH_SEARCH_REQUEST,
//     FETCH_SEARCH_FAILURE,
//     FETCH_SEARCH_SUCCESS
// );

// export function fetchSearch(args) {
//     return (dispatch) => {
//         dispatch(fetchSearchRequest());
//         return api({
//             method: 'GET',
//             url: '/api/mall/products/h5/search',
//             params: args,
//         }).then((res) => {
//             dispatch(fetchSearchSuccess(res.data));
//         }).catch((err) => {
//             dispatch(fetchSearchFailure(err));
//         });
//     };
// }