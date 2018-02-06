export default function dingTalkPCOpenLink(selector) {
  if (!__PLATFORM__.DINGTALKPC) return;
  // const parentNode = document.getElementsByClassName(parentSelector);
  const linkDoms = document.querySelectorAll(selector);
  for (let i = 0, len = linkDoms.length; i < len; i += 1) {
    const a = linkDoms[i];
    const url = a.href;

    a.addEventListener('click', (e) => {
      DingTalkPC.biz.util.openLink({
        url,
        onSuccess: () => {},
        onFail: () => {},
      });
      e.preventDefault();
      e.stopPropagation();
    });
  }
}


