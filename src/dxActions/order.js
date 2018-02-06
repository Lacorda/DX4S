import { createActions, createAction } from 'redux-actions';

import {
  FETCH_ORDER_CONFIRM_REQUEST,
  FETCH_ORDER_CONFIRM_FAILURE,
  FETCH_ORDER_CONFIRM_SUCCESS,
  FETCH_ORDER_SUBMIT_REQUEST,
  FETCH_ORDER_SUBMIT_FAILURE,
  FETCH_ORDER_SUBMIT_SUCCESS,
  FETCH_ORDER_LIST_REQUEST,
  FETCH_ORDER_LIST_FAILURE,
  FETCH_ORDER_LIST_SUCCESS,
  FETCH_ORDER_TITLE_ACTIVE,
  FETCH_ORDER_CLEARUP_ACTIVE,
  FETCH_ORDER_DETAIL_REQUEST,
  FETCH_ORDER_DETAIL_FAILURE,
  FETCH_ORDER_DETAIL_SUCCESS,
} from '../dxConstants/action-types/';

import api from 'utils/api';

const {
  fetchOrderConfirmRequest,
  fetchOrderConfirmFailure,
  fetchOrderConfirmSuccess,
  fetchOrderSubmitRequest,
  fetchOrderSubmitFailure,
  fetchOrderSubmitSuccess,
  fetchOrderListRequest,
  fetchOrderListFailure,
  fetchOrderListSuccess,
  fetchOrderTitleActive,
  fetchOrderDetailRequest,
  fetchOrderDetailFailure,
  fetchOrderDetailSuccess,
} = createActions(
  FETCH_ORDER_CONFIRM_REQUEST,
  FETCH_ORDER_CONFIRM_FAILURE,
  FETCH_ORDER_CONFIRM_SUCCESS,
  FETCH_ORDER_SUBMIT_REQUEST,
  FETCH_ORDER_SUBMIT_FAILURE,
  FETCH_ORDER_SUBMIT_SUCCESS,
  FETCH_ORDER_LIST_REQUEST,
  FETCH_ORDER_LIST_FAILURE,
  FETCH_ORDER_LIST_SUCCESS,
  FETCH_ORDER_TITLE_ACTIVE,
  FETCH_ORDER_DETAIL_REQUEST,
  FETCH_ORDER_DETAIL_FAILURE,
  FETCH_ORDER_DETAIL_SUCCESS
);

const fetchOrderClearUpActive = createAction(FETCH_ORDER_CLEARUP_ACTIVE);

const index = {
  personal: 1,
  personalPaying: 1,
  personalPaid: 1,
  personalCanceled: 1,
  enterprise: 1,
  enterprisePaying: 1,
  enterprisePaid: 1,
  enterpriseCanceled: 1,
};
const type = {};
export function fetchGetData(parameter, isDown = false) {
  if (isDown) index[`${parameter.title}${parameter.nav}`] = 1;
  if (parameter.title === 'enterprise') {
    type.belong = 'enterprise';
    if (parameter.nav === 'Paying') {
      type.status = 'Paying';
      type.index = index.enterprisePaying;
    } else if (parameter.nav === 'Paid') {
      type.status = 'Paid';
      type.index = index.enterprisePaid;
    } else if (parameter.nav === 'Canceled') {
      type.status = 'Canceled';
      type.index = index.enterpriseCanceled;
    } else {
      type.status = '';
      type.index = index.enterprise;
    }
  } else if (parameter.title === 'personal') {
    type.belong = 'personal';
    if (parameter.nav === 'Paying') {
      type.status = 'Paying';
      type.index = index.personalPaying;
    } else if (parameter.nav === 'Paid') {
      type.status = 'Paid';
      type.index = index.personalPaid;
    } else if (parameter.nav === 'Canceled') {
      type.status = 'Canceled';
      type.index = index.personalCanceled;
    } else {
      type.status = '';
      type.index = index.personal;
    }
  }
  type.size = 5;
  return (dispatch) => {
    dispatch(fetchOrderListRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: type,
      url: '/mall/orders/list',
    }).then((res) => {
      index[`${parameter.title}${parameter.nav}`] += 1;
      const data = { isUpdate: isDown, list: res.data.items, title: type.belong, nav: type.status };
      dispatch(fetchOrderListSuccess(data));
    }).catch((err) => {
      dispatch(fetchOrderListFailure(err));
    });
  };
}

// list title
export function fetchActiveOrderTitle(status) {
  return (dispatch) => {
    dispatch(fetchOrderTitleActive(status));
  };
}
// list clearUp
export function fetchActiveOrderClearUp() {
  return (dispatch) => {
    dispatch(fetchOrderClearUpActive());
  };
}

// confirm request
export function fetchOrderConfirmActive(data) {
  return (dispatch) => {
    dispatch(fetchOrderConfirmRequest());
    return api({
      method: 'POST',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      data: {
        products: data.products,
        from: data.from,
        type: data.belong,
        source: data.source,
      },
      url: '/mall/orders/review',
    }).then((res) => {
      dispatch(fetchOrderConfirmSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchOrderConfirmFailure(err));
    });
  };
}

// confirm submit
export function fetchOrderConfirmSubmit(data) {
  return (dispatch) => {
    dispatch(fetchOrderSubmitRequest());
    return api({
      method: 'POST',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      data: data,
      url: '/mall/orders/submit',
    }).then((res) => {
      dispatch(fetchOrderSubmitSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchOrderSubmitFailure(err));
    });
  };
}
// detail request
export function fetchOrderDetailActive(id) {
  return (dispatch) => {
    dispatch(fetchOrderDetailRequest());
    return api({
      method: 'GET',
      headers: {
        tenantId: 1,
        os: 'h5',
      },
      params: { id: id },
      url: '/mall/orders/detail',
    }).then((res) => {
      dispatch(fetchOrderDetailSuccess(res.data));
    }).catch((err) => {
      dispatch(fetchOrderDetailFailure(err));
    });
  };
}
