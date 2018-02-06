
const defaultPlatform = {
  web: false,
  dingtalk: false,
  wechat: false,
};

module.exports = exports = (targetPlatform) => {
  const platform = Object.assign({}, defaultPlatform);
  if (targetPlatform) {
    platform[targetPlatform] = true;
  } else {
    platform.web = true;
  }
  return platform;
};
