import api from 'utils/api';

import { createActions } from 'redux-actions';

import {
  FETCH_PAYMENT_ORDER_REQUEST,
  FETCH_PAYMENT_ORDER_SUCCESS,
  SUBMIT_PAYMENT_ALIPAY_REQUEST,
  SUBMIT_PAYMENT_ALIPAY_SUCCESS,
  SUBMIT_PAYMENT_WCPAY_REQUEST,
  SUBMIT_PAYMENT_WCPAY_SUCCESS,
  SUBMIT_PAYMENT_ENTERPRISE_PAY_REQUEST,
  SUBMIT_PAYMENT_ENTERPRISE_PAY_SUCCESS,
  SUBMIT_PAYMENT_ENTERPRISE_PAY_FAILURE,
  SUBMIT_PAYMENT_VERIFICATION_CODE_REQUEST,
  SUBMIT_PAYMENT_VERIFICATION_CODE_SUCCESS,
  SUBMIT_PAYMENT_VERIFICATION_CODE_FAILURE,
  FETCH_PAYMENT_ENTERPRISE_ORDER_REQUEST,
  FETCH_PAYMENT_ENTERPRISE_ORDER_SUCCESS,
  FETCH_PAYMENT_ORDER_ITEM_NUMBER_REQUEST,
  FETCH_PAYMENT_ORDER_ITEM_NUMBER_SUCCESS,
  RESET_PAYMENT_VERIFICATION_CODE,
  SET_PAYMENT_STATUS,
} from '../dxConstants/action-types';

export const {
  fetchPaymentOrderRequest,
  fetchPaymentOrderSuccess,
  submitPaymentAlipayRequest,
  submitPaymentAlipaySuccess,
  submitPaymentWcpayRequest,
  submitPaymentWcpaySuccess,
  submitPaymentEnterprisePayRequest,
  submitPaymentEnterprisePaySuccess,
  submitPaymentEnterprisePayFailure,
  submitPaymentVerificationCodeRequest,
  submitPaymentVerificationCodeSuccess,
  submitPaymentVerificationCodeFailure,
  fetchPaymentEnterpriseOrderRequest,
  fetchPaymentEnterpriseOrderSuccess,
  fetchPaymentOrderItemNumberRequest,
  fetchPaymentOrderItemNumberSuccess,
  resetPaymentVerificationCode,
  setPaymentStatus,
} = createActions(
  FETCH_PAYMENT_ORDER_REQUEST,
  FETCH_PAYMENT_ORDER_SUCCESS,
  SUBMIT_PAYMENT_ALIPAY_REQUEST,
  SUBMIT_PAYMENT_ALIPAY_SUCCESS,
  SUBMIT_PAYMENT_WCPAY_REQUEST,
  SUBMIT_PAYMENT_WCPAY_SUCCESS,
  SUBMIT_PAYMENT_ENTERPRISE_PAY_REQUEST,
  SUBMIT_PAYMENT_ENTERPRISE_PAY_SUCCESS,
  SUBMIT_PAYMENT_ENTERPRISE_PAY_FAILURE,
  SUBMIT_PAYMENT_VERIFICATION_CODE_REQUEST,
  SUBMIT_PAYMENT_VERIFICATION_CODE_SUCCESS,
  SUBMIT_PAYMENT_VERIFICATION_CODE_FAILURE,
  FETCH_PAYMENT_ENTERPRISE_ORDER_REQUEST,
  FETCH_PAYMENT_ENTERPRISE_ORDER_SUCCESS,
  FETCH_PAYMENT_ORDER_ITEM_NUMBER_REQUEST,
  FETCH_PAYMENT_ORDER_ITEM_NUMBER_SUCCESS,
  RESET_PAYMENT_VERIFICATION_CODE,
  SET_PAYMENT_STATUS,
);


export function fetchPaymentOrder(params) {
  const url = '/mall/orders/detail';
  return (dispatch) => {
    dispatch(fetchPaymentOrderRequest());
    return api({
      method: 'GET',
      params: {
        id: params.orderId,
      },
      url,
    }).then((res) => {
      dispatch(fetchPaymentOrderSuccess(res.data));
    });
  };
}

export function submitPaymentAlipay(data) {
  const url = '/mall/orders/create-alipay-order';
  return (dispatch) => {
    dispatch(submitPaymentAlipayRequest());
    return api({
      method: 'POST',
      data: {
        order_id: data.orderId,
        return_url: data.returnUrl,
      },
      url,
    }).then((res) => {
      dispatch(submitPaymentAlipaySuccess(res.data));
    });
  };
}

export function submitPaymentWcpay(data) {
  const url = '/mall/orders/create-weixin-order';
  return (dispatch) => {
    dispatch(submitPaymentWcpayRequest());
    return api({
      method: 'POST',
      data: {
        code: data.code,
        orderId: data.orderId,
        tradeType: 'JSAPI',
      },
      url,
    }).then((res) => {
      dispatch(submitPaymentWcpaySuccess(res.data));
    });
  };
}

export function submitPaymentEnterprisePay(data) {
  const url = '/mall/orders/pay';
  return (dispatch) => {
    dispatch(submitPaymentEnterprisePayRequest());
    return api({
      method: 'POST',
      data: {
        id: +data.orderId,
        phone: data.phone,
        code: data.code,
      },
      url,
    }).then((res) => {
      dispatch(submitPaymentEnterprisePaySuccess(res.data));
    }).catch((err) => {
      dispatch(submitPaymentEnterprisePayFailure(err.response.data));
    });
  };
}

export function submitPaymentVerificationCode(data) {
  const url = '/mall/verification-code';
  return (dispatch) => {
    dispatch(submitPaymentVerificationCodeRequest());
    return api({
      method: 'POST',
      data: {
        phone: data.phone,
        order_id: data.orderId,
        type: 'order',
      },
      url,
    }).then((res) => {
      dispatch(submitPaymentVerificationCodeSuccess(res.data));
    }).catch((err) => {
      dispatch(submitPaymentVerificationCodeFailure(err.response.data));
    });
  };
}

export function fetchPaymentOrderItemNumber(params) {
  const url = '/mall/orders/item-number';
  return (dispatch) => {
    dispatch(fetchPaymentOrderItemNumberRequest());
    return api({
      method: 'GET',
      params: {
        order_id: params.orderId,
      },
      url,
    }).then((res) => {
      dispatch(fetchPaymentOrderItemNumberSuccess(res.data));
    });
  };
}

export function fetchPaymentEnterpriseOrder(params) {
  const url = `/mall/orders/${params.orderId}/result`;
  return (dispatch) => {
    dispatch(fetchPaymentEnterpriseOrderRequest());
    return api({
      method: 'GET',
      url,
    }).then((res) => {
      dispatch(fetchPaymentEnterpriseOrderSuccess(res.data));
    });
  };
}
