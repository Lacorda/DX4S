import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import moment from 'moment';
import { NOT_START, ABOUT_TO_START, ON_LIVE, OVER } from 'dxConstants/live-type';

import { getLiveStatusI18nEl } from './helper';
import messages from './messages';
import './basic.styl';

function renderLiveTypeTag(type) {
  if (type === 'meeting') return <FormattedMessage {...messages.typeMeeting} />;
  return <FormattedMessage {...messages.typeCourse} />;
}

function renderPriceEl(live) {
  const { price, type, free, vacancyNum, seatNum, status } = live;
  // 企业会议不需要显示价格和剩余座位
  if (type === 'meeting') return null;
  // 付费公开课，只显示价格
  if (price > 0) {
    return (
      <div className="sell">
        <span className="price">￥ {price}</span>
      </div>
    );
  }
  // 免费课程显示免费，并在公开课正在进行时显示剩余座位数
  if (free) {
    let vacancyEl = null;
    if (status === ON_LIVE) {
      vacancyEl = (
        <span className="count">
          <FormattedMessage {...messages.remain} /> {vacancyNum}/{seatNum}
        </span>
      );
    }
    return (
      <div className="sell">
        <span className="price"><FormattedMessage {...messages.free} /></span>
        {vacancyEl}
      </div>
    );
  }

  return null;
}

function BasicLiveContainer(props) {
  const {
    name,
    type,
    cover,
    lecturer,
    beginTime,
    status,
    tags = [],
    description,
  } = props;
  let tagsEl = null;
  if (tags.length > 0) {
    tagsEl = (
      <div className="tags">
        {tags.map(tag => <span key={tag.id || tag.name} className="tag">{tag.name}</span>)}
      </div>
    );
  }

  let beginTimeEl = null;
  if (beginTime) {
    const statusClass = classnames(status, 'status');
    beginTimeEl = (
      <div className="start-time">
        <FormattedMessage
          {...messages.beginTime}
          values={{ beginTime: moment(beginTime).format('YYYY-MM-DD HH:mm') }}
        />
        { status !== NOT_START &&
          <span className={statusClass}>
            {getLiveStatusI18nEl(status)}
          </span>
        }
      </div>
    );
  }


  return (
    <div className="live-basic">
      <img src={cover} alt={name} className="banner" />
      <div className="live-basic-content">
        <div className="title">{name}</div>
        <div className="title-sub">
          {renderLiveTypeTag(type)}
          <FormattedMessage {...messages.lecturer} values={{ lecturer }} />
        </div>
        {renderPriceEl(props)}
        {beginTimeEl}
        {tagsEl}
        <div className="description">{description}</div>
      </div>
    </div>
  );
}

const { string, arrayOf, number, oneOfType, oneOf, bool, shape } = React.PropTypes;

BasicLiveContainer.propTypes = {
  name: string.isRequired,
  type: string,
  cover: string.isRequired,
  lecturer: string.isRequired,
  beginTime: oneOfType([string, number]),
  status: oneOf([NOT_START, ABOUT_TO_START, ON_LIVE, OVER]),
  tags: arrayOf(shape({ id: oneOfType([string, number]), name: string })),
  description: string,
  /* eslint-disable react/no-unused-prop-types*/
  price: oneOfType([string, number]),
  free: bool,
  vacancyNum: number,
  seatNum: number,
  /* eslint-enable */
};

export default BasicLiveContainer;
