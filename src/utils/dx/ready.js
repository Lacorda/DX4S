import Cookie from 'tiny-cookie';
import api from 'utils/api';
import urlParam from 'utils/urlParam';
import init from '../../init';

function setTicket(ticket) {
  const options = {
    expires: '1Y',
  };

  if (window.location.href.indexOf('xm.duoxue') > -1) {
    options.domain = 'xm.duoxue';
  } else if (window.location.href.indexOf('91yong.com') > -1) {
    options.domain = '91yong.com';
  }
  Cookie.remove('USER-TICKET');
  Cookie.set('USER-TICKET', ticket, options);
}

function initPromise(done) {
  init().then(done);
}

function Ready(callback) {
  function done(data) {
    if (typeof callback === 'function') {
      callback(data);
    }
    const $loding = document.getElementById('app-loding');
    if ($loding) {
      $loding.style.display = 'none';
      document.getElementById('login-msg').innerText = '';
    }
  }

  // initIntlPolyfill(() => initPromise(() => {
  initPromise(() => {
    if (__platform__.dingtalk) {
      require('utils/3rd/dingtalk').init((data) => {
        setTicket(data.ticket);
        if (data.ticket) done(data);
      });
    } else {
      const tenantCode = urlParam('tenant');
      const token = urlParam('token');
      const deviceCode = urlParam('deviceCode');
      if (tenantCode && token) {
        // 金牌免登功能
        api({
          method: 'POST',
          url: '/account/third-party/login',
          data: {
            tenant_code: tenantCode,
            token,
            device_code: deviceCode,
          },
        }).then((response) => {
          setTicket(response.data.ticket);
          done();
        });
      } else {
        done();
      }
    }
  });
}

module.exports = Ready;
