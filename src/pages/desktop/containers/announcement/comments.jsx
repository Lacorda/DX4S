import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { announcement as announcementActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const commentPropTypes = {
  data: PropTypes.object.isRequired,
};

const Comment = ({ data }) => (
  (
    <li className="announcement-comments-item">
      <div className="announcement-comments-item-header">
        <h3 className="announcement-comments-item-username">{data.user_name}</h3>
        <span className="announcement-comments-item-dept">{data.dept_name}</span>
      </div>
      <p className="announcement-comments-item-content">{data.content}</p>
      <div className="announcement-comments-item-date">{data.date_time_minute}</div>
    </li>
  )
);

Comment.propTypes = commentPropTypes;

const propTypes = {
  comments: PropTypes.array.isRequired,
  commentsCount: PropTypes.number.isRequired,
  page: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  fetchParams: PropTypes.object.isRequired,
};

class Comments extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.commentsParams = {
      pageCount: 20,
      lastItemId: 0,
    };
    this.reset = ::this.reset;
    this.nextPage = ::this.nextPage;
  }

  componentDidMount() {
    this.init = true;
    const { actions, fetchParams } = this.props;
    actions.resetAnnouncementPageComments();
    actions.fetchAnnouncementComments(fetchParams);
    actions.fetchAnnouncementCommentsCount(fetchParams);
  }

  reset() {
    const { actions, fetchParams } = this.props;
    actions.resetAnnouncementPageComments();
    actions.fetchAnnouncementComments(fetchParams);
    actions.fetchAnnouncementCommentsCount(fetchParams);
  }

  nextPage() {
    const { actions, fetchParams, comments } = this.props;
    actions.nextAnnouncementPageComments(comments[comments.length - 1].internal_id);
    actions.fetchAnnouncementComments(fetchParams);
  }

  render() {
    const { comments, commentsCount, page } = this.props;
    return (
      <div>
        {(() => {
          if (commentsCount) {
            return (
              <div className="announcement-comments">
                <div className="announcement-comments-count">{commentsCount}<FormattedMessage {...messages.commentsCount} /></div>
                <ul>
                  {
                    comments.map(comment => (
                      <Comment data={comment} key={comment.internal_id} />
                    ))
                  }
                </ul>
                <div className="announcement-comments-footer">
                  {page.end ?
                    <span className="disable"><i className="announcement-comment-info-icon" /><FormattedMessage {...messages.noMore} /></span> :
                    <span onClick={this.nextPage}><FormattedMessage {...messages.loadMore} /></span>
                  }
                </div>
              </div>
            );
          }
          return <p style={{ textAlign: 'center', paddingTop: 30 }}><FormattedMessage {...messages.noCommentNow} /></p>;
        })()}
      </div>
    );
  }
}

Comments.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    comments: state.announcement.comments || [],
    commentsCount: state.announcement.commentsCount || 0,
    page: state.announcement.pageComments || {},
    isFetching: state.announcement.isFetching || false,
    fetchParams: {
      announcementId: ownProps.params.announcement_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(announcementActions, dispatch),
  }
))(Comments);
