import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Rate from 'components/rate';
import api from 'utils/api';
import Confirm from '../../components/confirm';
import { course as courseActions } from '../../actions';
import './course.styl';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import CourseDetail from './course-detail';
import CourseCommont from './course-commont';

class Course extends Component {
  static propTypes() {
    return {
      actions: PropTypes.object.isRequired,
      fetchParams: PropTypes.object.isRequired,
      courseInfo: PropTypes.object.isRequired,
      assessment: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      nodes: PropTypes.object.isRequired,
    };
  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      activeTab: 'detail',
      isConfirmOpen: false,
      isAlertOpen: false,
      isShare: false,
    };
    this.onFavorite = ::this.onFavorite;
    this.onArrange = ::this.onArrange;
    this.onPlan = ::this.onPlan;
    this.onExam = ::this.onExam;
    this.onTrain = ::this.onTrain;
    this.onStudy = ::this.onStudy;
    this.onConfrimCancel = ::this.onConfrimCancel;
    this.onAlertConfirm = ::this.onAlertConfirm;
    this.alertMsg = '';
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    const request = {
      plan_id: fetchParams.planId,
      solution_id: fetchParams.solutionId || 0,
      course_id: fetchParams.courseId,
    };

    actions.fetchCourse(request)
    .then(() => {
      actions.fetchAssement(request).then(() => {
        const { courseInfo } = this.props;
        if (courseInfo.need_update_complete_status && courseInfo.pass_state !== 2) {
          this.alertMsg = this.context.intl.messages['app.series.share'];
          this.setState({ ...this.state, isAlertOpen: true, isShare: true });
        }
      });
    })
    .catch((err) => {
      const error = JSON.parse(err.message);
      this.alertMsg = error.message;
      this.setState({ ...this.state, isAlertOpen: true, isShare: false });
    });
  }

  componentWillUnmount() {
    this.props.actions.initCourse();
  }

  onFavorite(isFavor) {
    const { fetchParams, actions } = this.props;
    actions.favorCourse({
      plan_id: fetchParams.planId,
      solution_id: fetchParams.solutionId,
      course_id: fetchParams.courseId,
      is_favor: isFavor,
    });
  }

  onPlan(planId) {
    const router = this.context.router;
    router.push(router.createPath(`/plan/detail/${planId}`));
  }

  onArrange() {
    const { courseInfo, fetchParams, actions } = this.props;
    const data = {
      plan_id: fetchParams.planId,
      course_id: fetchParams.courseId,
      is_arranged: !courseInfo.is_arranged,
    };

    actions.arrangeCourse(data).then(() => {
      if (!data.is_arranged) {
        const query = {
          plan_id: fetchParams.planId,
          course_id: fetchParams.courseId,
          solution_id: fetchParams.solutionId || 0,
        };
        actions.fetchAssement(query);
        actions.fetchChapter(query);
      }
    });
    this.setState({ ...this.state, isConfirmOpen: false });
  }

  onConfrimCancel() {
    this.setState({ ...this.state, isConfirmOpen: false });
  }

  onAlertConfirm() {
    // 课程计划被撤销 或服务端返回错误
    if (!this.state.isShare) {
      this.setState({ ...this.state, isAlertOpen: false });
      window.history.back();
      return;
    }

    // 共享学习
    const { courseInfo, fetchParams, actions } = this.props;
    const shareCourse = api({
      method: 'PUT',
      data: {
        completed_in_plan: courseInfo.completed_in_plan,
      },
      url: `/training/plan/${fetchParams.planId}/solution/${fetchParams.solutionId || 0}/course/${fetchParams.courseId}/complete`,
    });
    shareCourse.then(() => {
      const query = {
        plan_id: fetchParams.planId,
        course_id: fetchParams.courseId,
        solution_id: fetchParams.solutionId || 0,
      };
      actions.fetchCourse(query);
      actions.fetchAssement(query);
      actions.fetchChapter(query);
      this.setState({ ...this.state, isAlertOpen: false });
    });
  }

  onExam() {
    const { courseInfo, assessment, fetchParams, location } = this.props;
    if (assessment.read_state < 5) {
      return;
    }

    // 如果是共享学习，则planId带被共享的planId
    const sharePlan = courseInfo.completed_in_plan;
    let query = {
      sharePlanId: sharePlan != null ? sharePlan.id : fetchParams.planId,
    };
    // 系列课带过来的 query.sharePlanId
    if (courseInfo.completed_in_plan === null && location && location.query) {
      if (location.query.sharePlanId) {
        query = {
          sharePlanId: location.query.sharePlanId,
        };
      }
    }

    const router = this.context.router;
    router.push(router.createPath(`/plan/${fetchParams.planId}/series/${fetchParams.solutionId || 0}/exams/${assessment.quiz.id}`, query));
  }

  onTrain() {
    const { assessment, fetchParams } = this.props;
    if (assessment.pass_type === undefined) {
      return;
    }
    if (assessment.pass_type === 0) {
      return;
    }
    // 情景训练
    if (assessment.pass_type === 3) {
      return;
    }

    // 未开始或在读
    if (assessment.read_state < 2) {
      return;
    }

    const router = this.context.router;

    // 复习训练
    if (assessment.pass_type === 1) {
      const nextReadNode = this.getNextReadNode();
      if (nextReadNode === null) {
        return;
      }

      const path = `/preview/plan/${fetchParams.planId}/series/${fetchParams.solutionId || 0}/courses/${fetchParams.courseId}`;
      router.push(router.createPath(path, {
        node_id: nextReadNode.id,
      }));
      return;
    }

    // 练习
    if (assessment.pass_type === 2) {
      const practice = `/plan/${fetchParams.planId}/series/${fetchParams.solutionId || 0}/courses/${fetchParams.courseId}/training`;
      router.push(router.createPath(practice));
    }
  }

  onStudy() {
    const nextReadNode = this.getNextReadNode();
    if (nextReadNode === null) {
      return;
    }

    const { fetchParams } = this.props;
    const router = this.context.router;
    const path = `/preview/plan/${fetchParams.planId}/series/${fetchParams.solutionId || 0}/courses/${fetchParams.courseId}`;
    router.push(router.createPath(path, {
      node_id: nextReadNode.id,
      continue: true,
    }));
  }

  // 获取下一个要学习的节点
  getNextReadNode() {
    const { nodes, assessment } = this.props;
    // let i = 0;
    let nextNode = null;
    let firstNode = null;
    Object.keys(nodes).every((key, index) => {
      if (index === 0) {
        firstNode = nodes[key];
      }
      if (assessment.pass_state === 2) {
        nextNode = nodes[key];
        return false;
      }

      if (nodes[key].done === 0) {
        nextNode = nodes[key];
        return false;
      }
      return true;
    });

    if (nextNode === null) {
      nextNode = firstNode;
    }
    return nextNode;
  }

  getTrainingTitle() {
    const { assessment } = this.props;

    if (assessment.pass_type === undefined ||
      assessment.pass_type === null ||
      assessment.pass_type === 0) {
      return '';
    }
    if (assessment.learning_type === undefined ||
      assessment.learning_type === null) {
      return '';
    }

    let msgVal = { num: assessment.total_learn_num };
    if (assessment.learning_type !== 1) {
      msgVal = {
        num: assessment.finish_learn_num || '0',
        total: assessment.total_learn_num || '0',
      };
    }

    return this.context.intl.formatMessage({ id: `app.course.trainLearn${assessment.pass_type}${assessment.learning_type}` }, msgVal);
  }

  renderTrainStep() {
    /*
      pass_type 1：学，2：练，3：用
      read_state 课程阅读状态，
      0：未开始，1：在读，2：未开始挑战，3：正在挑战，4:挑战失败，
      5：未考试，6：在考试，7：已完成，8：失败，9：失效 ,
    */
    const { assessment } = this.props;
    if (assessment.pass_type === 0) {
      return null;
    }
    const title = this.getTrainingTitle();

    let cls = 'unlock';
    if (assessment.read_state < 2) {
      cls = 'lock';
    }
    if (assessment.read_state > 4) {
      cls = 'pass';
    }
    if (assessment.read_state === 4) {
      cls = 'fail';
    }

    return (
      <div className="step">
        <a className={`${assessment.read_state > 1 ? 'arrow-active' : 'arrow'}`}>&nbsp;</a>
        <a
          className={`${assessment.read_state > 1 ? 'blue' : 'gray'} ${cls}`}
          onClick={this.onTrain}
          title={title}
        >
          {this.context.intl.messages[`app.course.train${assessment.pass_type}`]}
        </a>
      </div>
    );
  }

  renderExamStep() {
    const { assessment } = this.props;
    if (assessment.quiz == null) {
      return null;
    }

    let cls = 'unlock';
    if (assessment.read_state < 5) {
      cls = 'lock';
    }
    if (assessment.read_state === 7) {
      cls = 'pass';
    }

    if (assessment.read_state === 8) {
      cls = 'fail';
    }

    return (
      <div className="step">
        <span className={`${assessment.read_state < 5 ? 'arrow' : 'arrow-active'}`}>&nbsp;</span>
        <a
          className={`${assessment.read_state < 5 ? 'gray' : 'blue'} ${cls}`}
          onClick={this.onExam}
          title={assessment.quiz.name}
        >
          {this.context.intl.messages['app.course.exam']}
        </a>
      </div>
    );
  }

  render() {
    const { courseInfo, assessment, fetchParams } = this.props;
    let startBtnMsgKey = 'app.course.start';
    if (assessment.pass_state === 1) {
      startBtnMsgKey = 'app.course.continue';
    }
    if (assessment.pass_state === 2) {
      startBtnMsgKey = 'app.course.again';
    }
    const confirmMsgId = courseInfo.is_arranged ? 'app.course.withdrawMsg' : 'app.course.enrollMsg';

    return (
      <div>
        <DxHeader />
        <div className="dx-container course">
          <div className="banner">
            <div className="banner-face">
              <img width="100%" height="100%" src={courseInfo.thumbnail_url} alt={courseInfo.course_name} />
            </div>
            <div className="banner-info">
              <div className="banner-info-head">
                <div className="banner-info-title">
                  { courseInfo.course_name }
                </div>
                <div className="banner-info-tool">
                  <a
                    className={`favorite ${courseInfo.is_favor ? 'active' : ''}`}
                    title={this.context.intl.messages[`app.course.${courseInfo.is_favor ? 'cancelFavorite' : 'addFavorite'}`]}
                    onClick={() => { this.onFavorite(!courseInfo.is_favor); }}
                  ></a>
                  {
                    (() => {
                      if (courseInfo.is_elective || fetchParams.planId == -1) {
                        return null;
                      }
                      return (
                        <a
                          className="task"
                          title={this.context.intl.messages['app.course.task']}
                          onClick={() => { this.onPlan(fetchParams.planId); }}
                        ></a>
                      );
                    })()
                  }
                  {
                    (() => {
                      if (!courseInfo.is_elective) {
                        return null;
                      }
                      if (assessment.pass_state === 2) {
                        return null;
                      }
                      return (
                        <a
                          className={`range ${courseInfo.is_arranged ? 'active' : ''}`}
                          title={this.context.intl.messages[`app.course.${courseInfo.is_arranged ? 'cancelArrange' : 'addArrange'}`]}
                          onClick={() => { this.setState({ ...this.state, isConfirmOpen: true }); }}
                        ></a>);
                    })()
                  }
                </div>
              </div>
              <div className="banner-info-tag">
                {
                  courseInfo.labels.map((label, index) => (
                    <span key={index}>{label.name}</span>
                  ))
                }
              </div>
              <div className="banner-info-rate">
                <Rate score={courseInfo.star_level} />
                {
                  (() => {
                    if (!courseInfo.lecturer_name) {
                      return null;
                    }
                    return <span className="banner-info-lecture">{this.context.intl.messages['app.course.lecture']}：{courseInfo.lecturer_name}</span>;
                  })()
                }
              </div>
              <div className="banner-info-operate">
                {/* 开始学习按钮 */}
                <a
                  className={`blue ${assessment.pass_state === 0 ? 'start' : 'pass'}`}
                  onClick={this.onStudy}
                >
                  {this.context.intl.messages[startBtnMsgKey]}
                </a>
                { this.renderTrainStep() }
                { this.renderExamStep() }
              </div>
              {
                /*
                  read_state 课程阅读状态，
                  0：未开始，1：在读，2：未开始挑战，3：正在挑战，4:挑战失败，
                  5：未考试，6：在考试，7：已完成，8：失败，9：失效 ,
                */
                (() => {
                  if (assessment.read_state === undefined) {
                    return null;
                  }
                  if (assessment.read_state < 7) {
                    return null;
                  }
                  return (
                    <div className={`banner-info-signet ${assessment.read_state === 7 ? 'pass' : 'fail'}`}>
                    </div>
                  );
                })()
              }
            </div>
          </div>
          <div className="tab">
            <ul>
              <li className="tab-first">
                <a className={`${this.state.activeTab === 'detail' ? 'active' : ''}`} onClick={() => { this.setState({ activeTab: 'detail' }); }}>
                  {this.context.intl.messages['app.course.title']}
                </a>
              </li>
              <li className="tab-second">
                <a className={`${this.state.activeTab === 'comment' ? 'active' : ''}`} onClick={() => { this.setState({ activeTab: 'comment' }); }}>
                  {this.context.intl.messages['app.course.reviews']}
                </a>
              </li>
            </ul>
          </div>
          {
            (() => {
              if (this.state.activeTab === 'detail') {
                return <CourseDetail fetchParams={fetchParams} />;
              }
              return <CourseCommont fetchParams={fetchParams} />;
            })()
          }
        </div>
        <DxFooter />
        <Confirm
          isOpen={this.state.isConfirmOpen}
          cancel={this.onConfrimCancel}
          confirm={this.onArrange}
          confirmButton={this.context.intl.messages['app.course.ok']}
          cancelButton={this.context.intl.messages['app.course.cancel']}
        >
          {this.context.intl.messages[confirmMsgId]}
        </Confirm>

        <Confirm
          isOpen={this.state.isAlertOpen}
          confirm={this.onAlertConfirm}
          confirmButton={this.context.intl.messages['app.course.ok']}
          buttonNum={1}
        >
          {this.alertMsg}
        </Confirm>
      </div>
    );
  }
}

Course.contextTypes = {
  intl: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  fetchParams: {
    planId: ownProps.params.plan_id,
    courseId: ownProps.params.course_id,
    solutionId: ownProps.params.solution_id,
  },
  courseInfo: state.course.detail.info,
  assessment: state.course.assessment.info,
  nodes: state.course.nodes,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Object.assign({},
    courseActions),
    dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Course);
