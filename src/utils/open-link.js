import getDingtalkClient from 'utils/3rd/dingtalk/get-dingtalk-client';

export default function openLink(url) {
  if (__PLATFORM__.DINGTALK) {
    getDingtalkClient().biz.util.openLink({
      url,
      onSuccess: () => {},
      onFail: () => {},
    });
  } else {
    window.location = url;
  }
}
