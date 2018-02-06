import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import CommentList from './comments';

import { announcement as announcementActions } from '../../actions';
import Alert from '../../components/alert';

import './styles.styl';
import messages from './messages';

const propTypes = {
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  fetchParams: PropTypes.object.isRequired,
};

class Comment extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      comment: '',
      isSubmit: false,
      commentListKey: Math.random(),
    };
    this.isSubmit = false;
    this.alertType = this.context.intl.messages['app.announcement.reviewsSuccess'];
    this.toastContent = 'Comment success';
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { actions, fetchParams } = this.props;
    const { comment } = this.state;
    actions.submitAnnouncementComment(comment, fetchParams).then(() => {
      this.toastContent = this.context.intl.messages['app.announcement.reviewsSuccess'];
      this.alertType = 'success';
      this.setState({
        isSubmit: true,
        comment: '',
        commentListKey: Math.random(),
      });
    }).catch((err) => {
      actions.submitAnnouncementCommentFailure();
      this.toastContent = err.response.data.message || this.context.intl.messages['app.announcement.reviewsFailure'];
      this.alertType = 'error';
      this.setState({
        isSubmit: true,
      });
    });
  }

  handleChange(event) {
    this.setState({
      comment: event.target.value.trim(),
    });
  }

  render() {
    const { isFetching } = this.props;
    const { comment, isSubmit, commentListKey } = this.state;
    return (
      <div>
        <div className="announcement-comment">
          <textarea
            value={comment}
            onChange={this.handleChange}
            placeholder={this.context.intl.messages['app.announcement.commentPlaceholder']}
          />
          {comment && !isFetching ? <div className="announcement-comment-submit" onClick={this.handleSubmit}><FormattedMessage {...messages.submit} /></div> : <div className="announcement-comment-submit disabled"><FormattedMessage {...messages.submit} /></div>}
        </div>
        <CommentList {...this.props} key={commentListKey} />
        <Alert
          isShow={isSubmit}
          timeout={2000}
          onRequestClose={() => {
            this.setState({
              isSubmit: false,
            });
          }}
          imgType={this.alertType}
        >
          <span>{this.toastContent}</span>
        </Alert>
      </div>
    );
  }
}

Comment.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    isFetching: state.announcement.isFetching || false,
    fetchParams: {
      announcementId: ownProps.params.announcement_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(announcementActions, dispatch),
  }
))(Comment);
