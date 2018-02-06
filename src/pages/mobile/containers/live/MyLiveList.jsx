import React, { Component } from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { locationShape } from 'react-router';
import moment from 'moment';
import { setTitle } from 'utils/dx/nav';
import { TYPE_OPEN_EN, TYPE_OPEN_MEETING, TYPE_OPEN_PER } from 'dxConstants/live-type';
import * as apis from '../../apis.js';
import Refreshload from '../../components/refreshload/refreshload';
import Loading from '../../components/loading';
import './MyLiveList.styl';

function checkHasMore(lives) {
  return lives.length >= 10;
}

const { object, func } = React.PropTypes;

function getTimeStampFormat(timeStamp) {
  if (!timeStamp) {
    return '';
  }
  const newDate = new Date();
  newDate.setTime(timeStamp);
  return moment(newDate).format('YYYY-MM-DD HH:mm');
}

function Live({
  live: {
    name,
    img: cover,
    begin_time: beginTime,
    status,
    lecture,
  },
  onClick,
}) {
  return (
    <div className="live-item" onClick={onClick}>
      <div className="cover">
        <div className="cover-image">
          <img src={cover} alt={name} />
          <span className="cover-footer">{getTimeStampFormat(beginTime)}</span>
        </div>
      </div>
      <div className="live-info">
        <div className="title">{name}</div>
        <div className="other">
          <span className="lecture">{lecture}</span>
          <span className={`live-status live-status-${status}`}>
            <FormattedMessage id={`app.live.basic.status.${status}`} />
          </span>
        </div>
      </div>
    </div>
  );
}

Live.propTypes = {
  live: object, // eslint-disable-line react/forbid-prop-types
  onClick: func,
};

class MyLiveList extends Component {
  constructor() {
    super();
    this.state = {
      active: TYPE_OPEN_EN,
      lives: [],
      index: 1,
      hasMore: false,
      isFetching: false,
      empty: false,
    };
  }

  async componentDidMount() {
    setTitle({ title: this.context.intl.messages['app.live.title.myLive'] });
    const type = this.props.location.query.type || TYPE_OPEN_EN;
    await this.switchLiveType(type);
    this.refreshIScrollWrapper();
  }

  refreshIScrollWrapper = () => { if (this.iScrollWrapper) this.iScrollWrapper.refresh(); };

  asyncSetState = state => new Promise(resolve => this.setState(state, resolve));

  async switchLiveType(type) {
    const lives = await apis.getMyLiveListByType(type, { index: 1 });
    this.context.router.replace({ pathname: '/lives', query: { type } });
    await this.asyncSetState({
      active: type,
      lives,
      hasMore: checkHasMore(lives),
      empty: !lives.length,
    });
  }

  async paginate() {
    const { active, index, lives } = this.state;
    const fetchedLives = await apis.getMyLiveListByType(active, { index: index + 1 });
    await this.asyncSetState({
      hasMore: checkHasMore(fetchedLives),
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
        <FormattedMessage id={`app.live.common.type.${liveType}`} />
      </div>
    );
  }

  renderList = () => {
    const lives = this.state.lives;
    return lives.map((live, index) =>
      <Live
        key={index}
        live={live}
        onClick={() => this.context.router.push(`/live/${live.id}`)}
      />);
  };

  render() {
    const { hasMore, active: type } = this.state;

    return (
      <div className="live-list-mine">
        <div className="dx-plain-tabs">
          {this.renderTab(TYPE_OPEN_EN)}
          {this.renderTab(TYPE_OPEN_PER)}
          {this.renderTab(TYPE_OPEN_MEETING)}
        </div>
        <Refreshload
          ref={(ref) => { if (ref) { this.iScrollWrapper = ref; } }}
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
MyLiveList.contextTypes = {
  router: object,
  intl: object,
};

MyLiveList.propTypes = {
  location: locationShape,
};

export default MyLiveList;
