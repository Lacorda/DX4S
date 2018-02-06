const appVersion = /(dingtalk|micromessenger)/i.exec(navigator.appVersion);
const name = appVersion ? appVersion[0].toLowerCase() : 'web';

function isWhat(target) {
  return name === target;
}

const is = {
  web: isWhat('web'),
  dingtalk: isWhat('dingtalk'),
  wechat: isWhat('micromessenger'),
};

const platform = {
  id: 0,
  name,
  is,
};

module.exports = platform;
