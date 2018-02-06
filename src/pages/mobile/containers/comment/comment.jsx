import React, { Component, PropTypes } from 'react';
// import { RelativeLink } from 'react-router-relative-links';
import RelativeLink from 'components/links';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { comment as listActions } from '../../actions';
import Rate from '../../../../components/rate';
import Pulltext from '../../../../components/pulltext';

const propTypes = {
  actions: PropTypes.object.isRequired,
  courseInfo: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  list: PropTypes.array.isRequired,
  rateScore: PropTypes.number.isRequired,
  isCommentList: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

class Comment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetchIndex: 0,
    };
    this.fetchCommentDate = ::this.fetchCommentDate;
    this.bodyScroll = ::this.bodyScroll;
  }

  componentDidMount() {
    this.props.actions.fetchCommentListInit();
    this.fetchCommentDate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCommentList) {
      window.addEventListener('scroll', this.bodyScroll);
    } else {
      window.removeEventListener('scroll', this.bodyScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.bodyScroll);
  }

  // 获取数据
  fetchCommentDate() {
    const self = this;
    const fetchIndex = self.state.fetchIndex + 1;

    function fetchList() {
      const data = {
        index: self.state.fetchIndex,
        size: 10,
        type_code: 'course',
        biz_id: this.props.params.course_id,
      };

      self.props.actions.fetchCommentList(data);
    }

    self.setState({ fetchIndex }, fetchList);
  }

  // 页面蹲到底部加载
  bodyScroll() {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const windowHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (((scrollTop + clientHeight) > (windowHeight - 20))
        && this.props.isCommentList
        && !this.props.isFetching
        ) {
      this.fetchCommentDate();
    }
  }

  render() {
    const { list, rateScore, isCommentList, courseInfo } = this.props;
    // const isFinish = courseInfo && courseInfo.pass_state === 2 ? 'block' : 'none';
    const linkTo = `/plan/${this.props.params.plan_id}/series/${this.props.params.solution_id}/courses/${this.props.params.course_id}/add-comment`;

    return (
      <div className="comment">
        <div className="c-top">
          <div className="c-rate">
            <p><FormattedMessage id="app.comment.overall-evaluation" /></p>
            <Rate score={rateScore} />
          </div>
          {(() => {
            if (courseInfo && courseInfo.pass_state === 2) {
              return <RelativeLink to={linkTo} className="c-add enable"><FormattedMessage id="app.comment.add" /></RelativeLink>;
            }
            return <p className="c-add disable"><FormattedMessage id="app.comment.addDisable" /></p>;
          })() }
        </div>
        <div className="c-list">
          {
            list.map((item, index) => (
              <div className="c-item" key={index} >
                <div className="avatar">
                  <img alt="" src={item.user_head_url} />
                </div>
                <div className="name-rate">
                  <p>{item.user_name}</p>
                  <Rate score={item.user_score} />
                </div>
                <p className="time">{item.evaluation_time}</p>
                <p className="content">{item.content}</p>
              </div>
            ))
          }
          {(() => {
            if (list.length > 0) {
              return <Pulltext isMore={isCommentList} />;
            }
            return <p className="pulltext"><FormattedMessage id="app.comment.noReviews" /></p>;
          })() }
        </div>
      </div>
    );
  }
}

Comment.propTypes = propTypes;

const mapStateToProps = state => (
  {
    rateScore: state.course.detail.info.star_level || 0,
    list: state.comment.list.items || [],
    isFetching: state.comment.list.isFetching || false,
    isCommentList: state.comment.list.isCommentList,
    courseInfo: state.course.assessment.info,
  }
);

const mapDispatchToProps = dispatch => (
  {
    actions: bindActionCreators(listActions, dispatch),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
