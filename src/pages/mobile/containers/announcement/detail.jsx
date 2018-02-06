import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RelativeLink } from 'react-router-relative-links';
import { nav } from 'utils/dx';
import { FormattedMessage } from 'react-intl';

import { announcement as announcementActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const dateFormat = date => (
  `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${date.slice(8, 10)}:${date.slice(10, 12)}:${date.slice(12, 14)}`
);

const propTypes = {
  detail: PropTypes.object.isRequired,
  commentsCount: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
  fetchParams: PropTypes.object.isRequired,
};

class Detail extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.handleLike = this.handleLike.bind(this);
  }

  componentDidMount() {
    const { actions, fetchParams } = this.props;
    actions.fetchAnnouncementDetail(fetchParams);
    actions.fetchAnnouncementCommentsCount(fetchParams);
    setNav(this.context.intl.messages['app.announcement.title.detail']);
  }

  handleLike() {
    const { actions, fetchParams } = this.props;
    actions.fetchAnnouncementLike(fetchParams);
  }

  render() {
    const { detail, commentsCount } = this.props;
    return (
      <div className="announcement">
        <div className="announcement-detail">
          <div className="announcement-detail-header">
            <h3 className="announcement-detail-title">{detail.title}</h3>
            <div className="announcement-detail-info">
              <span className="announcement-detail-publisher"><FormattedMessage {...messages.from} />：{detail.publisher_man}</span><span className="announcement-detail-date">{detail.update_time && dateFormat(detail.update_time)}</span>
            </div>
          </div>
          <div className="announcement-detail-content" dangerouslySetInnerHTML={{ __html: detail.content }} />
          {Array.isArray(detail.accessories) && detail.accessories.length ?
            <div className="announcement-detail-accessories">
              <div className="announcement-detail-accessories-header">
                <i className="icon-paperclip" /><span className="accessories-tag"><FormattedMessage {...messages.attachment} /><sapn className="accessories-tag-number">({detail.accessories.length}<FormattedMessage {...messages.unit} values={{ en: <span /> }} />)</sapn></span>
              </div>
              <ul className="announcement-detail-accessories-content">
                {
                  detail.accessories.map((accessory) => {
                    if (accessory.accessory_type === '3' || accessory.accessory_type === '4') {
                      return <li key={accessory.accessory_id}><RelativeLink className="announcement-detail-accessory" to={{ pathname: '../../media', query: { resourceUrl: accessory.accessory_url } }}>{accessory.accessory_name}</RelativeLink></li>;
                    }
                    sessionStorage.setItem('imgViewer', JSON.stringify(accessory.snapshots));
                    return <li key={accessory.accessory_id}><RelativeLink className="announcement-detail-accessory" onClick={() => { const imgViewer = accessory.snapshots.length ? JSON.stringify(accessory.snapshots) : JSON.stringify([accessory.accessory_url]); sessionStorage.setItem('imgViewer', imgViewer); }} to={{ pathname: '../../imgViewer' }}>{accessory.accessory_name}</RelativeLink></li>;
                  })
                }
              </ul>
            </div> :
            null
          }
          {detail.is_allow_comment === 1 ?
            <div className="announcement-detail-footer">
              <RelativeLink to={`/announcement/comment/${detail.id}`} className="announcement-detail-comment"><FormattedMessage {...messages.writeReview} /></RelativeLink>
              <RelativeLink to={`/announcement/comments/${detail.id}`} className="announcement-detail-comments"><span className="announcement-detail-comments-count">{commentsCount > 99 ? '99+' : commentsCount}</span></RelativeLink>
              {detail.has_liked === false ?
                <span className="announcement-detail-like" onClick={this.handleLike}><span className="announcement-detail-like-count">{detail.like_count > 99 ? '99+' : detail.like_count}</span></span> :
                <span className="announcement-detail-like liked" onClick={this.handleLike}><span className="announcement-detail-like-count">{detail.like_count > 99 ? '99+' : detail.like_count}</span></span>
              }
            </div> : null
          }
        </div>
      </div>
    );
  }
}

Detail.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    detail: state.announcement.detail || [],
    commentsCount: state.announcement.commentsCount || 0,
    isFetching: state.announcement.isFetching || false,
    fetchParams: {
      announcementId: ownProps.params.announcement_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(announcementActions, dispatch),
  }
))(Detail);
