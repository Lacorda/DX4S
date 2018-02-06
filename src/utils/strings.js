/* eslint-disable import/prefer-default-export */
/**
 * truncate string with '...'
 * @param {Number} length
 * @param {String} str
 * @return {String}
 */
export function truncate(length, str) {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}
