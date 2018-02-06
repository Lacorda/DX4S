import {
  FETCH_NEW_MESSAGE_REQUEST,
  FETCH_NEW_MESSAGE_SUCCESS,
} from '../dxConstants/action-types';


const initialState = {
  isFetching: false,
  newMessage: {},
};

const NewMessage = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NEW_MESSAGE_REQUEST:
      return Object.assign({}, state, { isFetching: true });
    case FETCH_NEW_MESSAGE_SUCCESS:
      return Object.assign({}, state, { isFetching: false, newMessage: action.newMessage });
    default:
      return state;
  }
};

export default NewMessage;
