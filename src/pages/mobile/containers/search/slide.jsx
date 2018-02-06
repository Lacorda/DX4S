import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const propTypes = {
  display: React.PropTypes.bool.isRequired,
  onFetch: PropTypes.func.isRequired,
};

// 筛选层
class Slide extends React.Component {
  constructor(...args) {
    super(...args);
    this.onClickType = ::this.onClickType;
    this.onClickOk = ::this.onClickOk;
    this.state = {
      type: '',
    };
  }

  onClickType(type) {
    this.setState({ type });
  }

  onClickOk() {
    const { onFetch } = this.props;
    const { type } = this.state;
    onFetch({ type });
  }

  render() {
    const { display } = this.props;
    const { type } = this.state;

    return (
      <div className={display ? 'slide active' : 'slide'}>
        <div className="mask" onClick={this.onClickOk} />
        <div className="content">
          <dl>
            <dt><FormattedMessage {...messages.type} /></dt>
            <dd onClick={() => this.onClickType('')} className={type === '' ? 'active' : ''}><FormattedMessage {...messages.typeAll} /></dd>
            <dd onClick={() => this.onClickType('series')} className={type === 'series' ? 'active' : ''}><FormattedMessage {...messages.typeSeries} /></dd>
            <dd onClick={() => this.onClickType('course')} className={type === 'course' ? 'active' : ''}><FormattedMessage {...messages.typeCourse} /></dd>
            <dd onClick={() => this.onClickType('live')} className={type === 'live' ? 'active' : ''}><FormattedMessage {...messages.typeLive} /></dd>
          </dl>
          <button type="button" onClick={this.onClickOk}><FormattedMessage {...messages.ok} /></button>
        </div>
      </div>
    );
  }
}

Slide.propTypes = propTypes;

export default Slide;
