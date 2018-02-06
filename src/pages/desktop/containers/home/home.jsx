import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import api from 'utils/api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import dingTalkPCOpenLink from 'utils/dingtalk';
import messages from './messages';
import { signIn as actions } from '../../actions';
import DxHeader from '../../components/header';
import Carousel from '../../components/carousel';
import DxCarouselArrow from '../../components/carousel/dx-carousel-arrow';
import DxFooter from '../../components/footer';
import Cultivate from './cultivate';
import HotListHeader from './header';
import Card from '../../components/card';

import banner1 from './img/banner1.jpg';
import banner2 from './img/banner2.jpg';
import banner3 from './img/banner3.jpg';
import banner4 from './img/banner4.jpg';
import banner5 from './img/banner5.jpg';

class Home extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.updateDimensions = ::this.updateDimensions;
    this.fetchData = ::this.fetchData;
    this.state = {
      bodyWidth: document.body.clientWidth,
      newTrain: null,
      plan: [],
      elective: [],
      live: [],
      maxElectiveLength: 15,
      banners: [],
      dingBanners: [],
      mallTicket: null,
      bannerIsFetched: false,
      dingBannersIsFetched: false,
    };
  }

  async componentDidMount() {
    this.props.fetchIsSigned();
    window.addEventListener('resize', this.updateDimensions);
    this.fetchData().then(() => {
      this.setState({ bodyWidth: document.body.clientWidth });
    });
    const getTicket = (platform) => api({
      method: 'GET',
      url: '/account/change-ticket',
      params: {
        target_platform: platform,
      },
    });
    let [mallTicket] = await Promise.all([
      getTicket('dxMall')
    ]);
    this.setState({
      mallTicket: mallTicket.data.ticket,
    }, () => {
      dingTalkPCOpenLink('.dx-carousel a[target=_blank]');
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  getOutsourceBanner(href, bannerSrc) {
    return (
      <Link
        to={null}
        href={`${href}&ticket=${this.state.mallTicket}`}
        target="_blank"
      >
        <img src={bannerSrc} alt="" />
      </Link>
    );
  }

  getBanners() {
    if (!__PLATFORM__.DINGTALKPC && !this.state.bannerIsFetched) {
      return <div className="empty-banners"></div>
    }
    const settings = {
      className: 'dx-carousel',
      centerMode: true,
      infinite: true,
      autoplay: true,
      draggable: false,
      dots: true,
      dotsClass: 'dx-carousel-dots',
      centerPadding: `${(this.state.bodyWidth - 1200) / 2}px`,
      speed: 500,
      nextArrow: <DxCarouselArrow type="next" />,
      prevArrow: <DxCarouselArrow type="prev" />,
    };
    if (__PLATFORM__.DINGTALKPC && (this.state.dingBannersIsFetched && this.state.dingBanners.length)) {
      return (
        <Carousel {...settings}>
          {this.getDingLinks()}
        </Carousel>
      );
    }
    if ((this.state.dingBannersIsFetched && !this.state.dingBanners.length) || (this.state.bannerIsFetched && !this.state.banners.length)) {
      return (
        <Carousel {...settings}>
          {this.getOutsourceBanner('http://mall.91yong.com/detail?id=1998', banner1)}
          {this.getOutsourceBanner('http://mall.91yong.com/detail?id=1999', banner2)}
          {this.getOutsourceBanner('http://mall.91yong.com/detail?id=209', banner3)}
          {this.getOutsourceBanner('http://mall.91yong.com/detail?id=100', banner4)}
          {this.getOutsourceBanner('http://mall.91yong.com/detail?id=293', banner5)}
        </Carousel>
      );
    }
    if (!__PLATFORM__.DINGTALKPC && (this.state.bannerIsFetched && this.state.banners.length)) {
      return (
        <Carousel {...settings}>
          {this.getImgLinks()}
        </Carousel>
      );
    }
  }

  getDingLinks() {
    const dingBanners = this.state.dingBanners;
    if (dingBanners.length > 0) {
      return dingBanners.map((item, index) => {
        if (item.link_type === 0) {
          return (
            <a href={item.link_url} key={`img-${index}`}>
              <img src={item.img} alt="" key={`img-${index}`} />
            </a>
          );
        }
        if (item.link_type === 7) {
          return (
            <Link to={null} href={`http://mall.91yong.com/detail?id=${item.link_id}&ticket=${this.state.mallTicket}`}
                  target="_blank" key={`img-${index}`}>
              <img src={item.img} alt="" />
            </Link>
          );
        }
      });
    }
  }

  getImgLinks() {
    /*
     link_switch: 0 不跳转
     link_type: {
     0:url,    跳转到一个url
     1:选修课,  跳转到选修课详情
     2:抽奖,    不跳转
     3.考试,    跳转到考试详情
     4. 培训班, 不跳转
     5. 问券    跳转到hybrid
     }
     */
    const banners = this.state.banners;
    if (banners.length > 0) {
      return banners.map((item, index) => {
        if (!item.link_switch) {
          return (
            <Link to={null} key={`img-${index}`}>
              <img src={item.image_url} alt="" key={`img-${index}`} />
            </Link>
          );
        }
        let routePath = null;
        let linkPath = null;
        switch (item.link_type) {
          case 0:
            linkPath = item.link_url;
            return (
              <Link href={linkPath} target="_blank" key={`img-${index}`}>
                <img src={item.image_url} alt="" />
              </Link>
            );
          case 1:
            routePath = `/plan/${item.plan.id}/series/0/courses/${item.link_course_id}`;
            return (
              <Link to={routePath} target="_blank" key={`img-${index}`}>
                <img src={item.image_url} alt="" />
              </Link>
            );
          case 2:
            return (
              <Link key={`img-${index}`}>
                <img src={item.image_url} alt="" />
              </Link>
            );
          case 3:
            routePath = `/plan/${item.plan.id}/series/0/exams/${item.link_course_id}`;
            return (
              <Link to={routePath} target="_blank" key={`img-${index}`}>
                <img src={item.image_url} alt="" />
              </Link>
            );
          case 4:
            return (
              <Link key={`img-${index}`}>
                <img src={item.image_url} alt="" />
              </Link>
            );
          case 5: {
            const surveyPageParams = `survey/index.html?id=${item.link_course_id}`;
            if (__ENVIROMENT__.DEV || __ENVIROMENT__.DEV_DINGTALK) {
              // dev
              linkPath = `http://dev-hybrid.xm.duoxue/${surveyPageParams}`;
            } else if (__ENVIROMENT__.LOCAL || __ENVIROMENT__.LOCAL_DINGTALK) {
              // local
              linkPath = `http://local-hybrid.xm.duoxue/${surveyPageParams}`;
            } else if (__ENVIROMENT__.PRE || __ENVIROMENT__.PRE_DINGTALK) {
              // pre
              linkPath = `http://pre-hybrid.91yong.com/${surveyPageParams}`;
            } else if (__ENVIROMENT__.PRODUCTION || __ENVIROMENT__.PRODUCTION_DINGTALK) {
              // prod
              linkPath = `http://hybrid.91yong.com/${surveyPageParams}`;
            } else {
              // 本地环境使用DEV
              linkPath = `http://dev-hybrid.xm.duoxue/${surveyPageParams}`;
            }
          }
            return (
              <Link href={linkPath} target="_blank" key={`img-${index}`}>
                <img src={item.image_url} alt="" />
              </Link>
            );
          default:
            return false;
        }
      });
    }
    return null;
  }

  async fetchData() {
    // fetchBanner
    const fetchBanner = api({ url: '/account/billing/get?type=3' }).then((res) => {
      const banners = res.data;
      this.setState({ banners, bannerIsFetched: true });
    }).catch((err) => {
      this.setState({ bannerIsFetched: true });
    });

    const fetchDingBanner = api({ url: '/training/advertisement/list?type=5' }).then((res) => {
      this.setState({ dingBanners: res.data, dingBannersIsFetched: true });
    }).catch((err) => {
      this.setState({ dingBannersIsFetched: true });
    });

    // fetchNewTrain
    const fetchNewTrain = api({ url: '/training/new-staff/h5/index' }).then((res) => {
      const newTrain = res.data;
      this.setState({ newTrain });
    }).catch();

    // fetchPlan
    const fetchPlan = api({
      method: 'GET',
      url: '/training/studyArrange/h5/index/list',
      params: { size: 15 },
    }).then((res) => {
      const plan = res.data;
      this.setState({
        plan,
        maxElectiveLength: !plan.length ? 30 : 15,
      });
    }).catch();

    // fetchElective
    const fetchElective = api({
      method: 'GET',
      url: '/training/optional-course/list',
      params: {
        index: 1,
        size: 30,
      },
    }).then((res) => {
      const elective = res.data.optionalCourses;
      this.setState({ elective });
    }).catch();

    // fetchLive
    const fetchLive = api({
      method: 'GET',
      url: '/training/lives/index',
      params: {
        index: 1,
        size: 5,
      },
    }).then((res) => {
      const live = res.data;
      this.setState({ live });
    }).catch();

    await Promise.all([
      fetchBanner,
      fetchDingBanner,
      fetchNewTrain,
      fetchPlan,
      fetchElective,
      fetchLive,
    ]);
  }

  updateDimensions() {
    this.setState({ bodyWidth: document.body.clientWidth });
  }

  linkTo(item) {
    const temp = item;
    if (!item.plan) {
      temp.plan = { id: 0 };
    }
    const type = item.item_type || item.type;
    const id = item.item_id || item.id;
    const pid = temp.plan.id;
    switch (type) {
      case 'course':
        return `/plan/${pid}/series/0/courses/${id}`;
      case 'solution':
        return `/plan/${pid}/series/${id}`;
      case 'exam':
        return `/plan/${pid}/series/0/exams/${id}`;
      case 'live':
        return `/lives/${id}`;
      default:
        return null;
    }
  }

  getMallLink() {
    let mallLink = '';
    if (__ENVIROMENT__.DEV || __ENVIROMENT__.DEV_DINGTALK) {
      // dev
      mallLink = 'http://dev-mall.xm.duoxue';
    } else if (__ENVIROMENT__.LOCAL || __ENVIROMENT__.LOCAL_DINGTALK) {
      // local
      mallLink = 'http://local-mall.xm.duoxue';
    } else if (__ENVIROMENT__.PRE || __ENVIROMENT__.PRE_DINGTALK) {
      // pre
      mallLink = 'http://pre-mall.91yong.com';
    } else if (__ENVIROMENT__.PRODUCTION || __ENVIROMENT__.PRODUCTION_DINGTALK) {
      // prod
      mallLink = 'http://mall.91yong.com';
    } else {
      // 本地环境使用DEV
      mallLink = 'http://dev-mall.xm.duoxue';
    }
    const mallTicketLink = `${mallLink}?ticket=${this.state.mallTicket}`
    return mallTicketLink;
  }

  renderPlan() {
    const { plan } = this.state;
    const mallLink = this.getMallLink();
    if (plan.length) {
      return (
        <div className="home-plan-list">
          <div className="dx-container dx-hot-list">
            <HotListHeader title={this.context.intl.messages['app.home.title.plan']} link="plans" />
            <div className="dx-hot-list-content">
              {
                plan.map((p, i) => (
                  <Card
                    key={`${i}-${p.item_id}`}
                    type={p.item_type}
                    img={p.item_img_url}
                    name={p.item_name}
                    isNew={p.is_new}
                    to={this.linkTo(p)}
                    style={((i + 1) % 5) ? null : { marginRight: 0 }}
                  />
                ))
              }
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="home-plan-list">
        <div className="dx-container dx-hot-list">
          <HotListHeader title={this.context.intl.messages['app.home.title.plan']} link="plans" hasMore={false} />
          {this.renderEmptyCourse()}
        </div>
      </div>
    );
  }

  renderElective() {
    const { elective, maxElectiveLength } = this.state;
    const mallLink = this.getMallLink();
    if (elective.length) {
      return (
        <div className="home-elective-list">
          <div className="dx-container dx-hot-list">
            <HotListHeader title={this.context.intl.messages['app.home.title.elective']} link="electives" />
            <div className="dx-hot-list-content">
              {
                elective.filter((_, i) => (
                  i < maxElectiveLength
                )).map((p, i) => (
                  <Card
                    key={`${i}-${p.id}`}
                    type={p.type}
                    img={`${p.thumbnail_url}?w_250`}
                    name={p.name}
                    to={this.linkTo(p)}
                    style={((i + 1) % 5) ? null : { marginRight: 0 }}
                  />
                ))
              }
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="home-elective-list">
        <div className="dx-container dx-hot-list">
          <HotListHeader title={this.context.intl.messages['app.home.title.elective']} link="electives"
                         hasMore={false} />
          {this.renderEmptyCourse()}
        </div>
      </div>
    );
  }

  renderLive() {
    const { live } = this.state;
    if (live.length) {
      return (
        <div className="home-plan-list">
          <div className="dx-container dx-hot-list">
            <HotListHeader title={this.context.intl.messages['app.home.title.live']} link="lives" />
            <div className="dx-hot-list-content">
              {
                live.map((p, i) => (
                  <Card
                    key={`${i}-${p.id}`}
                    type="live"
                    img={p.img}
                    name={p.name}
                    to={this.linkTo(p)}
                    beginTime={p.begin_time}
                    liveStatus={p.status}
                    style={((i + 1) % 5) ? null : { marginRight: 0 }}
                  />
                ))
              }
            </div>
          </div>
        </div>
      );
    }
    return null;
    /* return (
     <div className="home-plan-list">
     <div className="dx-container dx-hot-list">
     <HotListHeader title={this.context.intl.messages['app.home.title.live']} link="live" hasMore={false} />
     {this.renderEmptyCourse()}
     </div>
     </div>
     );*/
  }

  renderEmptyCourse() {
    const mallLink = this.getMallLink();
    return (
      <div className="dx-course-empty">
        <FormattedMessage {...messages.emptyPart1} />
        <a href={mallLink} className="empty-link" target="_blank" onClick={() => {
          if (__PLATFORM__.DINGTALKPC) {
            DingTalkPC.biz.util.openLink({
              url: mallLink,
              onSuccess: () => {},
              onFail: () => {},
            });
          }
        }}><FormattedMessage {...messages.emptyPart2} /></a>
        <FormattedMessage {...messages.emptyPart3} />
      </div>
    );
  }

  render() {
    const { newTrain } = this.state;
    return (
      <div>
        <DxHeader />
        {this.getBanners()}
        {newTrain ? (
          <Cultivate
            key={newTrain.plan_id}
            id={newTrain.plan_id}
            name={newTrain.plan_name}
            deadline={newTrain.end_time}
            rate={newTrain.finish_rate}
            moreLink="/plan"
          />
        ) : null}
        {this.renderPlan()}
        {this.renderLive()}
        {this.renderElective()}
        <DxFooter />
        {
          this.props.isSigned ? null : (
            <Link to="sign-in-record" className="home-icon-sign-in">&nbsp;</Link>
          )
        }
      </div>
    );
  }
}

Home.propTypes = {
  isSigned: React.PropTypes.bool,
  fetchIsSigned: React.PropTypes.func,
};

const mapStateToProps = state => ({
  isSigned: state.signIn.is_signed,
});

const mapDispatchToProps = dispatch => ({
  fetchIsSigned: bindActionCreators(actions.fetchIsSigned, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
