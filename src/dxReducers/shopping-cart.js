import update from 'immutability-helper';
import {
  SHOPPING_CART_COUNT_REQUEST,
  SHOPPING_CART_COUNT_SUCCESS,
  FETCH_SHOPPING_CART_REQUEST,
  FETCH_SHOPPING_CART_SUCCESS,
  SETTLEMENT_REQUEST,
  FETCH_CART_BY_QTY_SUCCESS,
  SELECT_CART_REQUEST,
  REMOVE_CART_SUCCESS,
} from '../dxConstants/action-types';

const initialState = {
  isFetching: false,
  cartCount: {
    EnterpriseCount: 0,
    PersonalCount: 0,
  },
  items: [],
  cartItems: {},
  orderRequest: {},
};

function ShoppingCart(state = initialState, action) {
  let cartItems = {};
  switch (action.type) {
    case SHOPPING_CART_COUNT_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case SHOPPING_CART_COUNT_SUCCESS:
      return Object.assign({}, state, { isFetching: false, cartCount: action.shoppingCartCount });
    case FETCH_SHOPPING_CART_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_SHOPPING_CART_SUCCESS:
      {
        // 及时更新购物车数量
        const cartCountTmp = state.cartCount;
        if (action.cartType === 'enterprise') {
          cartCountTmp.EnterpriseCount = action.items.length;
        }
        if (action.cartType === 'private') {
          cartCountTmp.PersonalCount = action.items.length;
        }

        return Object.assign({}, state, {
          isFetching: false,
          items: action.items,
          cartItems: action.cartItems,
          cartCount: cartCountTmp,
        });
      }
    case SETTLEMENT_REQUEST:
      return Object.assign({}, state, { isFetching: false, orderRequest: action.request });
    case FETCH_CART_BY_QTY_SUCCESS:
      {
        const { cartId, editProduct } = action;
        cartItems = update(state.cartItems, {
          [cartId]: {
            count: { $set: editProduct.count },
            total_price: { $set: editProduct.total_price },
            unit_price: { $set: editProduct.unit_price },
          },
        });
      }
      return { ...state, cartItems };
    case SELECT_CART_REQUEST:
      {
        const request = action.selectedRequest;
        const requestId = request.id;
        switch (request.type) {
          case 'single':
            cartItems = update(state.cartItems, {
              [requestId]: {
                checked: { $set: !state.cartItems[requestId].checked },
              },
            });
            return { ...state, cartItems };
          case 'all':
            state.items.forEach((item) => {
              const tempData = state.cartItems[item.id];
              const disabledItem = (tempData.product_type === 'live' && (tempData.live_status === 'over' || tempData.live_status === 'on_live')) || tempData.status !== 'onshelves';
              tempData.checked = !disabledItem;
              cartItems[item.id] = tempData;
            });
            return { ...state, cartItems };
          case 'clear':
            state.items.forEach((item) => {
              const tempData = state.cartItems[item.id];
              tempData.checked = false;
              cartItems[item.id] = tempData;
            });
            return { ...state, cartItems };
          default:
            return state;
        }
      }
    case REMOVE_CART_SUCCESS:
      {
        const index = state.items.findIndex(product => product.id === action.removeId);
        const items = update(state.items, { $splice: [[index, 1]] });
        return { ...state, items };
      }
    default:
      return state;
  }
}

export default ShoppingCart;
