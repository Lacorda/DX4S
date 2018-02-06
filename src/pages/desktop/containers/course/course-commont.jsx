/**
 * 课程详情-评论
*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Rate from 'components/rate';
import { comment as commentActions } from '../../actions';
import Alert from '../../components/alert';

class CourseCommont extends Component {
  static propTypes() {
    return {
      actions: PropTypes.object.isRequired,
      fetchParams: PropTypes.object.isRequired,
      assessment: PropTypes.object.isRequired,
      dimensions: PropTypes.array.isRequired,  // 评价模板
      list: PropTypes.array.isRequired,
      addMsg: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired,
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      content: '',
      isInitScore: true,
      isSaveAlertOpen: false,
      saveErrMsg: '',
      fetchIndex: 0,
      noMore: false,
    };
    this.onSubmit = ::this.onSubmit;
    this.onChangeContext = ::this.onChangeContext;
    this.fetchCommentData = ::this.fetchCommentData;
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;

    // 获取评价模板
    actions.fetchComment({
      biz_id: fetchParams.courseId,
      type_code: 'course',
    });

    actions.fetchCommentListInit();
    this.fetchCommentData();
  }

  componentWillReceiveProps(nextProps) {
    const { dimensions, addMsg } = nextProps;

    if (dimensions && this.state.isInitScore) {
      dimensions.forEach((item, index) => {
        this.setState({ ...this.state, isInitScore: false, [`score${index}`]: item.dimension_score });
      });
    }

    if (addMsg.errMsg && this.state.saveErrMsg === '') {
      this.setState({ ...this.state, saveErrMsg: addMsg.errMsg, isSaveAlertOpen: true });
    }

    if (addMsg.saveSuccess) {
      this.setState({ ...this.state, saveErrMsg: this.context.intl.messages['app.comment.savesuccess'], isSaveAlertOpen: true });
    }
  }

  onSubmit() {
    const { assessment, dimensions, actions, fetchParams } = this.props;
    if (assessment.pass_state !== 2) {
      return;
    }

    const myRates = [];
    let score = 0;

    if (dimensions) {
      dimensions.forEach((item, index) => {
        const rateInfo = {};
        rateInfo.user_score = this.state[`score${index}`];
        rateInfo.dimension_id = item.dimension_id;
        myRates.push(rateInfo);

        score += rateInfo.user_score;
      });
    }
    this.setState({ ...this.state, saveErrMsg: '' });
    const data = {
      dimensions: myRates,
      biz_id: fetchParams.courseId,
      type_code: 'course',
      content: this.state.content,
    };

    const formatDate = function formatDateStr(date, format) {
      let content = (format && typeof (format) === 'string') ? format : 'yyyy-mm-dd';

      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month < 10) {
        month = `0${month}`;
      }
      if (data < 10) {
        day = `0${day}`;
      }
      content = content.replace(/yyyy/g, date.getFullYear());
      content = content.replace(/mm/g, month);
      content = content.replace(/dd/g, day);

      let hour = date.getHours();
      hour = hour < 10 ? (`0${hour}`) : hour;
      content = content.replace(/HH/g, hour);
      let minute = date.getMinutes();
      minute = minute < 10 ? (`0${minute}`) : minute;
      content = content.replace(/MM/g, minute);
      let second = date.getSeconds();
      second = second < 10 ? (`0${second}`) : second;
      content = content.replace(/SS/g, second);
      return content;
    };

    actions.addComment(data).then(() => {
      const { addMsg, user } = this.props;
      if (addMsg.saveSuccess) {
        // 服务端没法马上返回评价内容
        actions.addMyCommentTemp({
          biz_id: null,
          evaluation_time: formatDate(new Date(), 'yyyy-mm-dd HH:MM:SS'),
          user_name: this.context.intl.messages['app.comment.myComment'],
          user_head_url: user.avatar,
          user_dept_name: user.department,
          user_score: score / dimensions.length,
          content: this.state.content,
          is_my_evaluation: true,
        });
      }
    });
  }

  onChangeContext(event) {
    this.state.content = event.target.value;
  }

  fetchCommentData() {
    const fetchIndex = this.state.fetchIndex + 1;
    const { fetchParams, actions } = this.props;

    function fetchList() {
      const req = {
        index: fetchIndex,
        size: 10,
        type_code: 'course',
        biz_id: fetchParams.courseId,
      };
      actions.fetchCommentList(req).then(() => {
        const { list } = this.props;
        this.setState({ ...this.state, noMore: (fetchIndex * 10 !== list.length) });
      });
    }

    this.setState({ fetchIndex }, fetchList);
  }

  render() {
    const self = this;
    const { dimensions, assessment, list } = this.props;
    return (
      <div className="commont">
        <div className="commont-edit">
          <ul className="commont-rate">
            <li>
              {
                dimensions.map((item, index) => (
                  <div className="commont-rate-title" key={index}>{item.dimension_name}</div>
                ))
              }
            </li>
            <li>
              {
                dimensions.map((item, index) => (
                  <Rate
                    key={index}
                    score={self.state[`score${index}`]}
                    click={
                      function setScore(score) {
                        if (assessment.pass_state !== 2) {
                          return;
                        }
                        self.setState({ ...self.state, [`score${index}`]: score });
                      }
                    }
                  />
                ))
              }
            </li>
          </ul>
          <div className="commont-textarea">
            <textarea
              placeholder={this.context.intl.messages[`${assessment.pass_state === 2 ? 'app.comment.placeholder' : 'app.comment.addDisable'}`]}
              disabled={assessment.pass_state !== 2}
              onChange={this.onChangeContext}
            />
            <a className={`${assessment.pass_state === 2 ? '' : 'disabled'}`} onClick={this.onSubmit}>
              {this.context.intl.messages['app.comment.submit']}
            </a>
          </div>
        </div>
        <div className="commont-list">
          {
            (() => {
              if (!list.length) {
                return (
                  <div className="commont-empty">{this.context.intl.messages['app.comment.empty']}</div>
                );
              }

              return (
                list.map((item, index) => (
                  <div className="commont-item" key={index}>
                    <div className="avatar">
                      <img alt="" src={item.user_head_url} />
                    </div>
                    <div className="content">
                      <div className="content-title">
                        <div className="name-rate">
                          <span>{item.user_name}</span>
                          <Rate score={item.user_score} />
                        </div>
                        <div className="time">
                          <span>{item.evaluation_time}</span>
                        </div>
                      </div>
                      <div className="content-detail">
                        <p className="dept">{this.context.intl.messages['app.comment.dept']}: {item.user_dept_name}</p>
                        <p className="txt">{item.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              );
            })()

          }
        </div>
        {
          !this.state.noMore ?
            <div className="more">
              <div className="btn-more" onClick={this.fetchCommentData}>{this.context.intl.messages['app.comment.loadMore']}</div>
            </div> : null
        }
        <Alert
          isShow={this.state.isSaveAlertOpen}
          imgType={'prompt'}
          onRequestClose={() => {
            self.setState({ ...this.state, isSaveAlertOpen: false });
          }}
          confirmButton={this.context.intl.messages['app.course.ok']}
        >
          <span>{this.state.saveErrMsg}</span>
        </Alert>
      </div>
    );
  }
}

CourseCommont.contextTypes = {
  router: React.PropTypes.object,
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  fetchParams: ownProps.fetchParams,
  assessment: state.course.assessment.info,
  dimensions: state.comment.detail.info.dimensions || [],
  addMsg: state.comment.detail.addMsg || {},
  list: state.comment.list.items || [],
  user: state.account.user || {},
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({},
    commentActions),
    dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseCommont);
