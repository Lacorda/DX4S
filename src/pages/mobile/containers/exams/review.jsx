import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Loading from 'react-loading';
import classnames from 'classnames';
import { nav } from 'utils/dx';
import Exercise from '../../components/exercise';
import messages from './messages';
import { exams as examsActions } from '../../actions';

import './styles.styl';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  review: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
};

class Process extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
    this.isWrong = this.isWrong.bind(this);
    this.chooseExerciseClick = this.chooseExerciseClick.bind(this);
    this.numberExerciseClick = this.numberExerciseClick.bind(this);
    this.handleExerciseIndex = 0;
    this.reviews = [];
    this.state = {
      handleExercise: {},
      showNumberExercise: false,
      wrong: this.wrong,
    };
    this.wrong = false;
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsReview(fetchParams);
    setNav(this.context.intl.messages['app.exams.title.review']);
  }

  componentWillReceiveProps(nextProps) {
    const { review } = nextProps;
    this.reviews = review.exercise_data || [];
    this.handleExerciseIndex = 0;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.reviews[this.handleExerciseIndex],
      wrong: this.wrong,
    }));
  }
  isWrong() {
    const { review } = this.props;
    this.wrong = !(this.wrong);
    if (this.wrong === false) {
      this.reviews = review.exercise_data || [];
    } else {
      this.reviews = [];
      review.exercise_data.map((item) => {
        if (item.answer_is_right === 0) {
          this.reviews.push(item);
        }
      });
    }
    this.handleExerciseIndex = 0;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.reviews[this.handleExerciseIndex],
      wrong: this.wrong,
    }));
  }
  chooseExerciseClick() {
    this.setState(Object.assign({}, this.state, {
      showNumberExercise: !this.state.showNumberExercise,
    }));
  }
  numberExerciseClick(index) {
    this.handleExerciseIndex = index;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.reviews[this.handleExerciseIndex],
      showNumberExercise: false,
    }));
  }
  nextClick() {
    this.handleExerciseIndex += 1;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.reviews[this.handleExerciseIndex],
      wrong: this.wrong,
    }));
  }

  prevClick() {
    this.handleExerciseIndex -= 1;
    this.setState(Object.assign({}, this.state, {
      handleExercise: this.reviews[this.handleExerciseIndex],
      wrong: this.wrong,
    }));
  }

  render() {
    const { isFetching } = this.props;
    const { handleExercise, wrong, showNumberExercise } = this.state;
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
                  {this.reviews.length ? `${this.handleExerciseIndex + 1} / ${this.reviews.length}` : '0 / 0'}
                </div>
                <i className="br40" />
                <div className={wrong ? 'process-wrong active' : 'process-wrong'} onClick={this.isWrong}><i className={wrong ? 'icon-active-wrong' : 'icon-wrong'} /><FormattedMessage {...messages.mistakes} /></div>
              </div>
              <div className="process-body">
                {this.reviews.length ? <Exercise data={handleExercise} type="show" showAnalysis /> : ''}
              </div>
              <div className="process-footer">
                {
                  this.handleExerciseIndex === 0 ? <a className="process-prev disabled"><FormattedMessage {...messages.prev} /></a> : <a className="process-prev" onClick={this.prevClick}><FormattedMessage {...messages.prev} /></a>
                }
                {
                  this.handleExerciseIndex === this.reviews.length - 1 ? <a className="process-next disabled"><FormattedMessage {...messages.next} /></a> : <a className="process-next" onClick={this.nextClick}><FormattedMessage {...messages.next} /></a>
                }
              </div>
              {
                showNumberExercise && (
                  <div className={processPanelClass}>
                    <ul className="exercises-number clearfix">
                      {
                        this.reviews.map((reviews, index) => (
                          (index === this.handleExerciseIndex && <li key={reviews.id} className="exercises-number-item active" onClick={() => this.numberExerciseClick(index)}>{index + 1}</li>)
                          || <li key={reviews.id} className="exercises-number-item" onClick={() => this.numberExerciseClick(index)}>{index + 1}</li>
                        ))
                      }
                    </ul>
                  </div>
                )
              }
            </div>
          );
        })()}
      </div>
    );
  }
}

Process.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    review: state.exams.review || {},
    isFetching: state.exams.isFetching || false,
    fetchParams: {
      planId: ownProps.params.plan_id,
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
