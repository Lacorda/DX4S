import api from 'utils/api';
import Cookie from 'tiny-cookie';
import defaultAvatar from 'img/avatar.png';
import {
  FETCH_ACCOUNT_USER_REQUEST,
  FETCH_ACCOUNT_USER_FAILURE,
  FETCH_ACCOUNT_USER_SUCCESS,
  FETCH_ACCOUNT_BIZ_REQUEST,
  FETCH_ACCOUNT_BIZ_FAILURE,
  FETCH_ACCOUNT_BIZ_SUCCESS,
} from '../dxConstants/action-types/account';

function fetchUserFailure(err) {
  return {
    type: FETCH_ACCOUNT_USER_FAILURE,
    err,
  };
}

function fetchUserSuccess(info) {
  return {
    type: FETCH_ACCOUNT_USER_SUCCESS,
    info,
  };
}

export function fetchUser() {
  return (dispatch) => {
    dispatch({
      type: FETCH_ACCOUNT_USER_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/account/account/getLoginInfo',
    })
    .then((res) => {
      const data = res.data || {};
      if (res.data.modules && res.data.modules.mall) {
        Cookie.set('mallIcon', res.data.modules.mall);
      } else {
        Cookie.set('mallIcon', true);
      }
      dispatch(fetchUserSuccess({
        id: {
          staff: data.staff_id,
          user: data.user_id,
        },
        is: {
          admin: data.is_sys_admin,
        },
        name: data.person_name,
        avatar: (data.header_url && data.header_url.length > 0 ? data.header_url : defaultAvatar),
        telephone: data.binded_mobile_phone,
        department: data.dept_name,
        modules: data.modules || null,
      }));
    })
    .catch((err) => {
      dispatch(fetchUserFailure(err.response.data));
      throw new Error(JSON.stringify(err.response.data));
    });
  };
}

function fetchBizFailure(err) {
  return {
    type: FETCH_ACCOUNT_BIZ_FAILURE,
    err,
  };
}

function fetchBizSuccess(info) {
  return {
    type: FETCH_ACCOUNT_BIZ_SUCCESS,
    info,
  };
}

export function fetchBiz() {
  return (dispatch) => {
    dispatch({
      type: FETCH_ACCOUNT_BIZ_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/mall/accounts',
    })
    .then((res) => {
      const data = res.data || {};
      dispatch(fetchBizSuccess({
        id: data.accountId,
        name: data.tenant_name,
        balance: data.balance,
      }));
    })
    .catch((err) => {
      dispatch(fetchBizFailure(err.response.data));
      throw new Error(JSON.stringify(err.response.data));
    });
  };
}
