
import banner1 from './assets/banner-1.jpg';
import banner2 from './assets/banner-2.jpg';
import './style.styl';
import '../../components/footer/footer.styl';

// init object
const doc = document;
// wrapper dom for dingtalk
const wrapper = doc.createElement('div');
doc.body.appendChild(wrapper);
wrapper.setAttribute('class', 'home dd-home');
// hide root of react
const root = doc.getElementById('root');
root.style.display = 'none';
// number of elective to show
let lenForElective = 8;
// content of carousel
const carousel = `<div class="carousel">
  <div class="inner">
    <img src="${banner1}" />
    <img src="${banner2}" />
    <img src="${banner1}" />
  </div>
</div>`;
// content of footer
const footer = `<div class="footer">
  <div class="fixed-bottom">
    <span class="line"></span>
    <ul>
      <li><a class="menu_home active" href="#/home"><span>课程中心</span></a></li>
      <li><a class="menu_profile" href="#/profile"><span>个人中心</span></a></li>
    </ul>
  </div>
</div>`;
// first append
wrapper.innerHTML = `<div></div>${carousel}<div></div>${footer}`;
const inner = wrapper.children[2];
const __test = wrapper.children[0];

function linkTo(options) {
  const type = options.item_type || options.type;
  const id = options.item_id || options.id;
  const pid = options.plan.id;
  switch (type) {
    case 'course':
      return `/plan/${pid}/series/0/courses/${id}`;
    case 'solution':
      return `/plan/${pid}/series/${id}`;
    case 'exam':
      return `/plan/${pid}/series/0/exams/${id}`;
    default:
      return null;
  }
}

function makeCardOfPlan(data) {
  return `<div class="card">
    <div class="card-face">
      <a href="#${linkTo(data)}">
        <img src="${data.item_img_url}?w_250" />
      </a>
    </div>
    <div class="card-content">
      <p>${data.item_name}</p>
    </div>
  </div>`;
}

function makeCardOfElective(data) {
  return `<div class="card">
    <div class="card-face">
      <a href="#${linkTo(data)}">
        <img src="${data.thumbnail_url}?w_250" />
      </a>
    </div>
    <div class="card-content">
      <p>${data.name}</p>
    </div>
  </div>`;
}

function makePlan(data) {
  let tmpl = '';
  data.forEach((item) => { tmpl += makeCardOfPlan(item); });
  tmpl = `<div class="section">
    <div class="title">
      <span class="title-content">学习安排</span>
      <span class="title-more pull-right"><a href="#/plans">更多</a></span>
    </div>
    <div class="clearfix">${tmpl}</div></div>`;
  return tmpl;
}

function makeElective(data) {
  let tmpl = '';
  for (let i = 0; i < lenForElective; i += 1) {
    tmpl += makeCardOfElective(data[i]);
  }
  tmpl = `<div class="section">
    <div class="title">
      <span class="title-content">选修课</span>
      <span class="title-more pull-right"><a href="#/electives">更多</a></span>
    </div>
    <div class="clearfix">${tmpl}</div></div>`;
  return tmpl;
}

function loadRender() {
  require.ensure([], (require) => {
    require('../../renderWithIntl')(() => {
      wrapper.remove();
      root.style.display = 'block';
    });
  });
}

function addEvent() {
  const els = document.getElementsByTagName('a');
  for (let i = 0, l = els.length; i < l; i += 1) {
    els[i].addEventListener('click', () => {
      loadRender();
    }, false);
  }
}

function run(data) {
  let tmpl = '';
  const plans = data.study_arrange_list || [];
  const electives = data.optional_course_list || [];

  if (plans && plans.length) {
    tmpl += makePlan(plans);
    if (plans.length > 0) lenForElective = 4;
  }

  const lenOfElective = electives.length;
  if (electives && lenOfElective) {
    if (lenOfElective < lenForElective) lenForElective = lenOfElective;
    tmpl += makeElective(electives);
  }

  __time.push(`end: ${Date.now() - __pre}ms (${Date.now() - __start}ms)`);
  __test.innerHTML = __time.join('<br/>');

  inner.innerHTML = tmpl;
  addEvent();
}

// init function
function init(data) {
  __time.push(`home: ${Date.now() - __start}ms`);
  __pre = Date.now();
  run(data);
}

export default init;
