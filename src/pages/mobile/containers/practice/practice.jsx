import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Loading from 'react-loading';
import classnames from 'classnames';
import { nav } from 'utils/dx';
import Exercise from '../../components/exercise';
import { Confirm } from '../../../../components/modal/index';
import Toast from '../../../../components/modal/toast';
import messages from './messages';
import { practice as practiceActions } from '../../actions';

// TODO 断点练习中，footer一直显示的问题临时用shouldShowFooter解决，请用正确方式改正
const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  exercise: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
  afterSubmit: PropTypes.func,
  undoSubmit: PropTypes.func,
  afterSubmitBtn: PropTypes.bool,
  indexOfPractice: PropTypes.number,
};

const contextTypes = {
    intl: React.PropTypes.object.isRequired,
};
class Practice extends Component {
  constructor(props, context) {
    super(props, context);
    this.setNavBar = this.setNavBar.bind(this);
    this.getAnswerIdClick = this.getAnswerIdClick.bind(this);
    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
    this.chooseExerciseClick = this.chooseExerciseClick.bind(this);
    this.numberExerciseClick = this.numberExerciseClick.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.checkClick = this.checkClick.bind(this);
    this.openToast = this.openToast.bind(this);
    this.openConfirm = this.openConfirm.bind(this);
    this.closeConfirm = this.closeConfirm.bind(this);
    this.submitStatus = this.submitStatus.bind(this);
    this.afterSubmitSend = this.afterSubmitSend.bind(this);
    this.setNavBar = this.setNavBar.bind(this);
    this.moreExercise = this.moreExercise.bind(this);
    this.handleExerciseIndex = 0;
    this.exercises = [];
    this.chooseAllAnswerIds = [];
    this.chooseAllSelect = [];
    this.rightAnswerIds = [];
    this.Analysis = [];
    this.msg = '';
    this.submitCBData = {};
    this.state = {
      handleExercise: {},
      showNumberExercise: false,
      showAnswerExercise: false,
      status: 'answer',
      isConfirmOpen: false,
      isToastShow: false,
      afterSubmitBtn: false,
      shouldShowFooter: true,
    };
    this.initExercise = [];
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchPractices(fetchParams);
  }

