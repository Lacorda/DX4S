/* global DingTalkPC */
import $scriptjs from 'scriptjs';
import Cookie from 'tiny-cookie';
import urlParam from 'utils/urlParam';
import api from 'utils/api';

const DINGTALK_PC_SRC = 'https://g.alicdn.com/dingding/dingtalk-pc-api/2.6.2/index.js';

const pageUrl = window.location.href;
const appId = urlParam('appid');
const corpId = urlParam('corpid');

export function getDingTalkPCClient() {
  if (typeof DingTalkPC === 'undefined') {
    return new Promise(resolve => $scriptjs(DINGTALK_PC_SRC, () => resolve(DingTalkPC)));
  }
  return Promise.resolve(DingTalkPC);
}

export function requestAuthCode() {
  return new Promise((onSuccess, onFail) => {
    DingTalkPC.runtime.permission.requestAuthCode({ corpId, onSuccess, onFail });
  });
}

export function getDingTalkConfig() {
  return api({
    method: 'post',
    url: '/account/dingtalk/config',
    data: { corpId, appId, signedUrl: pageUrl },
  });
}

export function configDingTalk(dingTalkConfig) {
  DingTalkPC.config(dingTalkConfig);
  return new Promise((resolve, reject) => {
    DingTalkPC.ready(resolve);
    DingTalkPC.error(reject);
  });
}

export function getUserTicket(code) {
  return api({
    method: 'post',
    url: '/account/dingtalk/login',
    data: { corpId, code },
  });
}

export function setTicket(ticket) {
  const domain = document.domain.split('.').slice(-2).join('.');
  const options = { expires: '1Y', domain };
  Cookie.remove('USER-TICKET');
  Cookie.set('USER-TICKET', ticket, options);
}

export async function ready(done) {
  if (__PLATFORM__.DINGTALKPC) {
    await getDingTalkPCClient(); // 加载钉钉客户端
    if (appId && corpId) {
      const { data: dingTalkConfig } = await getDingTalkConfig(); // 从服务端获取钉钉配置数据
      await configDingTalk(dingTalkConfig); // 将配置数据初始化钉钉客户端
      const { code } = await requestAuthCode(); // 获取钉钉的CODE用于登录
      const { data: ticketResponse } = await getUserTicket(code); // 用户登录
      setTicket(ticketResponse.ticket);
    }
  }
  return Promise.resolve(done && done());
}
