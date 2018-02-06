const ua = window.navigator.userAgent;

export function isIE() {
  return ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1;
}

export function isIE9() {
  return ua.indexOf('MSIE 9') !== -1;
}

export function isIE10() {
  return ua.indexOf('MSIE 10') !== -1;
}

export function isIE11() {
  return isIE() && ua.indexOf('rv:11');
}

export function checkIsMobile() {
  // eslint-disable-next-line max-len
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent || navigator.vendor || window.opera);
}

export const DEVICE = {
  MOBILE: checkIsMobile(),
  IE: isIE(),
  IE9: isIE9(),
  IE10: isIE10(),
  IE11: isIE11(),
};

export function checkIsInDingtalk() {
  return !!/dingtalk/i.exec(navigator.appVersion);
}

export function checkIsInWechat() {
  return /micromessenger/i.test(ua);
}

export const PLATFORM = {
  DINGTALK: checkIsInDingtalk(),
  DINGTALKPC: checkIsInDingtalk() && !DEVICE.MOBILE,
  WEB: !checkIsInDingtalk(), // todo wechat
};

const [, domain, env] = location.href.split(/\/+/);

export const ENVIRONMENT = {
  DEV: domain === 'duoxue.91yong.com' && env === 'dev',
  DEV_DINGTALK: domain === 'dingtalk-m.91yong.com' && env === 'dev',
  LOCAL: domain === 'duoxue.91yong.com' && env === 'local',
  LOCAL_DINGTALK: domain === 'dingtalk-m.91yong.com' && env === 'local',
  PRE: domain === 'duoxue.91yong.com' && env === 'pre',
  PRE_DINGTALK: domain === 'pre-dingtalk.91yong.com',
  PRODUCTION: domain === 'duoxue.91yong.com' && ['pre', 'local', 'dev'].indexOf(env) === -1,
  PRODUCTION_DINGTALK: domain === 'dingtalk-m.91yong.com' && ['pre', 'local', 'dev'].indexOf(env) === -1,
};

/* eslint-disable no-underscore-dangle*/
window.__DEVICE__ = DEVICE;
window.__PLATFORM__ = PLATFORM;
window.__ENVIROMENT__ = ENVIRONMENT;

window.__device__ = {
  desktop: !checkIsMobile(),
  mobile: checkIsMobile(),
};

window.__platform__ = {
  dingtalk: checkIsInDingtalk(),
  wechat: checkIsInWechat(),
  web: !checkIsInDingtalk() && !checkIsInWechat(),
};
/* eslint-enable*/