  componentWillReceiveProps(nextProps) {
    const { exercise, indexOfPractice } = nextProps;
    this.exercises = (exercise.practice_pages && exercise.practice_pages[indexOfPractice || 0]
        .examination_paper.exercise_list) || [];
    this.handleExerciseIndex = 0;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.exercises[this.handleExerciseIndex],
    }));
  }

  getAnswerIdClick(ids) {
    this.exercises[this.handleExerciseIndex].chooseAnswerIds = ids;
    this.exercises[this.handleExerciseIndex].user_answer_id = ids;
    this.chooseAllAnswerIds[this.handleExerciseIndex] = ids;
    this.chooseAllSelect[this.handleExerciseIndex] = this.handleExerciseIndex;
    if (ids.length > 0) {
      this.chooseAllSelect[this.handleExerciseIndex] = this.handleExerciseIndex;
    } else {
      this.chooseAllSelect.splice(this.handleExerciseIndex, 1);
    }
    if (!this.rightAnswerIds[this.handleExerciseIndex]) {
      const rightAnswerIndex = [];
      this.exercises[this.handleExerciseIndex].answer.map(item => (
         (item.is_right === 1) && (rightAnswerIndex.push(item.id))
      ));
      this.rightAnswerIds[this.handleExerciseIndex] = rightAnswerIndex;
    }
    this.state.handleExercise.answer_is_right = this.chooseAllAnswerIds[this.handleExerciseIndex].sort().toString() === this.rightAnswerIds[this.handleExerciseIndex].sort().toString();
  }
  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.practice.title'],
    });
  }
  nextClick() {
    this.handleExerciseIndex += 1;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.exercises[this.handleExerciseIndex],
      isConfirmOpen: false,
    }));
  }

  prevClick() {
    this.handleExerciseIndex -= 1;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.exercises[this.handleExerciseIndex],
      isConfirmOpen: false,
    }));
  }

  chooseExerciseClick() {
    if (this.state.status === 'answer') {
      this.setState(Object.assign({}, this.state, {
        showNumberExercise: !this.state.showNumberExercise,
      }));
    } else {
      this.setState(Object.assign({}, this.state, {
        showAnswerExercise: !this.state.showAnswerExercise,
      }));
    }
  }

  numberExerciseClick(index) {
    this.handleExerciseIndex = index;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.exercises[this.handleExerciseIndex],
      showNumberExercise: false,
      showAnswerExercise: false,
    }));
  }
  submitStatus() {
    this.setState(Object.assign({}, this.state, {
      isToastShow: true,
      handleExercise: this.exercises[this.handleExerciseIndex],
      showNumberExercise: false,
      showAnswerExercise: true,
      isConfirmOpen: false,
      status: 'check',
    }));
    this.Analysis = this.exercises.map((item, index) => {
      if (!this.chooseAllAnswerIds[index]) {
        return false;
      }
      return this.chooseAllAnswerIds[index].sort().toString() === this.rightAnswerIds[index].sort().toString();
    });
  }
  submitClick() {
    const This = this;
    const { fetchParams, actions } = this.props;
    // 不是断点练习
    if (!this.props.afterSubmitBtn && fetchParams.nodeId && fetchParams.planId && fetchParams.courseId && fetchParams.solutionId !== undefined) {
      actions.fetchPracticesRead(fetchParams).then(() => {
        This.submitStatus();
        if (This.props.afterSubmit) {
          This.props.afterSubmit();
        }
      });
    } else {
      // 断点
      This.setState({ shouldShowFooter: false });
      This.submitStatus();
    }
  }
  checkClick() {
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.exercises[this.handleExerciseIndex],
      showAnswerExercise: true,
    }));
  }
  afterSubmitSend() {
    const { fetchParams, actions } = this.props;
    if (fetchParams.nodeId && fetchParams.planId && fetchParams.courseId && fetchParams.solutionId !== undefined) {
      let p = actions.fetchPracticesRead(fetchParams);
      p = p.then(() => {
        if (this.props.afterSubmit) {
          p.then(this.props.afterSubmit);
        }
      });
    }
  }
  moreExercise() {
    if (this.props.undoSubmit) {
      for(let i = 0; i < this.exercises.length; i++) {
        delete this.exercises[i].chooseAnswerIds;
      }
      this.setState({
        status: 'answer',
        showNumberExercise: false,
        showAnswerExercise: false,
        handleExercise: this.exercises[0],
      }, () => this.props.undoSubmit());
      this.handleExerciseIndex = 0;
      this.shouldShowFooter = true;
      this.chooseAllAnswerIds = [];
      this.chooseAllSelect = [];
    }
  }
  openToast() {
    this.setState(Object.assign({}, this.state, {
      isToastShow: true,
    }));
  }
  openConfirm() {
    const answerNum = this.chooseAllAnswerIds.reduce((previousValue, currentValue) => {
      if (currentValue.length) {
        return previousValue + 1;
      }
      return previousValue;
    }, 0);
    const noAnswerNum = this.exercises.length - answerNum;
    this.msg = noAnswerNum === 0 ? <FormattedMessage {...messages.examFinish} /> : <FormattedMessage {...messages.examUnFinish} values={{ noAnswerNum }} />;
    this.setState(Object.assign({}, this.state, {
      isConfirmOpen: true,
    }));
  }

  closeConfirm() {
    this.setState(Object.assign({}, this.state, {
      isConfirmOpen: false,
    }));
  }
  render() {
    const { isFetching } = this.props;
    const { handleExercise, showNumberExercise, showAnswerExercise, status } = this.state;
    const self = this;
    let exerciseStatus = true;
    for (let i = 0; i < this.Analysis.length; i++) {
      if (this.Analysis[i] === false) {
        exerciseStatus = false;
        break;
      }
    }
    this.setNavBar();
    return (
      <div className="exams">
        {(() => {
          if (isFetching) {
            return (
              <div className="loading-center">
                <Loading type="balls" color="#38acff" />
              </div>
            );
          }
          if (this.exercises.length) {
            const processNumberClass = classnames({
              'process-number': true,
              active: showNumberExercise,
            });
            const iconNumberClass = classnames({
              'icon-number': true,
              active: showNumberExercise,
            });
            const processPanelClass = classnames({
              'process-panel': !__platform__.web,
              'process-panel-web': __platform__.web,
            });
            return (
              <div className="process">
                <div className="process-header">
                  <div className="process-time"><i className="icon-time" />--:--:--</div>
                  <i className="br40" />
                  <div className={processNumberClass} onClick={this.chooseExerciseClick}>
                    <i className={iconNumberClass} />
                    {this.handleExerciseIndex + 1} / {this.exercises.length}
                  </div>
                  <i className="br40" />
                  <div className="process-submit" onClick={this.props.afterSubmitBtn && status === 'check' ? this.afterSubmitSend : (status === 'answer' ? this.openConfirm : this.checkClick)}>
                    <i className="icon-submit" />
                    { this.props.afterSubmitBtn && status === 'check' ? <FormattedMessage {...messages.btnContinue} /> : (status === 'answer' ? <FormattedMessage {...messages.btnSubmit} /> : <FormattedMessage {...messages.btnCheck} />)}
                  </div>
                </div>
                <div className="process-body">
                  <Confirm
                    isOpen={this.state.isConfirmOpen}
                    // onRequestClose={this.closeConfirm}
                    shouldCloseOnOverlayClick={false}
                    onConfirm={this.submitClick}
                    confirmButton={<span><FormattedMessage {...messages.submit} /></span>}
                    cancelButton={<span><FormattedMessage {...messages.cancel} /></span>}
                  >
                    <span>{this.msg}</span>
                  </Confirm>
                  <Toast
                    style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
                    isOpen={this.state.isToastShow}
                    timeout={2000}
                    shouldCloseOnOverlayClick={false}
                    onRequestClose={() => {
                      self.setState(Object.assign({}, this.state, {
                        isToastShow: false,
                      }));
                    }}
                  >
                    {exerciseStatus &&<div><FormattedMessage {...messages.done} /></div>}
                    {exerciseStatus === false &&<div><FormattedMessage {...messages.fail} /></div>}
                  </Toast>
                  {status === 'answer' ? <Exercise data={handleExercise} type="handle" handle={this.getAnswerIdClick} /> : <Exercise data={handleExercise} type="show" showAnalysis />}
                </div>
                <div className="process-footer" style={{ display: this.state.shouldShowFooter ? 'block' : 'none' }}>
                  {
                    this.handleExerciseIndex === 0 ? <a className="process-prev disabled"><FormattedMessage {...messages.prev} /></a> : <a className="process-prev" onClick={this.prevClick}><FormattedMessage {...messages.prev} /></a>
                  }
                  {
                    this.handleExerciseIndex === this.exercises.length - 1 ? <a className="process-next disabled"><FormattedMessage {...messages.next} /></a> : <a className="process-next" onClick={this.nextClick}><FormattedMessage {...messages.next} /></a>
                  }
                </div>
                {
                  (showNumberExercise && (
                    <div className={processPanelClass}>
                      <ul className="exercises-number clearfix">
                        {
                          this.exercises.map((exercise, index) => (
                            ((this.chooseAllSelect.indexOf(index) !== -1) && <li key={exercise.id} className="exercises-number-item active" onClick={() => this.numberExerciseClick(index)}>{index + 1}</li>)
                            || <li key={exercise.id} className="exercises-number-item" onClick={() => this.numberExerciseClick(index)}>{index + 1}</li>
                          ))
                        }
                      </ul>
                    </div>
                  )) || (showAnswerExercise && (
                    <div className={processPanelClass}>
                      <ul className="exercises-number clearfix">
                        {
                          this.exercises.map((exercise, index) => (
                            (this.Analysis[index] && <li key={exercise.id} className="exercises-number-item" onClick={() => this.numberExerciseClick(index)}><i className="icon-answer-right" />{index + 1}</li>)
                            || <li key={exercise.id} className="exercises-number-item" onClick={() => this.numberExerciseClick(index)}><i className="icon-answer-wrong" />{index + 1}</li>
                          ))
                        }
                      </ul>
                      <a className="answer-btn disabled" onClick={() => this.numberExerciseClick(0)}><FormattedMessage {...messages.check} /></a>
                      {exerciseStatus === false && <a className="exercise-btn disabled" onClick={() => this.moreExercise()}><FormattedMessage {...messages.moreExercise} /></a>}
                      {this.props.afterSubmitBtn && <a className="continue-btn disabled" onClick={() => this.afterSubmitSend()}><FormattedMessage {...messages.continue} /></a>}
                    </div>
                  ))

                }
              </div>
            );
          }
          return null;
        })() }
      </div>
    );
  }
}

Practice.propTypes = propTypes;
Practice.contextTypes = contextTypes;
export default connect((state, ownProps) => (
  {
    exercise: state.practice.exercise || {},
    isFetching: state.practice.isFetching || false,
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
