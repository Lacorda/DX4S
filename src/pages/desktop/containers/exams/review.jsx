import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { StickyContainer, Sticky } from 'react-sticky';

import Exercise from '../../components/exercise';
import { exams as examsActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  review: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
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
    this.taggleProcessPanel = this.taggleProcessPanel.bind(this);
    this.isWrong = this.isWrong.bind(this);
    this.exercises = [];
    this.wrongExercises = [];
    this.state = {
      wrong: false,
      showProcessPanel: true,
      reviews: [],
    };
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsReview(fetchParams);
  }

  componentWillReceiveProps(nextProps) {
    const { review } = nextProps;
    this.exercises = review.exercise_data || [];
    this.wrongExercises = [];
    this.exercises.forEach((exercise, index) => {
      if (exercise.answer_is_right === 0) {
        this.wrongExercises[index] = exercise;
      }
    });
    this.setState({
      reviews: this.exercises,
    });
  }

  taggleProcessPanel() {
    this.setState({
      showProcessPanel: !this.state.showProcessPanel,
    });
  }

  isWrong() {
    const { wrong } = this.state;
    if (wrong) {
      this.setState({
        reviews: this.exercises,
        wrong: !wrong,
      });
    } else {
      this.setState({
        reviews: this.wrongExercises,
        wrong: !wrong,
      });
    }
  }

  render() {
    const { showProcessPanel, reviews, wrong } = this.state;
    const { info } = this.props;

    return (
      <div className="exams">
        {(() => {
          if (this.exercises.length) {
            return (
              <StickyContainer className="process">
                <Sticky stickyClassName="exams-sticky">
                  <div className="process-header">
                    <div>
                      <div className="process-name">《{info.name}》</div>
                      <div className="process-submit" onClick={() => window.history.back()}><FormattedMessage {...messages.back} /></div>
                      <div className="process-isShowWrong submit-isShowWrong" onClick={this.isWrong}><i className={wrong ? 'icon-wrong-active' : 'icon-wrong'} /><FormattedMessage {...messages.mistakes} /></div>
                    </div>
                    {showProcessPanel ?
                      <ul className="process-panel">
                        {reviews.map((exercise, index) => (
                          exercise.answer_is_right === 0 ? <a onClick={() => scrollpoint(`#exercise-${index}`)} key={exercise.id}><li key={exercise.id} className="exercises-number-item wrong">{index + 1}</li></a> :
                          <a onClick={() => scrollpoint(`#exercise-${index}`)} key={exercise.id}><li key={exercise.id} className="exercises-number-item right">{index + 1}</li></a>
                        ))}
                      </ul> : null
                    }
                    <div className="process-panel-taggle">
                      {showProcessPanel ? <span onClick={this.taggleProcessPanel}><FormattedMessage {...messages.packUpThePanel} /><i className="icon-up" /></span> : <span onClick={this.taggleProcessPanel}><FormattedMessage {...messages.viewPanel} /><i className="icon-down" /></span>}
                    </div>
                  </div>
                </Sticky>
                <ul className="process-body">
                  {reviews.map((exercise, index) => (
                    <li key={`exercise-${exercise.id}`}><Exercise data={exercise} type="show" NO={index + 1} id={`exercise-${index}`} showAnalysis /></li>
                  ))}
                </ul>
              </StickyContainer>
            );
          }
          return null;
        })()}
      </div>
    );
  }
}

Process.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    review: state.exams.review || {},
    info: state.exams.info || {},
    fetchParams: {
      planId: ownProps.location.query.sharePlanId || ownProps.params.plan_id,
      solutionId: ownProps.params.solution_id,
      quizId: ownProps.params.quiz_id,
      recordId: ownProps.params.record_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(examsActions, dispatch),
  }
))(Process);
