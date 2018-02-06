import api from 'utils/api';

import {
  ADD_SHOPPING_CART_REQUEST,
  ADD_SHOPPING_CART_SUCCESS,
  SHOPPING_CART_COUNT_REQUEST,
  SHOPPING_CART_COUNT_SUCCESS,
  FETCH_SHOPPING_CART_REQUEST,
  FETCH_SHOPPING_CART_SUCCESS,
  SETTLEMENT_REQUEST,
  FETCH_CART_BY_QTY_REQUEST,
  FETCH_CART_BY_QTY_SUCCESS,
  SELECT_CART_REQUEST,
  REMOVE_CART_REQUEST,
  REMOVE_CART_SUCCESS,
  UPDATE_CART_REQUEST,
  UPDATE_CART_SUCCESS,
} from '../dxConstants/action-types';

export function addShoppingCartSuccess() {
  return {
    type: ADD_SHOPPING_CART_SUCCESS,
  };
}

export function addShoppingCart(params) {
  return (dispatch) => {
    dispatch({
      type: ADD_SHOPPING_CART_REQUEST,
    });
    return api({
      method: 'POST',
      data: params,
      url: '/mall/shopping-cart/products',
    })
    .then((res) => {
      dispatch(addShoppingCartSuccess(res.data));
    });
  };
}

export function fetchShoppingCartCountSuccess(shoppingCartCount) {
  return {
    type: SHOPPING_CART_COUNT_SUCCESS,
    shoppingCartCount,
  };
}

export function fetchShoppingCartCount(type) {
  return (dispatch, getState) => {
    const state = getState();
    if (type === undefined) {
      // eslint-disable-next-line no-param-reassign
      type = state.account.user.is.admin ? 'all' : 'private';
    }
    dispatch({
      type: SHOPPING_CART_COUNT_REQUEST,
    });
    return api({
      method: 'GET',
      url: `/mall/shopping-cart/products/count?type=${type}`,
    })
    .then((res) => {
      const shoppingCartCount = {
        EnterpriseCount: res.data.item_count || 0,
        PersonalCount: res.data.private_cart_item_count || 0,
      };

      dispatch(fetchShoppingCartCountSuccess(shoppingCartCount));
    });
  };
}

export function fetchShoppingCartSuccess(items, cartItems, cartType) {
  return {
    type: FETCH_SHOPPING_CART_SUCCESS,
    items,
    cartItems,
    cartType,
  };
}

export function fetchShoppingCart(cartType) {
  return (dispatch) => {
    dispatch({
      type: FETCH_SHOPPING_CART_REQUEST,
    });
    return api({
      method: 'GET',
      url: '/mall/shopping-cart/products',
      params: {
        type: cartType,
      },
    })
    .then((res) => {
      const items = [];
      const cartItems = {};

      if (res.data && res.data.shopping_cart_items) {
        res.data.shopping_cart_items.forEach((data) => {
          const item = {
            id: data.id,
          };
          const tempData = data;
          tempData.checked = false;
          cartItems[data.id] = tempData;
          items.push(item);
        });
      }

      dispatch(fetchShoppingCartSuccess(items, cartItems, cartType));
    });
  };
}

export function goSettlement(request) {
  return {
    type: SETTLEMENT_REQUEST,
    request,
  };
}

export function selectCart(selectedRequest) {
  return {
    type: SELECT_CART_REQUEST,
    selectedRequest,
  };
}

export function fetchCartByQtySuccess(cartId, editProduct) {
  return {
    type: FETCH_CART_BY_QTY_SUCCESS,
    cartId,
    editProduct,
  };
}

export function fetchCartByQty(editCart) {
  const cartId = editCart.id;
  const request = {
    product_id: editCart.product_id,
    purchase_type: editCart.purchase_type,
    qty: editCart.count,
  };

  return (dispatch) => {
    dispatch({
      type: FETCH_CART_BY_QTY_REQUEST,
    });
    return api({
      method: 'PUT',
      url: '/mall/shopping-cart/products',
      data: request,
    })
    .then((res) => {
      const data = res.data;
      const editProduct = {
        id: cartId,
        count: data.count,
        has_buyout_price: data.has_buyout_price,
        product_id: data.product_id,
        total_price: data.total_price,
        unit_price: data.unit_price,
      };
      dispatch(fetchCartByQtySuccess(cartId, editProduct));
    });
  };
}

export function removeCartSuccess(removeId) {
  return {
    type: REMOVE_CART_SUCCESS,
    removeId,
  };
}

export function removeCart(params) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_CART_REQUEST,
    });
    return api({
      method: 'DELETE',
      url: `/mall/shopping-cart/products?ids=${params.id}&type=${params.type}`,
    })
    .then(() => {
      dispatch(removeCartSuccess(params.id));
    });
  };
}

export function updateCartSuccess() {
  return {
    type: UPDATE_CART_SUCCESS,
  };
}

export function updateCart(editCart) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CART_REQUEST,
    });
    return api({
      method: 'PUT',
      url: '/mall/shopping-cart/product',
      data: editCart,
    })
    .then(() => {
      dispatch(updateCartSuccess());
    });
  };
}
