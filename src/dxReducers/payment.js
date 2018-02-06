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

const initialState = {
  isFetching: false,
  orderDetail: {},
  alipay: '',
  wcpay: {},
  enterprisePay: {},
  verificationCode: false,
  err: {},
  enterpriseOrder: {},
  orderItemNumber: 0,
  paymentStatus: false,
};

const payment = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCH_PAYMENT_ORDER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_PAYMENT_ORDER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        orderDetail: payload,
        paymentStatus: payload.status === 'paid_success',
      });
    case SUBMIT_PAYMENT_ALIPAY_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case SUBMIT_PAYMENT_ALIPAY_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        alipay: payload,
      });
    case SUBMIT_PAYMENT_WCPAY_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case SUBMIT_PAYMENT_WCPAY_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        wcpay: payload,
      });
    case SUBMIT_PAYMENT_ENTERPRISE_PAY_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case SUBMIT_PAYMENT_ENTERPRISE_PAY_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        enterprisePay: payload,
        paymentStatus: payload.result === 'pay_success',
      });
    case SUBMIT_PAYMENT_ENTERPRISE_PAY_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        enterprisePay: payload,
      });
    case SUBMIT_PAYMENT_VERIFICATION_CODE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case SUBMIT_PAYMENT_VERIFICATION_CODE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        verificationCode: true,
      });
    case SUBMIT_PAYMENT_VERIFICATION_CODE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        err: payload,
      });
    case FETCH_PAYMENT_ENTERPRISE_ORDER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_PAYMENT_ENTERPRISE_ORDER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        enterpriseOrder: payload,
      });
    case FETCH_PAYMENT_ORDER_ITEM_NUMBER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_PAYMENT_ORDER_ITEM_NUMBER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        orderItemNumber: +payload,
      });
    case RESET_PAYMENT_VERIFICATION_CODE:
      return Object.assign({}, state, {
        verificationCode: false,
      });
    case SET_PAYMENT_STATUS:
      return Object.assign({}, state, {
        paymentStatus: payload,
      });
    default:
      return state;
  }
};

export default payment;
