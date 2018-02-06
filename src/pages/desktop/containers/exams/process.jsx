import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { StickyContainer, Sticky } from 'react-sticky';

import Confirm from '../../components/confirm';
import Exercise from '../../components/exercise';
import { exams as examsActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  exercise: PropTypes.object.isRequired,
  processSubmit: PropTypes.object.isRequired,
  processSubmitBest: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

const formatSec = (sec) => {
  const hours = parseInt(sec / 3600, 10) % 24;
  const minutes = parseInt(sec / 60, 10) % 60;
  const seconds = sec % 60;

  return `${hours < 10 ? `0${hours}` : hours}: ${minutes < 10 ? `0${minutes}` : minutes}: ${seconds < 10 ? `0${seconds}` : seconds}`;
};

const scrollpoint = (hash) => {
  const element = document.querySelector(hash);
  if (element) {
    element.scrollIntoView(true);
    document.body.scrollTop -= 180;
  }
};

class Process extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.getAnswerIdClick = this.getAnswerIdClick.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.intervalCB = this.intervalCB.bind(this);
    this.goBackClick = this.goBackClick.bind(this);
    this.submitBestScoreClick = this.submitBestScoreClick.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
    this.openConfirm = this.openConfirm.bind(this);
    this.taggleProcessPanel = this.taggleProcessPanel.bind(this);
    this.routeLeaveHook = this.routeLeaveHook.bind(this);
    this.reviewClick = this.reviewClick.bind(this);
    this.time = 0;
    this.uuid = 0;
    this.exercises = [];
    this.chooseAllAnswerIds = [];
    this.intervalID = 0;
    this.isSubmit = false;
    this.isSubmitBest = false;
    this.submitCBData = {};
    this.noAnswerNum = 0;
    this.state = {
      formatTime: '00: 00: 00',
      isConfirmOpen: false,
      showProcessPanel: true,
    };
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsProcess(fetchParams);
    this.routeLeaveHook();
  }

  componentWillReceiveProps(nextProps) {
    const { exercise, processSubmit, processSubmitBest, actions } = nextProps;
    if (this.intervalID !== 0) {
      clearInterval(this.intervalID);
    }
    if (Object.keys(processSubmit).length) {
      this.isSubmit = true;
      this.submitCBData = processSubmit;
      actions.resetExamsProcessSubmit();
      if (processSubmit.rest_chance === 0) {
        this.submitBestScore();
      }
      this.closeConfirm();
    }
    if (this.isSubmitBest && Object.keys(processSubmitBest).length) {
      this.goBackClick();
      actions.resetExamsProcessSubmitBest();
      this.isSubmitBest = false;
    }
    if (!this.isSubmit) {
      this.exercises = exercise.exercise_data || [];
      this.time = exercise.time;
      this.uuid = exercise.uuid;
      this.setState(Object.assign({}, this.state, {
        formatTime: formatSec(this.time),
        showNumberExercise: false,
        isConfirmOpen: false,
      }));

      if (this.time) this.intervalID = setInterval(this.intervalCB, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    window.onbeforeunload = null;
  }

  onConfirm() {
    if (this.isSubmit) {
      this.isSubmitBest = true;
      this.submitBestScore();
    } else {
      const { actions, fetchParams } = this.props;
      const data = this.getSubmitData();
      actions.fetchExamsProcessSubmit(fetchParams, data);
    }
  }

  onCancel() {
    this.closeConfirm();
    if (this.isSubmit) {
      const { router } = this.props;
      router.goBack();
    }
  }

  getSubmitData() {
    const typeNum = {
      single: 1,
      multi: 2,
      judge: 3,
    };

    return {
      uuid: this.uuid,
      exercise_data: this.exercises.map((exercise, index) => (
        {
          id: exercise.id,
          type: typeNum[exercise.type],
          score: exercise.score,
          user_answers: this.chooseAllAnswerIds[index] ? this.chooseAllAnswerIds[index].map(id => (
            {
              answer_id: id,
            }
          )) : [],
        }
      )),
    };
  }

  getAnswerIdClick(index, ids) {
    this.chooseAllAnswerIds[index] = ids;
    this.setState({});
  }

  taggleProcessPanel() {
    this.setState({
      showProcessPanel: !this.state.showProcessPanel,
    });
  }

  submitBestScore() {
    const { actions, fetchParams } = this.props;
    actions.fetchExamsProcessSubmitBest(fetchParams);
  }

  submitClick() {
    const answerNum = this.chooseAllAnswerIds.reduce((previousValue, currentValue) => {
      if (currentValue.length) {
        return previousValue + 1;
      }
      return previousValue;
    }, 0);
    this.noAnswerNum = this.exercises.length - answerNum;
    this.openConfirm();
  }

  goBackClick() {
    const { router } = this.props;
    router.goBack();
  }

  reviewClick() {
    const { router, fetchParams } = this.props;
    const reviewId = this.submitCBData.record_id;
    router.replace(`/plan/${fetchParams.planId}/series/${fetchParams.solutionId}/exams/${fetchParams.quizId}/review/${reviewId}`);
  }

  submitBestScoreClick() {
    this.openConfirm();
  }

  intervalCB() {
    this.time -= 1;
    this.setState({
      formatTime: formatSec(this.time),
    });
    if (this.time === 0) {
      clearInterval(this.intervalID);
      const { actions, fetchParams } = this.props;
      const data = this.getSubmitData();
      actions.fetchExamsProcessSubmit(fetchParams, data);
    }
  }

  closeConfirm() {
    this.setState(Object.assign({}, this.state, {
      isConfirmOpen: false,
    }));
  }

  openConfirm() {
    this.setState(Object.assign({}, this.state, {
      isConfirmOpen: true,
    }));
  }

  routeLeaveHook() {
    const { route, router } = this.props;
    router.setRouteLeaveHook(route, () => {
      if (!this.isSubmit) {
        return this.context.intl.messages['app.exams.breakTheExam'];
      }
      return true;
    });
    window.onbeforeunload = (e) => {
      const message = this.context.intl.messages['app.exams.breakTheExam'];
      const event = e || window.event;
      if (!this.isSubmit) {
        if (event) {
          event.returnValue = message;
        }
        return message;
      }
      window.onbeforeunload = null;
      return null;
    };
  }

  render() {
    const { formatTime, showProcessPanel } = this.state;
    const { info } = this.props;
    let confirmMsgMsgId;
    let confirmBtnMsgId;
    let cancelBtnMsgId;

    if (this.isSubmit) {
      confirmMsgMsgId = 'confirmBestGrade';
      confirmBtnMsgId = 'confirmBtnBestGrade';
      cancelBtnMsgId = 'cancelBtnBestGrade';
    } else {
      confirmMsgMsgId = this.noAnswerNum ? 'confirmExamsHasNoAnswer' : 'confirmExams';
      confirmBtnMsgId = 'confirmBtn';
      cancelBtnMsgId = 'cancelBtn';
    }

    return (
      <div className="exams">
        {(() => {
          if (!this.isSubmit && this.exercises.length) {
            return (
              <StickyContainer className="process">
                <Sticky stickyClassName="exams-sticky">
                  <div className="process-header">
                    <div>
                      <div className="process-name">《{info.name}》</div>
                      <div className="process-submit" onClick={this.submitClick}><FormattedMessage {...messages.submit} /></div>
                      <div className="process-time active"><i className="icon-time-active" />{formatTime}</div>
                    </div>
                    {showProcessPanel ?
                      <ul className="process-panel">
                        {this.exercises.map((exercise, index) => (
                          this.chooseAllAnswerIds[index] && this.chooseAllAnswerIds[index].length ? <a key={exercise.id} onClick={() => scrollpoint(`#exercise-${index}`)}><li className="exercises-number-item active">{index + 1}</li></a> :
                          <a key={exercise.id} onClick={() => scrollpoint(`#exercise-${index}`)}><li className="exercises-number-item">{index + 1}</li></a>
                        ))}
                      </ul> : null}
                    <div className="process-panel-taggle">
                      {showProcessPanel ? <span onClick={this.taggleProcessPanel}><FormattedMessage {...messages.packUpThePanel} /><i className="icon-up" /></span> : <span onClick={this.taggleProcessPanel}><FormattedMessage {...messages.viewPanel} /><i className="icon-down" /></span>}
                    </div>
                  </div>
                </Sticky>
                <ul className="process-body">
                  {this.exercises.map((exercise, index) => (
                    <li key={`exercise-${exercise.id}-${index}`}><Exercise data={exercise} type="handle" handle={this.getAnswerIdClick} NO={index + 1} id={`exercise-${index}`} /></li>
                  ))}
                </ul>
              </StickyContainer>
            );
          }

          if (this.isSubmit) {
            return (
              <div className="process-result">
                <div className="noPanel process-name">
                  《{info.name}》
                </div>
                <div className="result-header">
                  <div className="icon-user-deck">
                    {this.submitCBData.img_url ? <div className="icon-user-img" style={{ background: `url(${this.submitCBData.img_url}) no-repeat left top/cover` }} /> : <div className="icon-user-default-img" />}
                  </div>
                  <div className="icon-score-deck">
                    <div className="exam-score"><span className="process-score">{Math.round(this.submitCBData.result)}</span><span className="process-score-unit">{this.submitCBData.pass_type === 1 ? '%' : <FormattedMessage {...messages.unitScore} />}</span></div>
                    <div className="exam-time"><FormattedMessage {...messages.finished} values={{ minutes: Math.floor(this.submitCBData.time_spend / 60) || '0', seconds: this.submitCBData.time_spend % 60 || '0' }} /></div>
                  </div>
                </div>
                <div className="result-body">
                  <div className="exam-status">{this.submitCBData.msg}</div>
                  <div className="exam-best-score"><FormattedMessage {...messages.bestGrade} /><span className="cOrange">{Math.round(this.submitCBData.best)}{this.submitCBData.pass_type === 1 ? '%' : <FormattedMessage {...messages.unitScore} />}</span></div>
                  {this.submitCBData.reviewable ? <div onClick={this.reviewClick} className="exam-reviewable"><FormattedMessage {...messages.reviewable} /></div> : null}
                </div>
                <div className="result-footer">
                  {this.submitCBData.rest_chance !== 0 ?
                    <a className="go-back-btn" onClick={this.goBackClick}>
                      <FormattedMessage {...messages.tryAgain} />
                      （{this.submitCBData.rest_chance === -1 ? <FormattedMessage {...messages.unlimitedChance} /> : <FormattedMessage {...messages.restChance} values={{ chance: this.submitCBData.rest_chance || '0' }} />}）
                    </a> : null
                  }
                  {this.submitCBData.can_submit_best_score ? <a className="submit-best-btn" onClick={this.submitBestScoreClick}><FormattedMessage {...messages.submitBestGrade} /></a> : null}
                  {!this.submitCBData.can_submit_best_score && this.submitCBData.rest_chance === 0 ? <a className="go-back-btn" onClick={this.goBackClick}><FormattedMessage {...messages.goBack} /></a> : null}
                </div>
              </div>
            );
          }
          return null;
        })()}
        <Confirm
          isOpen={this.state.isConfirmOpen}
          confirm={this.onConfirm}
          cancel={this.onCancel}
          confirmButton={<FormattedMessage {...messages[confirmBtnMsgId]} />}
          cancelButton={<FormattedMessage {...messages[cancelBtnMsgId]} />}
        >
          <FormattedMessage
            {...messages[confirmMsgMsgId]}
            values={{ noAnswerNum: this.noAnswerNum }}
          />
        </Confirm>
      </div>
    );
  }
}

Process.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    exercise: state.exams.exercise || {},
    processSubmit: state.exams.processSubmit || {},
    processSubmitBest: state.exams.processSubmitBest || {},
    info: state.exams.info || {},
    fetchParams: {
      planId: ownProps.location.query.sharePlanId || ownProps.params.plan_id,
      solutionId: ownProps.params.solution_id,
      quizId: ownProps.params.quiz_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(examsActions, dispatch),
  }
))(withRouter(Process));
