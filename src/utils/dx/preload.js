import $scriptjs from 'scriptjs';

const flexibilitySrc = '//cdn.bootcss.com/flexibility/2.0.1/flexibility.js';

export function loadFlexibility() {
  const ua = window.navigator.userAgent;
  const isIE = ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1;
  if (isIE) {
    return new Promise(resolve =>
      $scriptjs(flexibilitySrc, () => resolve(window.loadFlexibility))
    );
  }
  return Promise.resolve();
}

export default async function loadScripts() {
  await loadFlexibility();
}
