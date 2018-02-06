// function

export function noop() {}

export function curryN(n, fn) {
  return function _curry(...args1) {
    if (args1.length >= n) return fn(...args1);
    return function _(...args2) {
      return _curry(...(args1.concat(args2)));
    };
  };
}

export function curry(fn) {
  return curryN(fn.length, fn);
}
export const pipe = curry((fns, arg) => fns.reduce((r, fn) => fn(r), arg));

// strings
export const trim = arg => arg.trim();

// helpers
export const debug = arg => console.log(arg) || arg; // eslint-disable-line no-console
export const id = arg => arg;

// array
export const find = curry((fn, args) => args.find(fn));
export const findIndex = curry((fn, args) => args.findIndex(fn));
export const indexOf = curry((arg, args) => args.indexOf(arg));
export const concat = curry((args1, args2) => args1.concat(args2));
export const last = args => args[args.length - 1];
export const reduce = curry((fn, init, args) => args.reduce(fn, init));
export const map = curry((fn, args) => args.map(fn));

// object
export const prop = curry((p, obj) => obj[p]);

// logic
export const eq = curry((expect, actual) => expect === actual);
export const eqLex = curry((expect, actual) => expect == actual);// eslint-disable-line eqeqeq
export const propEq = curry((p, expect, obj) => obj[p] === expect);
export const gt = curry((arg1, arg2) => arg1 > arg2);
export const lt = curry((arg1, arg2) => arg1 < arg2);
export const defaultTo = curry((d, arg) => (arg === undefined || arg === null ? d : arg));

// high order

// array
export const findEq = curry((expect, args) => find(eq(expect), args));
export const findIndexEq = curry((expect, args) => findIndex(eq(expect), args));
export const findPropEq = curry((p, expect, args) => find(propEq(p, expect), args));
export const findIndexPropEq = curry((p, expect, args) => findIndex(propEq(p, expect), args));
export const diff = curry((fn, args1, args2) =>
  args1.reduce((result, arg) => result.concat(fn(arg, args2) ? [] : arg), []));
export const diffEq = diff((arg, args) => args.indexOf(arg) > -1);
export const diffPropEq = curry((p, args1, args2) =>
  diff((arg, args) => findPropEq(p, prop(p, arg), args), args1, args2)
);
export const pluck = curry((p, args) => map(prop(p), args));

// object
export const emit = curry((keys, obj) =>
  diffEq(Object.keys(obj), keys).reduce((r, key) => Object.assign(r, { [key]: obj[key] }), {}));
export const pick = curry((keys, obj) =>
  keys.reduce((r, key) => Object.assign(r, { [key]: obj[key] }), {}));
