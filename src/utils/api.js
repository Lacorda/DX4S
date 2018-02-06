import axios from 'axios';
import Cookie from 'tiny-cookie';
import { setting } from 'utils/storage';

// Set config defaults when creating the instance
const instance = axios.create({});
const ACCEPT_LANGUAGE = {
  zh: 'zh-CN,zh',
  en: 'en-US,en',
};
let reqConfig;

// device, set request header param 'os'
let device;
if (/(iphone|ipad)/ig.test(navigator.appVersion)) device = 'ios';
else if (/(android)/ig.test(navigator.appVersion)) device = 'android';
else device = 'pc';

// Add a request interceptor
instance.interceptors.request.use(
  // Do something before request is sent
  (config) => {
    reqConfig = config;
    const ticket = Cookie.getRaw('USER-TICKET') || 'USER-TICKET';
    reqConfig.headers.ticket = ticket;
    reqConfig.headers.os = `h5-${device}`;
    // TODO: 需根据平台判断
    reqConfig.headers.source = 'dingtalk';
    reqConfig.headers['Accept-Language'] = ACCEPT_LANGUAGE[setting.get('language')];
    // 不加这个会使得content-type无法设置到request的headers中
    if (!reqConfig.data) {
      reqConfig.data = {};
    }
    if (!reqConfig.params) reqConfig.params = {};
    Object.assign(reqConfig.params, { _r: Math.random() });
    // url
    reqConfig.url = reqConfig.url.replace(/^\.?\/?/i, './');
    return reqConfig;
  },
  // Do something with request error
  error => Promise.reject(error)
);

let hasDingTalkBanAlerted = false;
// Add a response interceptor
instance.interceptors.response.use(
  // Do something with response data
  response => response,
  // response => {
  //   alert(response.data)
  //   return response
  // },
  // Do something with response error
  (error) => {
    const httpStatusCode = error.response.status;
    // PC登录失效是403 mobile登录失效是401
    const isUnauthenticated = httpStatusCode === 403 || httpStatusCode === 401;
    if (__PLATFORM__.DINGTALK && isUnauthenticated) {
      if (!hasDingTalkBanAlerted) {
        hasDingTalkBanAlerted = true;
        setTimeout(() => { hasDingTalkBanAlerted = false; }, 1000); // 一秒后再次开启提示
        const dingtalkClient = typeof window.dd === 'undefined' ? window.DingTalkPC : window.dd;
        dingtalkClient.device.notification.alert(
          { message: '您的多学账号因在其他设备使用而被登出！如果您希望在当前设备继续使用“多学”，请关闭后再次点击“多学”图标登录即可。' }
        );
      }
      return Promise.reject(error);
    }

    if (!__platform__.dingtalk) {
      const status = httpStatusCode;
      if (__device__.desktop && status === 403) {
        window.location = './#/account';
        // Cookie.set('USER-TICKET', '');
        // Cookie.remove('USER-TICKET');
      }
      if (!__device__.desktop && status === 403) {
        if (window.location.hash) {
          const urlHref = window.location.hash;
          let str = urlHref.match(/\?(\S*)\&/);
          str = str ? str[1] : '';
          Cookie.set('urlHref', urlHref);
          if (str) {
            window.location = './#/account/signInCom?' + str;
          } else {
            window.location = './#/account';
          }
        } else {
          window.location = './#/account';
        }

        //Cookie.set('USER-TICKET', '');
        //Cookie.remove('USER-TICKET');
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
