import {
  SEND_AUTO_DISAPPEAR_NOTIFICATION,
} from '../dxConstants/action-types/notification';

const initialState = {
  message: '',
  timeout: 5000,
};

export default function notification(state = initialState, action) {
  switch (action.type) {
    case SEND_AUTO_DISAPPEAR_NOTIFICATION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
