export default function getDintalkClient() {
  if (__PLATFORM__.DINGTALKPC) {
    return window.DingTalkPC;
  } else if (__PLATFORM__.DINGTALK) {
    return window.dd;
  }
  return null;
}
