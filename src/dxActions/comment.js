import api from 'utils/api';

import {
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_SUCCESS,
  FETCH_COMMENT_REQUEST,
  FETCH_COMMENT_FAILURE,
  FETCH_COMMENT_SUCCESS,
  FETCH_COMMENT_LIST_REQUEST,
  FETCH_COMMENT_LIST_FAILURE,
  FETCH_COMMENT_LIST_SUCCESS,
  FETCH_COMMENT_LIST_INIT,
  ADD_MY_COMMENT,
} from '../dxConstants/action-types';

// comment list
export function fetchCommentListFailure() {
  return {
    type: FETCH_COMMENT_LIST_FAILURE,
  };
}

export function fetchCommentListSuccess(items) {
  return {
    type: FETCH_COMMENT_LIST_SUCCESS,
    items,
  };
}

export function addMyCommentTemp(myComment) {
  return {
    type: ADD_MY_COMMENT,
    myComment,
  };
}

export function fetchCommentList(args) {
  return (dispatch) => {
    dispatch({
      type: FETCH_COMMENT_LIST_REQUEST,
    });
    return api({
      method: 'POST',
      url: '/training/evaluation/list',
      data: args,
    })
    .then((res) => {
      dispatch(fetchCommentListSuccess(res.data));
    })
    .catch((err) => {
      dispatch(fetchCommentListFailure(err));
    });
  };
}

export function fetchCommentListInit() {
  return {
    type: FETCH_COMMENT_LIST_INIT,
  };
}

// comment detail
export function fetchCommentFailure() {
  return {
    type: FETCH_COMMENT_FAILURE,
  };
}

export function fetchCommentSuccess(detail) {
  return {
    type: FETCH_COMMENT_SUCCESS,
    detail,
  };
}

export function fetchComment(args) {
  return (dispatch) => {
    dispatch({
      type: FETCH_COMMENT_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/training/evaluation/get-template',
      params: args,
    })
    .then((res) => {
      dispatch(fetchCommentSuccess(res.data));
    })
    .catch((err) => {
      dispatch(fetchCommentFailure(err));
    });
  };
}

// add comment
export function addCommentFailure(err) {
  return {
    type: ADD_COMMENT_FAILURE,
    message: err.response.data.message,
  };
}

export function addCommentSuccess(detail) {
  return {
    type: ADD_COMMENT_SUCCESS,
    detail,
  };
}

export function addComment(args) {
  return (dispatch) => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
    });
    return api({
      method: 'POST',
      url: '/training/evaluation/add',
      data: args,
    })
    .then((res) => {
      dispatch(addCommentSuccess(res.data));
      // this.setState({ ...this.state, isInitScore: false, [`score${index}`]: item.dimension_score });
      // dispatch(setState({'success':'success'}));
    })
    .catch((err) => {
      dispatch(addCommentFailure(err));
    });
  };
}

