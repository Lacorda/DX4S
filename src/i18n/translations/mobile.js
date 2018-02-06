const reqCommon = require.context('../../components/', true, /messages?\.js$/);
const reqMobile = require.context('../../pages/mobile/', true, /messages?\.js$/);

const commonMessages = reqCommon.keys().map(filename => reqCommon(filename).default);
const mobileMessages = reqMobile.keys().map(filename => reqMobile(filename).default);
export default commonMessages.concat(mobileMessages);

/*
import commons from './messages';
import footer from '../../pages/mobile/components/footer/messages';
import home from '../../pages/mobile/containers/home/messages';
import profile from '../../pages/mobile/containers/profile/messages';
import comment from '../../pages/mobile/containers/comment/messages';
import seriesDetail from '../../pages/mobile/containers/series-detail/messages';
import electives from '../../pages/mobile/containers/electives/messages';
import exams from '../../pages/mobile/containers/exams/messages';
import myExams from '../../pages/mobile/containers/my-exams/messages';
import plans from '../../pages/mobile/containers/plans/messages';
import practice from '../../pages/mobile/containers/practice/messages';
import exercise from '../../pages/mobile/components/exercise/messages';
import pulltext from '../../components/pulltext/messages';
import feedback from '../../pages/mobile/containers/feedback/messages';
import survey from '../../pages/mobile/containers/survey/messages';
import course from '../../pages/mobile/containers/course/messages';
import favorite from '../../pages/mobile/containers/favorite/messages';
import training from '../../pages/mobile/containers/training/messages';
import manage from '../../pages/mobile/containers/manage/messages';
import preview from '../../pages/mobile/containers/preview/messages';
import setting from '../../pages/mobile/containers/setting/messages';
import calendar from '../../pages/mobile/components/calendar/messages';
import signInRecord from '../../pages/mobile/containers/sign-in-record/messages';
import help from '../../pages/mobile/containers/help/messages';
import account4business from '../../pages/mobile/containers/account/biz/message';
import announcement from '../../pages/mobile/containers/announcement/messages';
import requiredDistribution from '../../pages/mobile/containers/distribution/messages';
import liveDistribution from '../../pages/mobile/containers/distribution/live/messages';
import refreshload from '../../pages/mobile/components/refreshload/messages';
import mallhome from '../../pages/mobile/containers/mall/messages';
import payment from '../../pages/mobile/containers/payment/messages';
import publishElectives from '../../pages/mobile/containers/publish-electives/messages';
import shoppingCart from '../../pages/mobile/containers/shopping-cart/messages';
import staffTask from '../../pages/mobile/containers/staffTask/messages';
import search from '../../pages/mobile/containers/search/messages';
import previewEnd from '../../pages/mobile/containers/preview-mall/messages';
import order from '../../pages/mobile/containers/order/messages';

export default [
  commons,
  footer,
  home,
  profile,
  comment,
  seriesDetail,
  electives,
  exams,
  myExams,
  plans,
  practice,
  exercise,
  pulltext,
  feedback,
  survey,
  course,
  favorite,
  training,
  manage,
  preview,
  setting,
  calendar,
  signInRecord,
  help,
  calendar,
  signInRecord,
  account4business,
  announcement,
  requiredDistribution,
  liveDistribution,
  refreshload,
  mallhome,
  payment,
  publishElectives,
  shoppingCart,
  staffTask,
  search,
  previewEnd,
  order,
];
*/
