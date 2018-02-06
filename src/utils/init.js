import './dx/env';
import loadScripts from './dx/preload';

if (__DEVICE__.IE) {
  let className = ' ie';
  if (__DEVICE__.IE9) className += ' ie9';
  if (__DEVICE__.IE10) className += ' ie10';
  if (__DEVICE__.IE11) className += ' ie11';
  document.getElementById('root').className += className;
}

export default async function () {
  await loadScripts();
}
