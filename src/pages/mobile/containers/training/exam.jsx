import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loading from 'react-loading';
import { FormattedMessage } from 'react-intl';
import { RelativeLink } from 'react-router-relative-links';

import Exercise from '../../components/exercise';
import { training as trainingActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  exercise: PropTypes.object.isRequired,
  exerSubmit: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
};

class Exam extends Component {
  constructor(props, context) {
    super(props, context);
    this.getAnswerIdClick = this.getAnswerIdClick.bind(this);
    this.nextClick = this.nextClick.bind(this);
    this.submitClick = this.submitClick.bind(this);
    this.chooseAnswerIds = [];
    this.uuid = 0;
    this.handleExerciseIndex = 0;
    this.exerSubmit = {};
    this.exercises = {};
    this.isNext = false;
    this.isSubmiting = false;
    this.state = {
      handleExercise: {},
      type: 'handle',
      showAnalysis: false,
    };
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchTrainingExams(fetchParams);
  }

  componentWillReceiveProps(nextProps) {
    const { exercise, exerSubmit, isFetching } = nextProps;
    if (!isFetching && Object.keys(exercise).length && !this.isSubmiting) {
      this.uuid = exercise.uuid;
      this.exercises = exercise.exercise_data;
      this.isNext = false;
      this.handleExerciseIndex = 0;
      this.setState(Object.assign({}, this.state, {
        handleExercise: this.exercises[this.handleExerciseIndex],
      }));
    }

    if (!isFetching && Object.keys(exerSubmit).length && this.isSubmiting) {
      this.exerSubmit = exerSubmit;
      this.isNext = true;
      this.isSubmiting = false;
      this.setState(Object.assign({}, this.state, {
        type: 'show',
        showAnalysis: true,
        handleExercise: Object.assign({}, this.state.handleExercise, {
          analysis: this.exerSubmit.exercise_data.analysis,
          answer_right: this.exerSubmit.exercise_data.answer,
          answer_is_right: this.exerSubmit.answer_is_right,
        }),
      }));
    }
  }

  getAnswerIdClick(ids) {
    this.exercises[this.handleExerciseIndex].chooseAnswerIds = ids;
    this.chooseAnswerIds = ids;
  }

  getSubmitData() {
    const { fetchParams } = this.props;
    return {
      course_id: fetchParams.courseId,
      solution: fetchParams.solutionId,
      uuid: this.uuid,
      exercise_data: {
        id: this.state.handleExercise.id,
        type: this.state.handleExercise.type,
        score: this.state.handleExercise.score,
        user_answers: this.chooseAnswerIds.map(id => (
          {
            answer_id: id,
          }
        )),
      },
    };
  }

  nextClick() {
    this.handleExerciseIndex += 1;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.exercises[this.handleExerciseIndex],
      type: 'handle',
      showAnalysis: false,
    }));
    this.isNext = false;
  }

  submitClick() {
    const { actions, fetchParams } = this.props;
    const data = this.getSubmitData();
    actions.fetchTrainingExamsSubmit(fetchParams, data);
    this.isSubmiting = true;
  }

  render() {
    const { isFetching } = this.props;
    const { handleExercise, type, showAnalysis } = this.state;

    return (
      <div className="exams">
        {(() => {
          if (isFetching && !this.isSubmiting) {
            return (
              <div className="loading-center">
                <Loading type="balls" color="#38acff" />
              </div>
            );
          }

          if (!this.isSubmit && this.exercises.length) {
            return (
              <div className="process">
                <div className="process-body">
                  <Exercise
                    data={handleExercise}
                    type={type}
                    handle={this.getAnswerIdClick}
                    showAnalysis={showAnalysis}
                  />
                </div>
                <div className="process-footer">
                  {(() => {
                    if (this.handleExerciseIndex === this.exercises.length - 1 && this.isNext) {
                      return <RelativeLink to="../" className="exams-btn"><FormattedMessage {...messages.finish} /></RelativeLink>;
                    }
                    if (this.isSubmiting) {
                      return <a className="exams-btn disabled"><FormattedMessage {...messages.submit} /></a>;
                    }
                    if (this.isNext) {
                      return <a className="exams-btn" onClick={this.nextClick}><FormattedMessage {...messages.next} /></a>;
                    }
                    if (!this.isNext) {
                      return <a className="exams-btn" onClick={this.submitClick}><FormattedMessage {...messages.submit} /></a>;
                    }
                    return null;
                  })()}
                </div>
              </div>
            );
          }

          return null;
        })()}
      </div>
    );
  }
}

Exam.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    exercise: state.training.exercise || {},
    exerSubmit: state.training.exerSubmit || {},
    isFetching: state.training.isFetching || false,
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
))(Exam);
