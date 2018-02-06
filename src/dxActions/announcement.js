import api from 'utils/api';

import { createActions } from 'redux-actions';

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

export const {
  fetchAnnouncementListRequest,
  fetchAnnouncementListSuccess,
  fetchAnnouncementDetailRequest,
  fetchAnnouncementDetailSuccess,
  fetchAnnouncementCommentsCountRequest,
  fetchAnnouncementCommentsCountSuccess,
  submitAnnouncementCommentRequest,
  submitAnnouncementCommentSuccess,
  submitAnnouncementCommentFailure,
  fetchAnnouncementCommentsRequest,
  fetchAnnouncementCommentsSuccess,
  fetchAnnouncementLikeRequest,
  fetchAnnouncementLikeSuccess,
  resetAnnouncementPageList,
  nextAnnouncementPageList,
  resetAnnouncementPageComments,
  nextAnnouncementPageComments,
} = createActions(
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
);


export function fetchAnnouncementList() {
  const url = '/account/announcements';
  return (dispatch, getState) => {
    const pageParams = getState().announcement.pageList;
    dispatch(fetchAnnouncementListRequest());
    return api({
      method: 'GET',
      params: {
        index: pageParams.index,
        size: pageParams.size,
      },
      url,
    }).then((res) => {
      dispatch(fetchAnnouncementListSuccess(res.data));
    });
  };
}

export function fetchAnnouncementDetail(params) {
  const url = '/account/announcement/getAnnouncementInfo';
  return (dispatch) => {
    dispatch(fetchAnnouncementDetailRequest());
    api({
      method: 'GET',
      params: {
        announcement_id: params.announcementId,
      },
      url,
    }).then((res) => {
      dispatch(fetchAnnouncementDetailSuccess(res.data));
    });
  };
}

export function fetchAnnouncementCommentsCount(params) {
  const url = '/account/comment/getCommentsCount';
  return (dispatch) => {
    dispatch(fetchAnnouncementCommentsCountRequest());
    api({
      method: 'GET',
      params: {
        announcement_id: params.announcementId,
      },
      url,
    }).then((res) => {
      dispatch(fetchAnnouncementCommentsCountSuccess(res.data));
    });
  };
}

export function submitAnnouncementComment(comment, params) {
  const url = '/account/comment/add';
  return (dispatch) => {
    dispatch(submitAnnouncementCommentRequest());
    return api({
      method: 'POST',
      data: {
        announcement_id: params.announcementId,
        content: comment,
      },
      url,
    }).then(() => {
      dispatch(submitAnnouncementCommentSuccess());
    });
  };
}

export function fetchAnnouncementComments(params) {
  const url = '/account/comment/getComments';
  return (dispatch, getState) => {
    const pageParams = getState().announcement.pageComments;
    dispatch(fetchAnnouncementCommentsRequest());
    return api({
      method: 'GET',
      params: {
        announcement_id: params.announcementId,
        last_item_id: pageParams.lastItemId,
        page_count: pageParams.pageCount,
      },
      url,
    }).then((res) => {
      dispatch(fetchAnnouncementCommentsSuccess(res.data));
    });
  };
}

export function fetchAnnouncementLike(params) {
  const url = '/account/announcement/like';
  return (dispatch) => {
    dispatch(fetchAnnouncementLikeRequest());
    api({
      method: 'GET',
      params: {
        announcement_id: params.announcementId,
      },
      url,
    }).then(() => {
      dispatch(fetchAnnouncementLikeSuccess());
    });
  };
}
