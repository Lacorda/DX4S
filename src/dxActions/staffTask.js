import api from 'utils/api';

import { createActions } from 'redux-actions';

import {
  FETCH_STAFF_TASK_LIST_REQUEST,
  FETCH_STAFF_TASK_LIST_SUCCESS,
  FETCH_STAFF_TASK_DETAIL_REQUEST,
  FETCH_STAFF_TASK_DETAIL_SUCCESS,
  RESET_STAFF_TASK_PAGE,
  NEXT_STAFF_TASK_PAGE,
} from '../dxConstants/action-types';

export const {
  fetchStaffTaskListRequest,
  fetchStaffTaskListSuccess,
  fetchStaffTaskDetailRequest,
  fetchStaffTaskDetailSuccess,
  resetStaffTaskPage,
  nextStaffTaskPage,
} = createActions(
  FETCH_STAFF_TASK_LIST_REQUEST,
  FETCH_STAFF_TASK_LIST_SUCCESS,
  FETCH_STAFF_TASK_DETAIL_REQUEST,
  FETCH_STAFF_TASK_DETAIL_SUCCESS,
  RESET_STAFF_TASK_PAGE,
  NEXT_STAFF_TASK_PAGE,
);


export function fetchStaffTaskList() {
  const url = '/training/new-staff/h5/more';
  return (dispatch, getState) => {
    const pageParams = getState().staffTask.page;
    dispatch(fetchStaffTaskListRequest());
    return api({
      method: 'GET',
      params: {
        index: pageParams.index,
        size: pageParams.size,
      },
      url,
    }).then((res) => {
      dispatch(fetchStaffTaskListSuccess(res.data));
    });
  };
}

export function fetchStaffTaskDetail(params) {
  const url = '/training/myTask/detail';
  return (dispatch) => {
    dispatch(fetchStaffTaskDetailRequest());
    api({
      method: 'GET',
      params: {
        plan_id: params.planId,
      },
      url,
    }).then((res) => {
      dispatch(fetchStaffTaskDetailSuccess(res.data));
    });
  };
}


