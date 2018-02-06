import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import api from 'utils/api';
import { nav } from 'utils/dx';
import './style.styl';

import Carousel from '../../components/Carousel';
import RefreshLoad from '../../components/refreshload';
import Card from './card';
import Header from './Header';
import Footer from '../../components/footer';
import SignIn from './sign-in';
import TrainItem from '../../components/ListItems/TrainItem';

import messages from './messages';
import banner1 from './assets/banner-1.jpg';
import banner2 from './assets/banner-2.jpg';
import NoMsg from './nomsg';
import {
  newMessage as newMessageActions,
  account as accountActions,
} from '../../actions';

function linkTo(options) {
  const temp = options;
  if (!options.plan) {
    temp.plan = { id: 0 };
  }
  const type = options.item_type || options.type;
  const id = options.item_id || options.id;
  const pid = temp.plan.id;
  switch (type) {
    case 'course':
      return `/plan/${pid}/series/0/courses/${id}`;
    case 'solution':
      return `/plan/${pid}/series/${id}`;
    case 'exam':
      return `/plan/${pid}/series/0/exams/${id}`;
    case 'live':
      return `/live/${id}`;
    default:
      return null;
  }
}
class Home extends React.Component {
  static contextTypes = {
    intl: PropTypes.object,
    router: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      newTrain: [],
      plan: [],
      live: [],
      elective: { optionalCourses: [] },
      planIsLoading: true,
      electiveIsLoading: true,
      banners: [],
      key: 0,
      inited: false,
    };
    this.refreshNav = this.refreshNav.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.pullDownCallBack = this.pullDownCallBack.bind(this);
    this.getBanners = this.getBanners.bind(this);
    this.getImgLinks = this.getImgLinks.bind(this);
  }


  componentDidMount() {
    const self = this;
    self.fetchData().then(() => {
      const rndNum = Math.random();
      self.setState({ key: rndNum });
    });
    // 更新用户信息
    if (!self.props.user.lastUpdated) this.props.fetchUser();
  }


  getBanners() {
    if (__platform__.dingtalk || this.state.banners.length === 0) {
      return (
        <Carousel dots autoplay>
          <img src={banner1} alt="多学" />
          <img src={banner2} alt="多学" />
        </Carousel>
      );
    }
    return (
      <Carousel dots autoplay>
        { this.getImgLinks() }
      </Carousel>
    );
  }

  getImgLinks() {
    // link_switch: 0  :getImgUrl  link #
    // link_switch:1 :getImgUrl
    // link: link_type: 1:选修课 2:抽奖 3.考试 4. 培训班 5. 问券
    //

    const banners = this.state.banners;
    if (banners.length > 0) {
      return banners.map((item, index) => {
        let linkPath;
        if (item.link_switch === 0) {
          return (<img src={item.image_url} alt="" key={`img${index}`} />);
        } else {
          switch (item.link_type) {
            case 0:
              return (<img
                src={item.image_url}
                alt=""
                key={`img${index}`}
                onClick={() => {
                  location.href = item.link_url;
                }}
              />);
            case 1:
              linkPath = `/plan/${item.plan.id}/series/0/courses/${item.link_course_id}/detail`;
              return (<img
                src={item.image_url}
                alt=""
                key={`img${index}`}
                onClick={() => {
                  this.context.router.push(linkPath);
                }}
              />);
            case 2:
              return (<img src={item.image_url} key={`img${index}`} alt="" />);
            case 3:
              linkPath = `/plan/${item.plan.id}/series/0/exams/${item.link_course_id}`;
              return (<img
                src={item.image_url}
                key={`img${index}`} alt=""
                onClick={() => {
                  this.context.router.push(linkPath);
                }}
              />);
            case 4:
              return (<img src={item.image_url} alt="" key={`img${index}`} />);
            case 5:
              return (<img
                src={item.image_url}
                alt=""
                key={`img${index}`}
                onClick={() => {
                  const surveyPageParams = `survey/index.html?id=${item.link_course_id}`;
                  if (window.location.href.indexOf('m.91yong.com/dev') > -1
                    || window.location.href.indexOf('duoxue.91yong.com/dev') > -1
                    || window.location.href.indexOf('wechat-m.91yong.com/dev') > -1
                    || window.location.href.indexOf('dingtalk-m.91yong.com/dev') > -1) {
                    // dev
                    linkPath = `http://dev-hybrid.xm.duoxue/${surveyPageParams}`;
                  } else if (window.location.href.indexOf('m.91yong.com/local') > -1
                    || window.location.href.indexOf('duoxue.91yong.com/local') > -1
                    || window.location.href.indexOf('wechat-m.91yong.com/local') > -1
                    || window.location.href.indexOf('dingtalk-m.91yong.com/local') > -1) {
                    // local
                    linkPath = `http://local-hybrid.xm.duoxue/${surveyPageParams}`;
                  } else if (window.location.href.indexOf('m.91yong.com/pre') > -1
                    || window.location.href.indexOf('duoxue.91yong.com/pre') > -1
                    || window.location.href.indexOf('wechat-m.91yong.com/pre') > -1
                    || window.location.href.indexOf('dingtalk-m.91yong.com/pre') > -1) {
                    // pre
                    linkPath = `http://pre-hybrid.91yong.com/${surveyPageParams}`;
                  } else if (window.location.href.indexOf('m.91yong.com') > -1
                    || window.location.href.indexOf('duoxue.91yong.com') > -1
                    || window.location.href.indexOf('wechat-m.91yong.com') > -1
                    || window.location.href.indexOf('dingtalk-m.91yong.com') > -1) {
                    // prod
                    linkPath = `http://hybrid.91yong.com/${surveyPageParams}`;
                  } else {
                    // 使用DEV
                    linkPath = `http://dev-hybrid.xm.duoxue/${surveyPageParams}`;
                  }
                  location.href = linkPath;
                }}
              />);
            default:
              return null;
          }
        }
      });
    }
    return null;
  }

  refreshNav() {
    nav.setTitle({
      title: this.context.intl.messages['app.home.navTitle'],
    });
    if (__platform__.dingtalk) {
      nav.setRight({
        text: this.context.intl.messages['app.home.courseManage'],
        event: () => { this.context.router.push('/manage'); },
      });
    }
  }

  async fetchData() {
    const fetchPlan = api({ url: '/training/studyArrange/h5/index/list' });
    // const fetchElective = api({ url: '/training/optional-course/recommendation' });
    // TODO change the fetchNewTrain Url
    const fetchNewTrain = api({ url: '/training/new-staff/h5/index' });
    const fetchElective = api({ url: '/training/optional-course/list' });
    // const fetchBanner = api({ url: '/account/advertisement/get?type=3' });
    const fetchBanner = api({ url: '/account/billing/get?type=3' });

    const fetchLive = api({ url: '/training/lives/index' });

    let [plan, elective, newTrain, live] =
      await Promise.all([fetchPlan, fetchElective, fetchNewTrain, fetchLive]);
    [plan, elective, newTrain, live] = [plan.data, elective.data, newTrain.data, live.data];
    const check = arg => arg ? (Object.keys(arg).length ? arg : null) : null;
    this.setState({
      plan,
      elective,
      newTrain: check(newTrain) ? [newTrain] : null,
      live,
      planIsLoading: false,
      electiveIsLoading: false,
      inited: true,
    }, () => {
      fetchBanner.then((data) => {
        this.setState({
          banners: data.data,
        });
      });
    });
    if (__platform__.dingtalk) {
      this.props.actions.fetchNewMessage();
    }
  }

  pullDownCallBack(cb) {
    this.fetchData().then(() => {
      cb();
    });
  }


  render() {
    if (!this.state.inited) return null;
    let newTrainArea; // area of newTrain .Hide When none;
    let planArea; // area of the plan.Hide when none
    let liveArea;
    let electiveArea;// area of the elective.Hide when none

    this.refreshNav();
    if (!this.state.newTrain) newTrainArea = null;
    else {
      newTrainArea = (
        <div>
          <Header to="/plan">
            <FormattedMessage {...messages.newTrainTitle} />
          </Header>
          <div className="train">
            {
              this.state.newTrain.map(p => (
                <TrainItem
                  link={`/plan/detail/${p.plan_id}`}
                  end_time={p.end_time}
                  icon_text={'截止'}
                  img_Url={p.img_url}
                  name={p.plan_name}
                  task_rate={p.finish_rate}
                  key={p.plan_id}
                />
              ))
            }
          </div>
        </div>
      );
    }
    const hasPlan = this.state.plan.length;
    const courseTypeInof = function getTypeInfo(info) {
      switch (info) {
        case 'elective':
          return {
            msgKey: 'elective',
            cls: 'blue',
          };
        case 'personal':
          return {
            msgKey: 'private',
            cls: 'orange',
          };
        default:
          return null;
      }
    };

    if (!hasPlan) {
      planArea = (
        <div>
          <Header to="/plans">
            <FormattedMessage {...messages.planTitle} />
          </Header>
          <div>
            <NoMsg />
          </div>
        </div>
      );
    } else {
      planArea = (
        <div>
          <Header to="/plans">
            <FormattedMessage {...messages.planTitle} />
          </Header>
          {
            this.state.plan.map((p, i) => (
              <Card
                key={`${i}-plans-${p.item_id}`}
                alt={p.item_name}
                content={p.item_name}
                imageURL={`${p.item_img_url}?w_250`}
                type={p.item_type}
                to={linkTo(p)}
                externalClass={i % 2 ? '' : 'left'}
                isNew={p.is_new}
                typeInfo={courseTypeInof(p.task_source)}
              />
            ))
          }
        </div>
      );
    }

    // TODO live area
    const shouldShowliveArea = !!this.state.live.length;
    const timeStampFormat = function getTimeStampFormat(timeStamp) {
      if (!timeStamp) {
        return '';
      }
      const newDate = new Date();
      newDate.setTime(timeStamp);
      return moment(newDate).format('YYYY-MM-DD HH:mm');
    };
    const liveStatus = function getLiveStatus(status) {
      /* 直播时间状态 */
      switch (status) {
        case 'not_start':
          return {
            msgKey: 'liveStatusNotStart',
            cls: 'b3',
          };
        case 'about_to_start':
          return {
            msgKey: 'liveStatusAboutToStart',
            cls: 'b3',
          };
        case 'on_live':
          return {
            msgKey: 'liveStatusOnLive',
            cls: 'a1',
          };
        case 'over':
          return {
            msgKey: 'liveStatusOnLive',
            cls: 'z2',
          };
        default:
          return null;
      }
    };
    if (!shouldShowliveArea) liveArea = null;
    else {
      liveArea = (
        <div>
          <Header to="/lives">
            <FormattedMessage {...messages.liveCourseTitle} />
          </Header>
          {
            this.state.live.filter((_, i) => i < 2).map((p, i) => (
              <Card
                key={`${p.id}-live-${i}`}
                alt={p.name}
                content={p.name}
                imageURL={`${p.img}?w_250`}
                to={linkTo(p)}
                externalClass={i % 2 ? '' : 'left'}
                type={p.type}
                isNew={false}
                statusInfo={timeStampFormat(p.begin_time)}
                typeInfo={liveStatus(p.status)}
              />
            ))
          }
        </div>
      );
    }

    const hasElective = this.state.elective.optionalCourses.length;
    if (!hasElective) electiveArea = null;
    else {
      // display 8 electives when no plan
      const electiveLength = 4; // hasPlan ? 4 : 4;
      electiveArea = (
        <div>
          <Header to="/electives">
            <FormattedMessage {...messages.electiveTitle} />
          </Header>
          {
            this.state.elective.optionalCourses.filter((_, i) => i < electiveLength).map((p, i) => (
              <Card
                key={`${p.id}-elective-${i}`}
                alt={p.name}
                content={p.name}
                imageURL={`${p.thumbnail_url}?w_250`}
                to={linkTo(p)}
                externalClass={i % 2 ? '' : 'left'}
                type={p.type}
                isNew={false}
              />
            ))
          }
        </div>
      );
    }
    const pushArea = (
      <div className="home" key={this.state.key}>
        <RefreshLoad
          needPullUp={false}
          pullDownCallBack={this.pullDownCallBack}
          pullUpCallBack={() => {}}
        >
          <div className="carousel">
            { this.getBanners() }
          </div>
          <div className="main clearfix">
            {newTrainArea}
            {planArea}
            {liveArea}
            {electiveArea}
          </div>
          <div className="bottomBlank" />
        </RefreshLoad>
      </div>
    );
    return (
      <div>
        {pushArea}
        <Footer />
        <SignIn />
      </div>
    );
  }
}

Home.propTypes = {
  user: PropTypes.shape({}),
  newMessage: PropTypes.shape({}),
  actions: PropTypes.shape({ fetchNewMessage: PropTypes.func }),
  fetchUser: PropTypes.func,
};


// export default connect()(Home);
const mapStateToProps = state => (
  {
    user: state.account.user,
    newMessage: state.newMessage.newMessage || {},
  }
);

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(newMessageActions, dispatch),
    fetchUser: bindActionCreators(accountActions.fetchUser, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
