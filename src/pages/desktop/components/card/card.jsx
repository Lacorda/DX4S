import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Ribbon from '../../../../components/ribbon';
import deleteIcon from './img/delete-icon.png';
import messages from './messages';

class Card extends Component {
  constructor(props) {
    super(props);
  }

  formatDate(now) {
    const nowDate = new Date(now);
    const year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let date = nowDate.getDate();
    date = date < 10 ? `0${date}` : date;
    let hour = nowDate.getHours();
    hour = hour < 10 ? `0${hour}` : hour;
    let minute = nowDate.getMinutes();
    minute = minute < 10 ? `0${minute}` : minute;
    return `${year}-${month}-${date} ${hour}:${minute}`;
  }

  render() {
    const { type, img, name, style, to, isNew, done, isDelete, clickDelete, isFaid, task, beginTime, liveStatus } = this.props;
    const reDefineType = isNew ? 'new' : type;
    const getType = {
      new: <FormattedMessage {...messages.new} />,
      series: <FormattedMessage {...messages.series} />,
      solution: <FormattedMessage {...messages.series} />,
      exam: <FormattedMessage {...messages.exam} />,
    };
    const getTask = {
      training: <FormattedMessage {...messages.required} />,
      elective: <FormattedMessage {...messages.minors} />,
      personal: <FormattedMessage {...messages.ownPurchase} />,
    };
    const getBgColor = {
      new: '#f48644',
      series: '#82c650',
      solution: '#82c650',
      exam: '#cbac51',
    };
    const color = {
      training: '#009aec',
      elective: '#ffc03c',
      personal: '#fa3c3c',
    };
    const getStatus = {
      'about_to_start': '即将开始',
      'not_start': '未开始',
      'on_live': '正在进行',
      'over': '已结束',
    };
    return (
      <div className="dx-card" style={style}>
        <Link to={to} className="dx-card-content">
          <div className="dx-card-img">
            {(type !== 'course' && type !== 'live') || isNew ? (
              <Ribbon
                text={getType[reDefineType]}
                backgroundColor={getBgColor[reDefineType]}
                height="48px"
                ribbonHeight="24px"
              />
            ) : null}
            <img src={img} alt="" />
            {
              done ? (
                <div className="dx-card-done"><FormattedMessage {...messages.done} /></div>
              ) : null
            }
            {
              isFaid ? (
                <div className="dx-card-isFaid"><FormattedMessage {...messages.isFaid} /></div>
              ) : null
            }
            {
              isDelete ? (
                <div className="dx-card-delete" onClick={clickDelete}><img src={deleteIcon} /></div>
              ) : null
            }
          </div>
          {
            task ? (
              <div className="dx-card-name"><span style={{ color: color[task] }}>[{getTask[task]}]</span> {name}</div>
            ) : <div className="dx-card-name">{name}</div>
          }
          {
            type === 'live' ? (
              <div className="dx-card-live">
                <div className="dx-card-live-time">{this.formatDate(beginTime)}</div>
                {
                  liveStatus !== 'not_start' ? (
                    <div className={`dx-card-live-status ${liveStatus}`}>{getStatus[liveStatus]}</div>
                  ) : null
                }
              </div>
            ) : null
          }
        </Link>
      </div>
    );
  }
}

Card.propTypes = {
  type: PropTypes.string,
  img: PropTypes.string,
  name: PropTypes.string,
  task: PropTypes.string,
  style: PropTypes.object,  // eslint-disable-line
  to: PropTypes.string,
  isNew: PropTypes.bool,
  done: PropTypes.bool,
  isFaid: PropTypes.bool,
  isDelete: PropTypes.bool,
  clickDelete: React.PropTypes.func,
  beginTime: PropTypes.number,
  liveStatus: PropTypes.string,
};

export default Card;
