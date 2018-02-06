import Cookie from 'tiny-cookie';

const ls = localStorage;
const STORAGE_SYMBOL = '__local_store__';
const SETTING_SYMBOL = '__setting_store__';

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function createStorage(prefix, get, set) {
  const store = JSON.parse(get(prefix)) || {};
  return {
    get(key) {
      return key ? store[key] : deepCopy(store);
    },
    set(key, value) {
      store[key] = value;
      set(prefix, JSON.stringify(store));
    },
  };
}

export function createCookieStorage(prefix) {
  return createStorage(prefix, Cookie.get, Cookie.set);
}

export function createStorageStorage(prefix) {
  return createStorage(prefix, ls::ls.getItem, ls::ls.setItem);
}

export const cookie = createCookieStorage(STORAGE_SYMBOL);
export const storage = createStorageStorage(STORAGE_SYMBOL);
export const setting = createStorageStorage(SETTING_SYMBOL);
export const createIsolateStorage = id => createStorageStorage(`${STORAGE_SYMBOL}${id}`);
export default storage;
