/**
 * 使用 HTML5 的 History 新 API pushState 来曲线监听 Android 设备的返回按钮
 * @author lieqin
 * @date 2016/12/19
 * @version 1.0
 * @example
 * XBack(function(){
    alert('oh! you press the back button');
  });
 */
const xBackFun = (listen) => {
  const STATE = 'x-back';
  const record = (state) => {
    history.pushState(state, null, location.href);
    history.pushState(state, null, location.href);
  };

  const init = () => {
    record(STATE);
    setTimeout(() => {
      window.onpopstate = (e) => {
        window.onpopstate = null;
        if (e.state === STATE) {
          listen();
        }
      };
    }, 300);
  };

  init();
};

export default xBackFun;
