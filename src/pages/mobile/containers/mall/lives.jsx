import React, { Component } from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { locationShape } from 'react-router';
import moment from 'moment';
import { setTitle } from 'utils/dx/nav';
import { NOT_START, ON_LIVE, OVER } from 'dxConstants/live-type';
import * as apis from '../../apis.js';
import Refreshload from '../../components/refreshload/refreshload';
import Loading from '../../components/loading';
import './lives.styl';

function checkHasMore(page, currentIndex) {
  return page.total_page > currentIndex;
}

const { object } = React.PropTypes;

function Live({
  live: {
    name,
    cover_url: cove,
    begin_time: beginTime,
    lecturer,
    unit_price: price,
    sales,
    is_free: isFree,
  },
  onClick,
}) {
  return (
    <div className="live-item" onClick={onClick}>
      <div className="cover">
        <div className="cover-image">
          <img src={cove} alt={name} />
          <span className="cover-footer">{moment(beginTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>
      </div>
      <div className="live-info">
        <div className="title">{name}</div>
        <div className="other">
          <span className="lecture">{lecturer}</span>
        </div>
        <div className="sales">
          <div className="price">{isFree ?
            <FormattedMessage id={'app.mall.mallhome.free'} /> : `￥${price}` }
          </div>
          <div className="count">
            {sales}
          </div>
        </div>
      </div>
    </div>
  );
}

Live.propTypes = {
  live: object, // eslint-disable-line react/forbid-prop-types
  onClick: React.PropTypes.func,
};

class LiveProductList extends Component {
  constructor() {
    super();
    this.state = {
      active: NOT_START,
      lives: [],
      index: 1,
      hasMore: false,
      isFetching: false,
      empty: false,
    };
    this.onClick = ::this.onClick;
  }

  async componentDidMount() {
    setTitle({ title: this.context.intl.messages['app.mall.live.list.title'] });
    const type = this.props.location.query.type || NOT_START;
    await this.switchLiveType(type);
    this.refreshIScrollWrapper();
  }

  onClick(live) {
    const router = this.context.router;
    router.push(router.createPath(`products/live/${live.id}`));
  }

  refreshIScrollWrapper = () => { if (this.iScrollWrapper) this.iScrollWrapper.refresh(); };

  asyncSetState = state => new Promise(resolve => this.setState(state, resolve));

  async switchLiveType(type) {
    const liveResult = await apis.getMallLiveListByStatus(type, { index: 1 });
    const lives = liveResult.items || [];
    this.context.router.replace({ pathname: 'mall/lives', query: { type } });
    await this.asyncSetState({
      active: type,
      lives,
      hasMore: checkHasMore(liveResult.page, 1),
      empty: !lives.length,
    });
  }

  async paginate() {
    const { active, index, lives } = this.state;
    const fetchedLiveResult = await apis.getMallLiveListByStatus(active, { index: index + 1 });
    const fetchedLives = fetchedLiveResult.items || [];
    await this.asyncSetState({
      hasMore: checkHasMore(fetchedLiveResult.page, index + 1),
      index: index + 1,
      lives: lives.concat(fetchedLives),
    });
  }

  renderTab(liveType) {
    const tabClass = classnames(
      'dx-plain-tabs-item',
      { active: this.state.active === liveType }
    );

    return (
      <div
        className={tabClass}
        onClick={() => this.switchLiveType(liveType).then(this.refreshIScrollWrapper)}
      >
        <FormattedMessage id={`app.mall.live.tab.${liveType}`} />
      </div>
    );
  }

  renderList = () => {
    const lives = this.state.lives;
    return lives.map((live, index) => (
      <Live
        key={index}
        live={live}
        onClick={event => this.onClick(live, event)}
      />
    ));
  };

  render() {
    const { hasMore, active: type } = this.state;

    return (
      <div className="live-list-mine">
        <div className="dx-plain-tabs">
          {this.renderTab(NOT_START)}
          {this.renderTab(ON_LIVE)}
          {this.renderTab(OVER)}
        </div>
        <Refreshload
          ref={(ref) => { this.iScrollWrapper = ref; }}
          absolute
          className="live-list-mine-content"
          needPullUp={hasMore}
          pullDownCallBack={cb => this.switchLiveType(type).then(cb)}
          pullUpCallBack={cb => this.paginate().then(cb)}
          empty={this.state.empty}
        >
          {this.renderList()}

        </Refreshload>
        {this.state.isFetching && <Loading />}
      </div>
    );
  }
}
LiveProductList.contextTypes = {
  router: object,
  intl: object,
};

LiveProductList.propTypes = {
  location: locationShape,
};

export default LiveProductList;
