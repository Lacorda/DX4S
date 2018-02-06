import React, { Component } from 'react';
import api from 'utils/api';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';
import Pulltext from '../../../../components/pulltext';
import RefreshLoad from '../../components/refreshload';


const fetchSizeInit = 10;
const contextTypes = {
  intl: React.PropTypes.object.isRequired,
};
class Favorite extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      favorite: [],
      fetchIndex: 0,
      fetchSize: fetchSizeInit,
      isFetching: false,
      isfavoriteDate: true,
      isTofetchData: false,
      needPullUp: true,
    };

    this.handleDelete = ::this.handleDelete;
    this.fetchFavoriteList = ::this.fetchFavoriteList;
    this.setNavBar = ::this.setNavBar;
    this.pullDownCallBack = ::this.pullDownCallBack;
    this.pullUpCallBack = ::this.pullUpCallBack;
    this.refreshLoad = ::this.refreshLoad;
  }

  componentDidMount() {
    this.fetchFavoriteList();
    window.addEventListener('scroll', this.bodyScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.bodyScroll);
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.favorite.title'],
    });
  }

  pullUpCallBack(cb) {
    this.fetchFavoriteList("", cb);
  }

  pullDownCallBack(cb) {
    this.refreshLoad(cb);
  }

  refreshLoad(cb) {
    const self = this;
    api({
      url: '/training/my/favor/list',
      params: {
        index: 1,
        size: self.state.fetchSize,
      },
    }).then(function(resp) {
      let favorite = resp.data;
      const isfavoriteDate = resp.data.length === self.state.fetchSize;
      let needPullUp = true;
      if (favorite.length < self.state.fetchSize) {
        needPullUp = false;
      }
      self.setState({
        favorite,
        isfavoriteDate,
        isTofetchData: true,
        isFetching: false,
        needPullUp,
        fetchIndex: 1
      }, cb);
    });
  }


// 获取数据
  fetchFavoriteList(type, cb) {
    const self = this;
    let fetchIndex;
    let fetchSize;

    if (type === 'delete') {
      fetchIndex = 1;
      fetchSize = self.state.favorite.length;
    } else {
      fetchIndex = self.state.fetchIndex + 1;
      fetchSize = fetchSizeInit;
    }
    // 请求
    function fetchList() {
      (async function fetchData() {
        const fetchFavorite = await api({
          url: '/training/my/favor/list',
          params: {
            index: self.state.fetchIndex,
            size: self.state.fetchSize,
          },
        });

        let favorite;

        if (type === 'delete') {
          favorite = fetchFavorite.data;
        } else {
          favorite = self.state.favorite.concat(fetchFavorite.data);
        }

        const isfavoriteDate = fetchFavorite.data.length === self.state.fetchSize;

        let needPullUp = true;
        if (fetchFavorite.data.length < self.state.fetchSize) {
          needPullUp = false;
        }
        self.setState({ favorite, isfavoriteDate, isTofetchData: true, isFetching: false, needPullUp });
        if (cb)
          cb();
      }());
    }
    self.setState({ fetchIndex, fetchSize, isFetching: true }, fetchList);
  }

  getLoadText() {
    if (!this.state.isfavoriteDate)
      return (
        <Pulltext isMore={this.state.isfavoriteDate} />
      )
    return '';
  }

// 删除收藏
  handleDelete(planId, courseId) {
    const self = this;
    (async function fetchData() {
      await api({
        method: 'PUT',
        url: `/training/plan/${planId}/solution/0/course/${courseId}/favor`,
        data: {
          is_favor: false,
        },
      });

      self.fetchFavoriteList('delete');
    }());
  }

  render() {
    this.setNavBar();

    if (this.state.favorite.length > 0) {
      return (
        <RefreshLoad  pullUpCallBack={this.pullUpCallBack}
                     pullDownCallBack={this.pullDownCallBack} needPullUp={this.state.needPullUp}>
          <div className="favorite">
            <ul className="card card-horizontal">
              {this.state.favorite.map((item, index) => {
                const linkTo = `/plan/${item.plan.id}/series/${item.solution_id || 0}/courses/${item.task_id}`;
                return (
                  <li key={index}>
                    <div className="card-img">
                      <Link to={linkTo}>
                        <img alt={item.task_name} src={item.img} />
                        <span className="type-icon"><FormattedMessage id="app.favorite.type" /></span>
                      </Link>
                    </div>
                    <div className="card-text">
                      <p className="name">
                        <Link to={linkTo}>
                          {item.task_name}
                        </Link>
                      </p>
                      <i className="icon icon-delete" onClick={() => this.handleDelete(item.plan.id, item.task_id)} />
                    </div>
                  </li>
                );
              })}
            </ul>
            {this.getLoadText()}
          </div>
        </RefreshLoad>
      );
    } else if (this.state.isTofetchData) {
      return (
        <div className="list-no-msg">
          <p><FormattedMessage id="app.favorite.noMsg" /></p>
        </div>
      );
    }
    return null;
  }
}
Favorite.contextTypes = contextTypes;
export default Favorite;
