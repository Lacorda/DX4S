import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import messages from './messages';
import './style.styl';
import Ribbon from '../../../../components/ribbon';

function Card(props) {
  const { imageURL, alt, type, content, externalClass, to, isNew, typeInfo, statusInfo } = props;

  function getLabelMessage() {
    if (isNew) {
      return (
        <FormattedMessage {...messages.new} />
      );
    }
    if (type === 'course') {
      return (
        <FormattedMessage {...messages.course} />
      );
    } else if (type === 'exam') {
      return (
        <FormattedMessage {...messages.exam} />
      );
    } else if (type === 'live') {
      return (
        <FormattedMessage {...messages.live} />
      );
    } else if (type === 'meeting') {
      return (
        <FormattedMessage {...messages.meeting} />
      );
    }
    else {
      return (
        <FormattedMessage {...messages.series} />
      );
    }
  }

  function getBgColor() {
    if (isNew) {
      return '#F48644';
    }
    if (type === 'course') {
      return '#38ACFF';
    } else if (type === 'solution') {
      return '#82C650';
    } else if (type === 'live') {
      return '#6ab48c';
    } else if (type === 'meeting') {
      return '#bcb25c';
    }

    return '#CBAC51';  // 考试     //问卷 #658AE9
  }

  let playTypeStr = null;
  if (typeInfo) {
    playTypeStr = (
      <span className={typeInfo.cls}>
        <FormattedMessage {...messages[typeInfo.msgKey]} />
      </span>
    );
  }

  return (
    <div className={`card ${externalClass}`}>
      <div className="card-face">
        {
          type !== 'course' || isNew ? <Ribbon text={getLabelMessage()} backgroundColor={getBgColor()} /> : null
        }
        <Link to={to}>
          <img src={imageURL} alt={alt} />
          {
            (() => {
              if (statusInfo) {
                return <p className="status-info">{statusInfo}</p>;
              }
              return null;
            })()
          }
        </Link>
      </div>
      <div className="card-content">{playTypeStr}{content} </div>
    </div>
  );
}

Card.propTypes = {
  imageURL: React.PropTypes.string,
  alt: React.PropTypes.string,
  type: React.PropTypes.string,
  content: React.PropTypes.string,
  externalClass: React.PropTypes.string,
  to: React.PropTypes.string,
  isNew: React.PropTypes.bool,
  typeInfo: React.PropTypes.object,   // eslint-disable-line react/forbid-prop-types
  statusInfo: React.PropTypes.string, // 比如直播时间的显示
};

Card.defaultProps = {
  type: 'new', // TODO type class
  isNew: false,
  typeInfo: null, // 'training',
};

export default Card;
