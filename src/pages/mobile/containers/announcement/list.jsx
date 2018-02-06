import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RelativeLink } from 'react-router-relative-links';
import { nav } from 'utils/dx';

import { announcement as announcementActions } from '../../actions';
import RefreshLoad from '../../components/refreshload';
import Pulltext from '../../../../components/pulltext';
import './styles.styl';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const announcementPropTypes = {
  data: PropTypes.object.isRequired,
};

const Announcement = ({ data }) => (
  (
    <li className="announcement-item">
      <RelativeLink to={{ pathname: `./detail/${data.item_id}` }}>
        <div className="announcement-item-header">
          <h3 className="announcement-item-title nowrap-flex">{data.title}</h3>
          {data.read_status === 0 ? <i className="announcement-icon icon-new" /> : null}
          <span className="announcement-item-date">{data.begin_time.split(' ')[0]}</span>
        </div>
        <div className="announcement-item-content nowrap-multi">{data.content_text}</div>
        <i className="icon-enter" />
      </RelativeLink>
    </li>
  )
);

Announcement.propTypes = announcementPropTypes;

const propTypes = {
  announcements: PropTypes.array.isRequired,
  page: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

class List extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.init = true;
    this.pullDownCallBack = ::this.pullDownCallBack;
    this.pullUpCallBack = ::this.pullUpCallBack;
    this.state = { key: 0 };
  }

  componentDidMount() {
    this.init = true;
    const { actions } = this.props;
    const self = this;
    actions.resetAnnouncementPageList();
    actions.fetchAnnouncementList().then(() => {
      const rndNum = Math.random();
      self.setState({ key: rndNum });
    });
    setNav(this.context.intl.messages['app.announcement.title.list']);
  }

  pullDownCallBack(cb) {
    this.init = false;
    const { actions } = this.props;
    actions.resetAnnouncementPageList();
    actions.fetchAnnouncementList().then(() => {
      cb();
    });
  }

  pullUpCallBack(cb) {
    this.init = false;
    const { actions } = this.props;
    actions.nextAnnouncementPageList();
    actions.fetchAnnouncementList().then(() => {
      cb();
    });
  }

  render() {
    const { announcements, page } = this.props;
    return (
      <RefreshLoad
        needPullUp={!page.end}
        pullDownCallBack={this.pullDownCallBack}
        pullUpCallBack={this.pullUpCallBack}
        key={this.state.key}
      >
        <div className="announcement">
          {(() => {
            if (announcements.length) {
              return (
                <ul className="announcement-list">
                  {
                    announcements.map((announcement, index) => (
                      <Announcement data={announcement} key={index} />
                    ))
                  }
                </ul>
              );
            }
            return null;
          })()}
          {page.end && <Pulltext isMore={false} />}
        </div>
      </RefreshLoad>
    );
  }
}

List.propTypes = propTypes;

export default connect(state => (
  {
    announcements: state.announcement.list || [],
    page: state.announcement.pageList || {},
  }
), dispatch => (
  {
    actions: bindActionCreators(announcementActions, dispatch),
  }
))(List);
