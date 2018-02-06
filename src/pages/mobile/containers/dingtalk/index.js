import { timeStart, timeEnd } from 'utils/3rd/dingtalk/debug';

const swipe = require('./swipe');
require('./style.styl');
require('../../components/footer/footer.styl');
const api = require('utils/api').default;

const doc = document;
const loading = doc.querySelector('#app-loding');
const root = doc.querySelector('#root');
const home = doc.querySelector('#dd-home');
const carousel = doc.querySelector('#dd-carousel .inner');
const dot = doc.querySelector('#dd-carousel .dot');
const entrance = doc.querySelector('#dd-entrance');
const s1 = doc.querySelector('#dd-s1 div');
const s2 = doc.querySelector('#dd-s2 dl');
const s3 = doc.querySelector('#dd-s3 dl');

const makeCarousel = (name, img, link) => `<div><a href="#${link}"><img src="${img}" alt="${name}"></a></div>`;
const makeEntrance = (name, img, link, id) => `<div class="wrapper"><a href="#${link}" id="${id || ''}"><img src="${img}" alt="${name}"><span>${name}</span></a></div>`;
const makeS1 = (title, img, link) => `<p><a href="#${link}"><img src="${img}" alt="" class="cover"><span class="title">${title}</span></a></p>`;
const makeS2 = (name, img, link) => `<dt><a href="#${link}"><img src="${img}" alt="${name}" /></a></dt>`;
const makeS3 = (name, img) => `<dt><img src="${img}" alt="${name}" /></dt>`;


let isRender = false;
function loadRender() {
  if (isRender) {
    home.style.display = 'none';
    root.style.display = 'block';
  } else {
    loading.style.display = 'block';
    require.ensure([], (require) => {
      home.style.display = 'none';
      root.style.display = 'block';
      require('../../renderWithIntl')(() => {
        loading.style.display = 'none';
        isRender = true;
      });
    });
  }
}

function sign() {
  timeStart('调用/isTodaySignin');
  return api({
    method: 'GET',
    url: '/account/account/isTodaySignin',
  }).then((res) => {
    timeEnd('调用/isTodaySignin');
    if (!res.data.flag) {
      return api({ method: 'GET', url: '/account/account/signin' });
    }
    return null;
  });
}

function addEvent() {
  const els = doc.querySelectorAll('#dd-home a');
  for (let i = 0, l = els.length; i < l; i += 1) {
    if (!/#\/$/ig.test(els[i].href)) {
      if (els[i].id === 'dd-sign') {
        els[i].addEventListener('click', () => {
          sign().then(() => { loadRender(); });
        }, false);
      } else if (els[i].id === 'to_course_center') {
        home.style.display = 'block';
        root.style.display = 'none';
      } else {
        els[i].addEventListener('click', () => {
          loadRender();
        }, false);
      }
    }
  }
}

