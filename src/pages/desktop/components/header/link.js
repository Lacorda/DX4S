export function getELink() {
  let eLink = '';
  if (__ENVIROMENT__.DEV || __ENVIROMENT__.DEV_DINGTALK) {
    // dev
    eLink = 'http://dev-e.xm.duoxue';
  } else if (__ENVIROMENT__.LOCAL || __ENVIROMENT__.LOCAL_DINGTALK) {
    // local
    eLink = 'http://local-e.xm.duoxue';
  } else if (__ENVIROMENT__.PRE || __ENVIROMENT__.PRE_DINGTALK) {
    // pre
    eLink = 'http://pre-e.91yong.com';
  } else if (__ENVIROMENT__.PRODUCTION || __ENVIROMENT__.PRODUCTION_DINGTALK) {
    // prod
    eLink = 'http://e.91yong.com';
  } else {
    // 本地环境使用DEV
    eLink = 'http://dev-e.xm.duoxue';
  }
  return eLink;
}

export function getMallLink() {
  let mallLink = '';
  if (__ENVIROMENT__.DEV || __ENVIROMENT__.DEV_DINGTALK) {
    // dev
    mallLink = 'http://dev-mall.xm.duoxue';
  } else if (__ENVIROMENT__.LOCAL || __ENVIROMENT__.LOCAL_DINGTALK) {
    // local
    mallLink = 'http://local-mall.xm.duoxue';
  } else if (__ENVIROMENT__.PRE || __ENVIROMENT__.PRE_DINGTALK) {
    // pre
    mallLink = 'http://pre-mall.91yong.com';
  } else if (__ENVIROMENT__.PRODUCTION || __ENVIROMENT__.PRODUCTION_DINGTALK) {
    // prod
    mallLink = 'http://mall.91yong.com';
  } else {
    // 本地环境使用DEV
    mallLink = 'http://dev-mall.xm.duoxue';
  }
  return mallLink;
}
