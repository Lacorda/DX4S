// eslint-disable-next-line import/prefer-default-export
export function getUserLanguage() {
  return (window.navigator.language || window.navigator.userLanguage).slice(0, 2);
}
