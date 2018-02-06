import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { nav } from 'utils/dx';
import { FormattedMessage } from 'react-intl';

import RefreshLoad from '../../components/refreshload';
import Pulltext from '../../../../components/pulltext';
import { announcement as announcementActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

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
    this.init = true;
    this.pullDownCallBack = ::this.pullDownCallBack;
    this.pullUpCallBack = ::this.pullUpCallBack;
  }

  componentDidMount() {
    this.init = true;
    const { actions, fetchParams } = this.props;
    actions.resetAnnouncementPageComments();
    actions.fetchAnnouncementComments(fetchParams);
    actions.fetchAnnouncementCommentsCount(fetchParams);
    setNav(this.context.intl.messages['app.announcement.title.comments']);
  }

  pullDownCallBack(cb) {
    this.init = false;
    const { actions, fetchParams } = this.props;
    actions.resetAnnouncementPageComments();
    actions.fetchAnnouncementComments(fetchParams).then(() => {
      cb();
    });
  }

  pullUpCallBack(cb) {
    this.init = false;
    const { actions, fetchParams, comments } = this.props;
    actions.nextAnnouncementPageComments(comments[comments.length - 1].internal_id);
    actions.fetchAnnouncementComments(fetchParams).then(() => {
      cb();
    });
  }

  render() {
    const { comments, commentsCount, page } = this.props;
    return (
      <div className="announcement">
        {(() => {
          if (commentsCount) {
            return (
              <div>
                <RefreshLoad
                  needPullUp={!page.end}
                  pullDownCallBack={this.pullDownCallBack}
                  pullUpCallBack={this.pullUpCallBack}
                >
                  <div className="announcement-comments-count">{commentsCount}<FormattedMessage {...messages.commentsCount} /></div>
                  <ul className="announcement-comments">
                    {
                      comments.map(comment => (
                        <Comment data={comment} key={comment.internal_id} />
                      ))
                    }
                  </ul>
                  {page.end && <Pulltext isMore={false} />}
                </RefreshLoad>
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
