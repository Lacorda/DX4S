
import { combineReducers } from 'redux';
import user from './user';
import biz from './biz';

const accountReducer = combineReducers({
  user,
  biz,
});

export default accountReducer;
