const bunny = require('./bunny.png');

const store = {
  title: {},
  right: {},
};

if (__PLATFORM__.WEB && __DEVICE__.MOBILE) {
  // const navId = 'global-nav';
  const doc = document;
  const body = doc.body;
  body.className += `${body.className.length === 0 ? '' : ' '}fixed-navbar-top`;
  // nav bar
  const $nav = doc.createElement('div');
  const attrClass = doc.createAttribute('class');
  attrClass.value = 'navbar navbar-static-top';
  $nav.setAttributeNode(attrClass);

  // set content
  $nav.innerHTML = `<div class="inner">
                        <a class="nav navbar-nav nav-back"><</a>
                        <a class="navbar-brand">${doc.title}</a>
                        <a class="nav navbar-nav navbar-right"></a>
                      </div>`;

  // render
  body.appendChild($nav);

  // store elem
  store.nav = { dom: $nav };
  store.title = { dom: $nav.querySelector('.navbar-brand') };
  store.back = { dom: $nav.querySelector('.nav-back') };
  store.right = { dom: $nav.querySelector('.navbar-right') };

  // set right hide
  store.right.dom.style.display = 'none';
  store.right.enable = false;

  store.back.dom.addEventListener('click', () => {
    history.back();
  });

}

// 设置标题
function setTitle(options) {
  const shouldRender = {};
  if (!store.title.text || (!options && store.title.text != document.title)) {
    shouldRender.text = document.title;
  }
  if (options && options.title && store.title.text !== options.title) {
    shouldRender.text = options.title;
  }

  // 成功回调
  function done() {
    Object.assign(store.title, shouldRender);
    if (shouldRender.text) {
      document.title = shouldRender.text;
    }
  }

  // 若无变更内容则不做修改
  if (!shouldRender.text) { return; }

  if (__platform__.dingtalk) {
    require.ensure([], (require) => {
      const sdk = require('utils/3rd/dingtalk/nav');

      sdk.setTitle(shouldRender);
      done();
    });
  } else if (__platform__.wechat) {
    done();
    // iOS下微信必须有个刷新的动作才能触发document.title刷新
    // 所以加个iframe骗它刷新
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS) {
      const iframe = document.createElement('iframe');
      iframe.src = bunny;
      const onLoad = function _onLoad() {
        setTimeout(() => {
          iframe.removeEventListener('load', onLoad);
          iframe.parentNode.removeChild(iframe);
        }, 0);
      };
      iframe.onload = onLoad;
      document.body.appendChild(iframe);
    }
  } else {
    store.title.dom.innerText = shouldRender.text;
    done();
  }
}
// function setLeft(options) {}
function setRight(options) {
  const right = store.right || {};
  const shouldRender = {};

  // if options is null
  if (!options) {
    if (right.enable) {
      shouldRender.enable = false;
    }
  } else {
    // enable
    if (!right.enable) {
      shouldRender.enable = true;
    }
    // text
    if (options.text && right.text !== options.text) {
      shouldRender.text = options.text;
    }
    // event
    if (options.event && typeof options.event === 'function') {
      shouldRender.event = options.event;
    } else if (right.event) {
      shouldRender.event = null;
    }
  }

  // done
  function done() {
    Object.assign(right, shouldRender);
  }

  // 若无变更内容则不做修改
  // if (shouldRender.enable === undefined
  //   && shouldRender.text === undefined
  //   && shouldRender.event === undefined) { return; }

  if (__platform__.dingtalk) {
    require.ensure([], (require) => {
      const sdk = require('utils/3rd/dingtalk/nav');

      if (!shouldRender.text) {
        shouldRender.text = right.text;
      }
      sdk.setRight(shouldRender);
      done();
    });
  } else if (__platform__.wechat) {
    done();
  } else {
    if (typeof shouldRender.enable === 'boolean') {
      right.dom.style.display = shouldRender.enable ? 'block' : 'none';
    }
    if (typeof shouldRender.text === 'string') {
      right.dom.innerText = shouldRender.text;
    }
    if (typeof shouldRender.event === 'function' || shouldRender.event === null) {
      if (right.event) {
        right.dom.removeEventListener('click', right.event);
      }
      if (shouldRender.event) {
        right.dom.addEventListener('click', shouldRender.event);
      }
    }
    done();
  }
}

function close(options) {}

const Nav = {
  setTitle,
  // setLeft,
  setRight,
  close,
};


module.exports = Nav;
