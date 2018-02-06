import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Confirm from '../../components/confirm';
import Exercise from '../../components/exercise';
import { practice as practiceActions } from '../../actions';

import './practice.styl';
import messages from './messages';

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  exercise: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  indexOfPractice: PropTypes.number,
  breakPoint: PropTypes.bool,
};

const scrollpoint = (hash) => {
  const element = document.querySelector(hash);
  if (element) {
    element.scrollIntoView(true);
    document.body.scrollTop -= 180;
  }
};

class Practice extends Component {
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.oneMoreTime = this.oneMoreTime.bind(this);
    this.exercises = [];
    this.submitExercises = [];
    this.submitWrongExercises = [];
    this.noAnswerNum = 0;
    this.chooseAllAnswerIds = [];
    this.isSubmit = false;
    this.isReview = false;
    this.name = '';
    this.practiceTime = 0;
    this.state = {
      isConfirmOpen: false,
      showProcessPanel: true,
      handleExercises: [],
      wrong: false,
    };
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchPractices(fetchParams);
  }

  componentWillReceiveProps(nextProps) {
    const { exercise, indexOfPractice } = nextProps;
    this.exercises = (exercise.practice_pages && exercise.practice_pages[indexOfPractice || 0]
        .examination_paper.exercise_list) || [];
    this.name = (exercise.practice_pages && exercise.practice_pages[indexOfPractice || 0]
        .examination_paper.name) || '';
    this.setState({
      handleExercises: this.exercises,
    });
  }

  onConfirm() {
    const { fetchParams, actions, breakPoint } = this.props;
    this.closeConfirm();
    if (this.isSubmit) {
      this.setState({
        handleExercises: this.submitExercises,
      });
      this.isReview = true;
    } else {
      if (!breakPoint) {
        const { onClose } = this.props;
        onClose();
        actions.fetchPracticesRead(fetchParams);
      }
      this.isSubmit = true;
      this.hasWrong = !!this.submitWrongExercises.length;
      setTimeout(() => {
        this.openConfirm();
      }, 300);
    }
  }

  onCancel() {
    this.closeConfirm();
    if (this.isSubmit) {
      if (this.hasWrong) {
        this.oneMoreTime();
      } else {
        const { onClose } = this.props;
        onClose();
      }
    }
  }

  oneMoreTime() {
    this.isReview = false;
    this.isSubmit = false;
    this.hasWrong = false;
    this.practiceTime += 1;
    this.chooseAllAnswerIds = [];
    this.setState({
      showProcessPanel: true,
      handleExercises: this.exercises,
      wrong: false,
    });
  }

  getAnswerIdClick(index, ids) {
    this.chooseAllAnswerIds[index] = ids;
    this.exercises[index].user_answer_id = ids;
    this.setState({});
  }

  handleSubmit() {
    this.submitExercises = [];
    this.submitWrongExercises = [];

    for (let i = 0, length = this.exercises.length; i < length; i += 1) {
      const exercise = this.exercises[i];
      const rightAnswerId = [];
      for (let j = 0, l = exercise.answer.length; j < l; j += 1) {
        if (exercise.answer[j].is_right === 1) {
          rightAnswerId.push(exercise.answer[j].id);
        }
      }
      // eslint-disable-next-line max-len
      const answerIsRight = rightAnswerId.sort().toString() === (exercise.user_answer_id && exercise.user_answer_id.sort().toString());
      if (answerIsRight === false) {
        this.submitWrongExercises[i] = { ...exercise, answer_is_right: answerIsRight };
      }
      this.submitExercises.push({ ...exercise, answer_is_right: answerIsRight });
      delete exercise.user_answer_id;
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
    this.handleSubmit();
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

  render() {
    const { breakPoint, onClose } = this.props;
    const { showProcessPanel, handleExercises, wrong } = this.state;
    let confirmMsgMsgId;
    let confirmBtnMsgId;
    let cancelBtnMsgId;

    if (this.isSubmit) {
      if (this.hasWrong) {
        confirmMsgMsgId = 'oneMoreTime';
        cancelBtnMsgId = 'oneMoreTimeBtn';
      } else {
        confirmMsgMsgId = 'done';
        cancelBtnMsgId = 'continue';
      }
      confirmBtnMsgId = 'check';
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
              <div className="process">
                <div className="process-header">
                  <div>
                    <div className="process-name">《{this.name}》</div>
                    {this.isSubmit && this.isReview ?
                      breakPoint ?
                        <span>
                          <div className="process-submit" onClick={() => onClose()}><FormattedMessage {...messages.btnContinue} /></div>
                          <div className="process-submit" style={{ width: 100, marginRight: 24 }} onClick={() => this.oneMoreTime()}><FormattedMessage {...messages.oneMoreTimeBtn} /></div>
                          <div className="process-isShowWrong submit-isShowWrong" onClick={this.isWrong}><i className={wrong ? 'icon-wrong-active' : 'icon-wrong'} /><FormattedMessage {...messages.mistakes} /></div>
                        </span> :
                        <span>
                          <div className="process-submit" style={{ width: 100 }} onClick={() => this.oneMoreTime()}><FormattedMessage {...messages.oneMoreTimeBtn} /></div>
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
                <ul className="process-body">
                  {handleExercises.map((exercise, index) => (
                    <li key={`exercise-${exercise.id}-${this.practiceTime}`}>
                      {this.isSubmit && this.isReview ?
                        <Exercise data={exercise} type="show" NO={index + 1} showAnalysis id={`exercise-${index}`} /> :
                        <Exercise data={exercise} type="handle" handle={this.getAnswerIdClick} NO={index + 1} id={`exercise-${index}`} />
                      }
                    </li>
                  ))}
                </ul>
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
          buttonNum={!breakPoint && this.isSubmit && !this.hasWrong ? 1 : 2}
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

Practice.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    exercise: state.practice.exercise || {},
    fetchParams: {
      nodeId: ownProps.params.node_id,
      planId: ownProps.params.plan_id,
      courseId: ownProps.params.course_id,
      solutionId: ownProps.params.solution_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(practiceActions, dispatch),
  }
))(Practice);
