import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { nav } from 'utils/dx';
import { FormattedMessage } from 'react-intl';

import { announcement as announcementActions } from '../../actions';
import Toast from '../../../../components/modal/toast';

import './styles.styl';
import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const propTypes = {
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  fetchParams: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

class Comment extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.state = { comment: '', isSubmit: false };
    this.isSubmit = false;
    this.toastContent = '评论失败';
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    setNav(this.context.intl.messages['app.announcement.title.comment']);
  }

  handleSubmit() {
    const { actions, fetchParams, router } = this.props;
    const { comment } = this.state;
    actions.submitAnnouncementComment(comment, fetchParams).then(() => {
      router.replace(`/announcement/detail/${fetchParams.announcementId}`);
    }).catch((err) => {
      actions.submitAnnouncementCommentFailure();
      this.toastContent = err.response.data.message || '评论失败';
      setTimeout(() => {
        this.setState(Object.assign({}, this.state, {
          isSubmit: true,
        }));
      }, 300);
    });
  }

  handleChange(event) {
    this.setState(Object.assign({}, this.state, {
      comment: event.target.value.trim(),
    }));
  }

  render() {
    const { isFetching } = this.props;
    const { comment, isSubmit } = this.state;
    return (
      <div className="announcement">
        {(() => (
          <div className="announcement-comment">
            <textarea
              value={comment}
              onChange={this.handleChange}
              placeholder={this.context.intl.messages['app.announcement.commentPlaceholder']}
            />
            {comment && !isFetching ? <div className="announcement-comment-submit" onClick={this.handleSubmit}><FormattedMessage {...messages.submit} /></div> : <div className="announcement-comment-submit disabled"><FormattedMessage {...messages.submit} /></div>}
          </div>
        ))()}
        <Toast
          style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
          isOpen={isSubmit}
          timeout={2000}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => {
            this.setState(Object.assign({}, this.state, {
              isSubmit: false,
            }));
          }}
        >
          <div>{this.toastContent}</div>
        </Toast>
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
))(withRouter(Comment));
