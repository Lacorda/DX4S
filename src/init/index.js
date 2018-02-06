import 'utils/dx/env';
import $scriptjs from 'scriptjs';
import dingtalkIndexHTML from 'raw-loader!./mobile-dingtalk-index.html'; // eslint-disable-line import/no-unresolved

const DINGTALK_MOBILE_CLIENT_SRC = 'http://g.alicdn.com/dingding/open-develop/1.0.0/dingtalk.js';
const DINGTALK_DESKTOP_CLIENT_SRC = 'https://g.alicdn.com/dingding/dingtalk-pc-api/2.6.2/index.js';


/**
 * 异步加载script
 * @param src
 * @return {Promise}
 */
export function asyncLoadScript(src) {
  return new Promise(resolve => $scriptjs(src, resolve));
}

// 百度统计
export function loadBaiduAnalysis() {
  window._hmt = window._hmt || []; // eslint-disable-line no-underscore-dangle
  const hm = document.createElement('script');
  hm.src = 'https://hm.baidu.com/hm.js?c24c9f9502d0dfbdbea1dfcb0c45937b';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(hm, s);
}

// 钉钉移动客户端
export function loadDingtalkMobileClient() {
  return asyncLoadScript(DINGTALK_MOBILE_CLIENT_SRC);
}

// 钉钉PC客户端
export function loadDingtalkPCClient() {
  return asyncLoadScript(DINGTALK_DESKTOP_CLIENT_SRC);
}

// 初始化
// 钉钉下加载相应客户端，如果是移动版的钉钉，还会加载相应的钉钉移动版首页
// 非钉钉环境下加载百度统计
export default function init() {
  const loadScriptTask = [];
  if (__PLATFORM__.DINGTALK) {
    if (__PLATFORM__.DINGTALKPC) loadScriptTask.push(loadDingtalkPCClient());
    else {
      loadScriptTask.push(loadDingtalkMobileClient());
      document.body.innerHTML += dingtalkIndexHTML; // 加入钉钉首页
    }
  } else {
    loadScriptTask.push(loadBaiduAnalysis());
  }

  return Promise.all(loadScriptTask);
}
