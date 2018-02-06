/* global dd */

// dingtalk 文档
// https://open-doc.dingtalk.com/docs/doc.htm?treeId=171&articleId=104910&docType=1

// 调用以下两个接口时，若返回状态码为400，且errorCode为10000，则代表服务端需要进行重试
//  /account/dingtalk/login
//  /account/dingtalk/config

import api from 'utils/api';
import urlParam from 'utils/urlParam';
import { timeStart, timeEnd } from './debug';

// const start = (new Date()).getTime();
const apiList = [
  'biz.navigation.setTitle',
  'biz.navigation.setRight',
];

const pageUrl = window.location.href;
const appId = urlParam('appid');
const corpId = urlParam('corpid');

let configParams = null;

// message helper
const $msg = document.getElementById('login-msg');
function setMessage(text) {
  $msg.innerText = text;
}

function apiLogin(done, result) {
  timeStart('调用/login');
  api({
    method: 'post',
    url: '/account/dingtalk/login',
    // url: '/account/dingtalk/login/aggregation',
    data: {
      corpId,
      code: result.code,
    },
  }).then((response) => {
    timeEnd('调用/login');
    setMessage('正在转跳...');
    done(response.data);
  }).catch((err) => {
    alert(err);
    const res = err.response || { data: {} };
    if (res.status === 400 && res.data.errorCode === 10000) {
      apiLogin(done);
    }
  });
}

function getUserInfo(done) {
  timeStart('校验身份');
  setMessage('校验用户身份...');
  dd.runtime.permission.requestAuthCode({
    corpId,
    onSuccess: (result) => {
      timeEnd('校验身份');
      setMessage('正在登录...');
      apiLogin(done, result);
    },
    onFail: (err) => {
      window.alert(`fail: ${JSON.stringify(err)}`);
    },
  });
}

function setInitConfig(done) {
  dd.biz.navigation.setRight({ show: false });
  timeStart('初始化应用配置');
  setMessage('初始化应用配置...');
  if (dd) {
    dd.config({
      ...configParams,
      jsApiList: apiList,
    });
    dd.ready(() => {
      timeEnd('初始化应用配置');
      getUserInfo(done);
    });
    dd.error(() => {
    });
  }
}

function apiConfig(done) {
  timeStart('调用/config');
  if (corpId && appId) {
    api({
      method: 'post',
      url: '/account/dingtalk/config',
      data: {
        corpId,
        appId,
        signedUrl: pageUrl,
      },
    }).then((response) => {
      timeEnd('调用/config');
      // step2Do -= 1;
      configParams = response.data;
      setInitConfig(done);
    }).catch((err) => {
      const res = err.response || { data: {} };
      if (res.status === 400 && res.data.errorCode === 10000) {
        apiConfig(done);
      }
    });
  }
}

function init(done) {
  setMessage('获取应用参数...');
  apiConfig(done);
  // if (!requestDingtalk) {
  //   $scipt(ddAPIUrl, () => {
  //     step2Do -= 1;
  //     setInitConfig(done);
  //   });
  //   requestDingtalk = true;
  // }
}

exports.init = init;
