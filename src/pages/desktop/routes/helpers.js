import { fetchUser } from 'dxActions/account';
import store from '../store';

export async function dispatchUser() {
  const state = store.getState();
  if (!state.account.user.id.user) {
    const dispatchFetchUser = fetchUser();
    await dispatchFetchUser(store.dispatch);
  }
}

export async function dispatchUserBeforeEnter(prop, replace, cb) {
  await dispatchUser();
  cb();
}
