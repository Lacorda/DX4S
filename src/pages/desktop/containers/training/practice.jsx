import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { StickyContainer, Sticky } from 'react-sticky';

import Confirm from '../../components/confirm';
import Exercise from '../../components/exercise';
import { training as trainingActions } from '../../actions';

import './practice.styl';
import messages from './messages';

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  exercise: PropTypes.object.isRequired,
  backOfAnswer: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const scrollpoint = (hash) => {
  const element = document.querySelector(hash);
  if (element) {
    element.scrollIntoView(true);
    document.body.scrollTop -= 180;
  }
};

class Practice extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.getAnswerIdClick = this.getAnswerIdClick.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
    this.openConfirm = this.openConfirm.bind(this);
    this.taggleProcessPanel = this.taggleProcessPanel.bind(this);
    this.isWrong = this.isWrong.bind(this);
    this.getSubmitData = this.getSubmitData.bind(this);
    this.goBackClick = this.goBackClick.bind(this);
    this.routeLeaveHook = this.routeLeaveHook.bind(this);
    this.time = 0;
    this.uuid = 0;
    this.exercises = [];
    this.submitExercises = [];
    this.submitWrongExercises = [];
    this.backOfAnswerData = [];
    this.noAnswerNum = 0;
    this.chooseAllAnswerIds = [];
    this.isSubmit = false;
    this.isReview = false;
    this.submiting = false;
    this.state = {
      isConfirmOpen: false,
      showProcessPanel: true,
      handleExercises: [],
      wrong: false,
    };
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchTrainingExams(fetchParams);
    this.routeLeaveHook();
  }

  componentWillReceiveProps(nextProps) {
    const { exercise, backOfAnswer } = nextProps;

    if (Object.keys(backOfAnswer).length && this.submiting) {
      this.isSubmit = true;
      this.backOfAnswerData = backOfAnswer.exercise_data;
      this.handlebackOfAnswer();
      this.openConfirm();
    }
    this.exercises = exercise.exercise_data || [];
    this.time = exercise.time;
    this.uuid = exercise.uuid;
    this.setState({
      handleExercises: this.exercises,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    window.onbeforeunload = null;
  }

  onConfirm() {
    const { fetchParams, actions } = this.props;
    this.closeConfirm();
    if (this.isSubmit) {
      this.setState({
        handleExercises: this.submitExercises,
      });
      this.isReview = true;
    } else {
      const data = this.getSubmitData();
      actions.fetchTrainingPracticeSubmit(fetchParams, data);
      this.submiting = true;
    }
  }

  onCancel() {
    if (this.isSubmit) {
      this.goBackClick();
    }
    this.closeConfirm();
  }

  getSubmitData() {
    const { fetchParams } = this.props;
    return {
      course_id: fetchParams.courseId,
      solution: fetchParams.solutionId,
      uuid: this.uuid,
      exercise_data: this.exercises.map((exercise, index) => (
        {
          id: exercise.id,
          type: exercise.type,
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
    this.exercises[index].user_answer_id = ids;
    this.setState({});
  }

  goBackClick() {
    const { router } = this.props;
    router.goBack();
  }

  handlebackOfAnswer() {
    this.submitExercises = [];
    this.submitWrongExercises = [];
    this.wrongNum = 0;

    for (let i = 0, length = this.exercises.length; i < length; i += 1) {
      const exercise = this.exercises[i];
      for (let j = 0, l = this.backOfAnswerData.length; j < l; j += 1) {
        const answer = this.backOfAnswerData[j];
        if (answer.id === exercise.id) {
          if (answer.answer_is_right !== 1) {
            this.submitWrongExercises[i] = {
              ...exercise,
              analysis: answer.analysis,
              answer_right: answer.answer,
              answer_is_right: answer.answer_is_right,
            };
            this.wrongNum += 1;
          }
          this.submitExercises.push({
            ...exercise,
            analysis: answer.analysis,
            answer_right: answer.answer,
            answer_is_right: answer.answer_is_right,
          });
        }
      }
    }
  }

  isWrong() {
    const { wrong } = this.state;
    if (wrong) {
      this.setState({
        handleExercises: this.submitExercises,
        wrong: !wrong,
      });
    } else {
      this.setState({
        handleExercises: this.submitWrongExercises,
        wrong: !wrong,
      });
    }
  }

  taggleProcessPanel() {
    this.setState({
      showProcessPanel: !this.state.showProcessPanel,
    });
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
        return this.context.intl.messages['app.training.breakThePractice'];
      }
      return true;
    });
    window.onbeforeunload = (e) => {
      const message = this.context.intl.messages['app.training.breakThePractice'];
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
    const { showProcessPanel, handleExercises, wrong } = this.state;
    let confirmMsgMsgId;
    let confirmBtnMsgId;
    let cancelBtnMsgId;

    if (this.isSubmit) {
      confirmMsgMsgId = this.wrongNum ? 'hasWrong' : 'done';
      confirmBtnMsgId = 'check';
      cancelBtnMsgId = 'btnFinish';
    } else {
      confirmMsgMsgId = this.noAnswerNum ? 'examUnFinish' : 'examFinish';
      confirmBtnMsgId = 'submit';
      cancelBtnMsgId = 'cancel';
    }

    return (
      <div className="exams practice">
        {(() => {
          if (handleExercises) {
            return (
              <StickyContainer className="process">
                <Sticky stickyClassName="exams-sticky">
                  <div className="process-header">
                    <div>
                      <div className="process-name">《{this.context.intl.messages['app.training.practiceTraining']}》</div>
                      {this.isSubmit && this.isReview ?
                        <span>
                          <div className="process-submit" onClick={this.goBackClick}><FormattedMessage {...messages.btnFinish} /></div>
                          {this.wrongNum ? <div className="process-submit" style={{ marginRight: 20 }} onClick={() => location.reload()}><FormattedMessage {...messages.btnContinue} /></div> : ''}
                          <div className="process-isShowWrong submit-isShowWrong" onClick={this.isWrong}><i className={wrong ? 'icon-wrong-active' : 'icon-wrong'} /><FormattedMessage {...messages.mistakes} /></div>
                        </span> :
                        <div className="process-submit" onClick={this.submitClick}><FormattedMessage {...messages.btnSubmit} /></div>
                      }
                    </div>
                    {showProcessPanel ?
                      <ul className="process-panel">
                        {this.isSubmit && this.isReview ?
                          handleExercises.map((exercise, index) => (
                            !exercise.answer_is_right ? <a onClick={() => scrollpoint(`#exercise-${index}`)} key={exercise.id}><li className="exercises-number-item wrong">{index + 1}</li></a> :
                            <a onClick={() => scrollpoint(`#exercise-${index}`)} key={exercise.id}><li className="exercises-number-item right">{index + 1}</li></a>
                          )) :
                          handleExercises.map((exercise, index) => (
                            this.chooseAllAnswerIds[index] && this.chooseAllAnswerIds[index].length ? <a onClick={() => scrollpoint(`#exercise-${index}`)} key={exercise.id}><li className="exercises-number-item active">{index + 1}</li></a> :
                            <a onClick={() => scrollpoint(`#exercise-${index}`)} key={exercise.id}><li className="exercises-number-item">{index + 1}</li></a>
                          ))
                        }
                      </ul> : null}
                    <div className="process-panel-taggle">
                      {showProcessPanel ? <span onClick={this.taggleProcessPanel}><FormattedMessage {...messages.packUpThePanel} /><i className="icon-up" /></span> : <span onClick={this.taggleProcessPanel}><FormattedMessage {...messages.viewPanel} /><i className="icon-down" /></span>}
                    </div>
                  </div>
                </Sticky>
                <ul className="process-body">
                  {handleExercises.map((exercise, index) => (
                    <li key={`exercise-${exercise.id}`}>
                      {this.isSubmit && this.isReview ?
                        <Exercise data={exercise} type="show" NO={index + 1} showAnalysis id={`exercise-${index}`} /> :
                        <Exercise data={exercise} type="handle" handle={this.getAnswerIdClick} NO={index + 1} id={`exercise-${index}`} />
                      }
                    </li>
                  ))}
                </ul>
              </StickyContainer>
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
            values={{
              noAnswerNum: this.noAnswerNum,
              wrongNum: this.wrongNum,
            }}
          />
        </Confirm>
      </div>
    );
  }
}

Practice.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    exercise: state.training.exercise || {},
    backOfAnswer: state.training.backOfAnswer || {},
    fetchParams: {
      planId: ownProps.params.plan_id,
      solutionId: ownProps.params.solution_id,
      courseId: ownProps.params.course_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(trainingActions, dispatch),
  }
))(withRouter(Practice));
