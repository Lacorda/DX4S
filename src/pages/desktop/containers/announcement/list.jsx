import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RelativeLink } from 'react-router-relative-links';
import { FormattedMessage } from 'react-intl';

import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import { announcement as announcementActions } from '../../actions';
import './styles.styl';
import messages from './messages';

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
          <span className="announcement-item-date">{data.begin_time}</span>
        </div>
        <div className="announcement-item-content nowrap-multi">{data.content_text}</div>
        <i className="icon-enter" />
        <i className="icon-type" />
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
  constructor(props, context) {
    super(props, context);
    this.nextPage = ::this.nextPage;
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.resetAnnouncementPageList();
    actions.fetchAnnouncementList();
  }

  nextPage() {
    const { actions } = this.props;
    actions.nextAnnouncementPageList();
    actions.fetchAnnouncementList();
  }

  render() {
    const { announcements, page } = this.props;
    return (
      <div>
        <DxHeader />
        <div className="announcement">
          <div className="announcement-header">
            <div className="announcement-header-container">
              <div className="announcement-title"><i className="icon-task" /><FormattedMessage {...messages.listTitle} /></div>
            </div>
          </div>
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
          <div className="announcement-footer">
            {page.end ?
              <div className="announcement-next disable" onClick={this.nextPage}><FormattedMessage {...messages.noMore} /></div> :
              <div className="announcement-next" onClick={this.nextPage}><FormattedMessage {...messages.loadMore} /></div>
            }
          </div>
        </div>
        <DxFooter />
      </div>
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