function init() {
  dd.biz.navigation.setTitle({ title: '多学' });
  dd.biz.navigation.setRight({ show: false });
  // carousel
  // banner1：2.9.2是死图片，下一版本可跳转专题页
  // banner2：跳转分类——“名人说”
  // banner3：跳转课程——雷军的2016是风口还是刀口
  // banner4：跳转课程——中餐礼仪的桌次和座次
  dot.innerHTML = '<i></i><i></i><i></i><i></i>';
  carousel.innerHTML = [
    makeCarousel('', require('./img/banner-0.png'), '/products/course/1999'),
    makeCarousel('', require('./img/banner-1.png'), '/products/course/1998'),
    makeCarousel('', require('./img/banner-2.png'), '/products/course/209'),
    makeCarousel('', require('./img/banner-3.png'), '/products/course/100'),
    makeCarousel('', require('./img/banner-4.png'), '/products/course/293'),
  ].join('');
  const icon1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABUUExURUxpccTs/8Ts/8Pr/sTs/8Ts/8Pr/sTs/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/zMzMzis/////0VJSzg5OnKDjFdgZLzR2+Pn6ai/y52wuYCVn4ujrzIlabsAAAAOdFJOUwCn3vZcAe2CK8cGAwkNHXsTkQAAAmlJREFUWMO9mdtyqzAMRY1tfKMjzgmQJu3//2dNypAQQJYN6n7JhIc1mi3ZI0tCJNU4bSsvjQJlpPeV1a4RR1U76xWspLx19QGssxJ2Ja0rozbaQ0Je53sStASCpA6Z0ZKwv+iMqJ2HDHmq18FCpmw4P1x60NpAgYxOHQgLhbLogWkqKFaFVEc4wI3kQI6379otdX1ezPUq3nZH3V7M2z6v87YHbnczuFlnsAX+vxYCho2qc+oMsFqdlLB13vLB4EPS4BKP1zY7OAsMCzMafx7YN3hFTOB/oybU8odSGR/yTLD8wDNXDH7mL5hzwSbgDheDZ5f92WCP1fAR8FTL9nzwI321PB8sa9SJcvDDC8sBtlhNHAHHumgUB1g1mMUHwNFkzQPWWO6OgK2oeMAVVhRHwF5IHrAUhgdshOIBKwE8YOCKGLg8VjlV8fxKSZ7nAUsusOc70myXENu16Xg8dqIxHGATm+SKA1xhLeERsE42LPlPhblhwVusMvCjxcKbwjKwTbSxfWTc356P9/itp7Wx+9eFGiLltuDe4pdB0RpvpC5Gcnd94V47And+KoT9M2IuC/LIvSSnUfPjBruIrpF8+Zy4n+OfK9BShz0g38hE7ssDEr3ibt1EHrndDYDqMPJIf5KHCB5o3MUjHb08YSzdYeS299WhSYwV0PwBfEdC9KH9hjTYUkY3s74ekC9Ig1ejG+HQ8uwpB3ksYUcajy2GhhQuaNpAL38kmxxBtjlKjSBfh6ZF4P1B73PMWwKuwt8PpvlG6XzDf8Z1Bd+ChW8lxLjE4lu7MS4KGVebnMvY9/XxY39MXB//AIIIVAlPd9apAAAAAElFTkSuQmCC';
  const icon2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABsUExURUxpccTs/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/zMzMzis/////2BrcLzi9HeHjmx3fYGPlj1AQlZfY/n6+pCcoarK2kVKTI6ns8rR1L3FydTrfngAAAASdFJOUwBgBsHwp80rAeCKg1MDeHAJDdIPEn0AAALLSURBVFjDtZnZduIwDIazOHZMlvaICdBAS+i8/zuO4zCQRd5jXXFC+PCRJVv6lSRGa1hdFTknBIBwmhdVzZok1ErW5gK4NpK3rAzAsoqD0njF/KhNmoPB8tTdJ1nKwcJ4mjmu1go7oR1WzSg4GLX1dXYARztk+y/XftE1AQ8jtSkhKvC0SpswTQHeVmiiIwvgCnIWY726NZeBXEHG/VxBsB3QOJu/cTna22X2OyTq2CJ+jy42j+dNpmTLfPMFA12Hxup8EK//sbMVeO1mBnuBYeGMhu4HpvNoTmE/MKRv7iffE8w/X+AP2BMMH69Q4/uCeabycEAcL7xM9wZTPIbDwc9YPuBgywMNfVOmX8n3B/NS4YlQsPRFGwPcCnCufn22O8p/wr/IxflDYoBJg7s4GCycnEIMH4vkq+KAq6SIAy7woFj5WJ276vYk4XHAPCHB4DNaMGvBVtZf7ygYAsH98YiSQ8H96CKM7OTjrav76cmWTJyiYgMeuae/V4RMEhoAltzv7hchc22CGOwycTuMnAek9IvbdfLjKqVbX/CM+yM+3s6rK6T2BOu5omdgfmADVxz0uqvJnyuuJnz3DOCR+6Xhir3Dalgj2MiVlax7wWLmyoLFucSS3E7LlSWWa1H4teSezsrWlzmBZ9xexf3fklEHsBWXalsFf+6rVcCbG0vuoGlu8HYM4f6suOOzQdOO4Q0kAr6Jx/2Si4BnDSTa8iIFxKR7LM/fQdfyok36Fvx4KiqLc33QNumYrIBuXT9u321+XwxaWQETQrZgcbP9ft/kqt/30KAXQhDpZsO9j24Y3tyztMEg3ejFpuusOBlDbvmOVmxayWMYeHLC9fQ4gxKMirIHte52fQbbcLlv//xiEPRMEuTj9Lj7SZDRRNN4Mm88YTqelB5P/I84rog3YIk3Eoo4xIo3dos4KIw42ow5jN2Ojwm3HR//A/zEtpfwM2BUAAAAAElFTkSuQmCC';
  const icon3 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA2UExURUxpccTs/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/zMzMzis/////z0/QXiMlXaJkbPa6ToAAAALdFJOUwCnJDAF8IbHW+B1DCIluAAAAfpJREFUWMO1melyxSAIhWNcULlt0/d/2WbmLs2iqCDnd/IlA8cFWJamnI3BQPIe0ScAE6J1i1g2ww68ykO2EuoaElaVwsqjugjYEETHwCbsUBpF92Gf6JGMAQ4IevPoAg4qdMVjBRwWdBgkemTINyMdkKlAh9cgW8bpcCmyjEuQhdyd3Mzb9hjQ1shgPHz6MaTDiwXXrX4G2N9Wijutt+fT53cqujwEjlwYfPA1zBZngfG818E8MNQccQeTGbt//eAMl2aC03/+MrbAP2eRYMzVH76Dv8+iwZ9fjjgX/IkyzAZD0cMTwC8vh/ng5/JLHeAhV+zpq0RC5uN3LLIGOBc9Idsr3r5wXgPs3bKiBngPckSNGO+LL+iAQ/kyIQeboikmxBiWpANOi9cBez0w6oBxGXp6BOx1wJ5yhQwMWnZTWyBGB2yKB8iEGGdq25SAI7XRS8ArdTQJwPvRVMyeGGzI418AzuSFRQC25BWLD070pZAPDvQ1lg+2xMWbV/KeK7I4Gxyp4qZfv9XipliOfXWougFRBSQffCggSyXv68WKKHCki3Q2GBptBTbYNhoh3BiHVuuGCb61brjNpusGv85qj1GOkDT0tq6WrFYLUq9pqtbm1WtM67XSFZv/euMKvQGL3khIcYilOHbTGxQqjjY1h7H38bFPvePjPzT3DDkTC8OBAAAAAElFTkSuQmCC';
  const icon4 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABCUExURUxpccTs/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/8Ts/zMzMzis/zw+QP///2h3fmuAjHeJkoCJjjywT7MAAAANdFJOUwAFdYJbAqfmxyuKhYn6aTBUAAACjElEQVRYw8WZ65arIAyFK14CdehYdd7/Vcfq1CruQAQ5Z/9k4beyYgIkud2Cqk1VNpqIrCXSumkrU9+SZZSegK5IK5NELQF0hZeR7KLSNiBdFRFYsgLRSXQtwy7oE3/SaHtCWurr4sue1L243ly50XLv7j0d4pY2UqU/GhobrcYTHUUCdyIXOez12pzInciY29pktTDO0M7xMWsMLy4CUWegCY8/hRf/dMiUQl8D1m5o3C0Hfj4B+Li4nhsSR8SA986oNfxns2aGq91it/uNuvZExOMU2LF9ExkFXQmmz/9TwLXfs96M762cxYO3FWtwIng1ubI+8CwXvF08xsfby/pqsGZjeP1qWBDDDuwsgog2XNK5NnoFwEv60fVg4rI5FTz7QuUAKxgT+8yT6Hh6TucP5QBTjQ/MZPDk5IoBy29QuLnCb6p0cIsfE+ngBgbFBWB9ozxgigP322uOAdsIcD9doDnA/evMDG2OAL+4fXDzeR+73KvABy7nY0Ecj93g4SaAuw8LcLkEEaT0sNIQl0tpJfDxmwe5GKxkx+ZCxFzu2DSiqHgxO8y1zEHPXU0gyjDXMlcT/Htgb89xIbjhr//D2rCJ5uBmxT9Y0s5jwz+x/LDRf0uT51EYtHJb3eBHoYkDd4tg8Ws8D+8QuHvO+kFc7SsVZGDIXUsFWNyIwD/7S+pQj6lIMOZ+yjFYQArADHdTQKKSNwxmuLtmiFukS8Acd1eku7EsTJBB0GO5R4AHQSPEad18EosRyz20bm6GTpYKkEvG3x4bg9huhC6q/mVDL18LMl/TNFubN43cFP+jlZ6x+Z9vXDE5+p5nwJJvJJRxiJVv7JZxUJhxtJlzGLuOj9vX+HgmknR8/Atfhz0qVH+JZgAAAABJRU5ErkJggg==';

  // 快速入口
  entrance.innerHTML = [
    makeEntrance('我的学习', icon1, '/plans'),
    makeEntrance('我的考试', icon2, '/exams'),
    makeEntrance('选修课', icon3, '/electives'),
    makeEntrance('签到', icon4, '/sign-in-record', 'dd-sign'),
  ].join('');
  // section 1
  s1.innerHTML = [
    makeS1('没搞定几个爱砍价的顾客，都不好意思说自己是好销售', 'http://cdnf.91yong.com/prod/-4/img/8f55765873874f22b64ab89638f3fe4c.jpg?w_250', '/products/course/77'),
    makeS1('如何做才能让“想再去转转看”的顾客不再犹豫不决', 'http://cdnf.91yong.com/prod/-4/img/fcaa797ec5994cffa8e1769899b805b4.jpg?w_250', '/products/course/80'),
    makeS1('速来领取“多学课堂”为你准备的三个谈判获胜至尊法宝', 'http://cdnf.91yong.com/prod/-4/img/d6b62b2af6ef4bdfa29eacbd3900aeb9.jpg?w_250', '/products/course/85'),
    makeS1('团队作战的时代，你知道如何提升员工的团队意识吗', 'http://cdnf.91yong.com/prod/-4/img/f0ed68fc6ae242e5b35f33eb62949f03.jpg?w_250', '/products/course/613'),
  ].join('');
  // section 2
  // 管理提升——对应【领导力】
  // 业务进阶——对应【市场与销售】
  // 新人入职——对应【职业素养】
  s2.innerHTML = [
    makeS2('管理提升', require('./img/s2-1.png'), '/mall/more/4035'),
    makeS2('业务进阶', require('./img/s2-2.png'), '/mall/more/3987'),
    makeS2('新人入职', require('./img/s2-3.png'), '/mall/more/4012'),
  ].join('');
  // section 3
  s3.innerHTML = [
    makeS3('', require('./img/s3-1.png')),
    makeS3('', require('./img/s3-2.png')),
    makeS3('', require('./img/s3-3.png')),
  ].join('');
  // event
  addEvent();
  // show
  root.style.display = 'none';
  home.style.display = 'block';
  swipe(doc.querySelector('.swipe'), { speed: 400, auto: 2000, continuous: true });
}

module.exports = exports = init;
