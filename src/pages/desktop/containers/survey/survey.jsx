import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Lightbox from 'react-image-lightbox';
import { StickyContainer, Sticky } from 'react-sticky';
import Alert from '../../components/alert';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import './survey.styl';
import { surveys as surveyActions, course as courseActions  } from '../../actions';
import empty from './img/empty.png';
import over from './img/over.png';

const scrollpoint = (hash) => {
  const element = document.querySelector(hash);
  if (element) {
    element.scrollIntoView(true);
  }
};

class Survey extends Component {
  static propTypes() {
    return {
      actions: PropTypes.object.isRequired,
      fetchParams: PropTypes.object.isRequired,
      assessment: PropTypes.object,
      location: PropTypes.object,
      survey: PropTypes.object.isRequired,
      afterSubmit: PropTypes.func,
      alreadySubmit: PropTypes.bool,
      route: PropTypes.object.isRequired,
    };
  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      isAlertOpen: false,
      showSheet: true,
      userAnswers: [],
      showImg: false,
      courseIsPass: false,
    };
    this.noAnswerNum = '';
    this.images = [];
    this.userAnswers = [];
    this.onAnswer = ::this.onAnswer;
    this.onSubmit = ::this.onSubmit;
    this.onShowImg = ::this.onShowImg;
    this.onHideImg = ::this.onHideImg;
    this.onCloseAlert = ::this.onCloseAlert;
    this.onLeave = ::this.onLeave;
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    const p = actions.fetchSurvey(fetchParams);
    p.catch((err) => {
      if (err.message === '1' && this.props.afterSubmit) {
        this.props.afterSubmit();
      }
      if (err.message === '2' && this.props.afterSubmit) {
        this.props.afterSubmit();
      }
    });

    // 共享学习 判断是否已经学习
    if (fetchParams.solution_id - 0 === 0) {
      actions.fetchAssement({
        plan_id: fetchParams.plan_id,
        solution_id: 0,
        course_id: fetchParams.course_id,
      }).then(() => {
        const { assessment } = this.props;
        const passState = assessment.pass_state;
        this.setState({ ...this.state, courseIsPass: passState === 2 });
      });
    }

    this.onLeave();
  }

  componentWillUnmount() {
    this.props.actions.initSurvey();
  }

  onLeave() {
    const { route, fetchParams } = this.props;
    const router = this.context.router;
    const message = this.context.intl.messages['app.survey.leave'];
    const isIndependent = !fetchParams.chap_id || false;
    if (!isIndependent) {
      return;
    }

    router.setRouteLeaveHook(route, () => {
      const { alreadySubmit } = this.props;
      if (!alreadySubmit) {
        return message;
      }
      return true;
    });
    window.onbeforeunload = (e) => {
      const event = e || window.event;
      const { alreadySubmit } = this.props;
      if (!alreadySubmit) {
        if (event) {
          event.returnValue = message;
        }
        return message;
      }
      window.onbeforeunload = null;
      return null;
    };
  }

  onAnswer(question, option) {
    if (question.type === 'single') {
      this.userAnswers[question.id] = option.id;
    }

    if (question.type === 'multi') {
      this.userAnswers[question.id] = this.userAnswers[question.id] || [];

      const index = this.userAnswers[question.id].indexOf(option.id);
      if (index !== -1) {
        this.userAnswers[question.id].splice(index, 1);
      } else {
        this.userAnswers[question.id].push(option.id);
      }

      if (!this.userAnswers[question.id].length) {
        delete this.userAnswers[question.id];
      }
    }

    this.setState(Object.assign({}, this.state, {
      userAnswers: this.userAnswers,
    }));
  }

  onSubmit() {
    const { fetchParams, survey, actions } = this.props;
    const questions = survey.items || [];
    const maxLength = questions.length;
    const len = Object.keys(this.userAnswers).length;

    if (len < maxLength) {
      this.noAnswerNum = maxLength - len;
      this.setState({ ...this.state, isAlertOpen: true });
      return;
    }

    const data = {
      id: fetchParams.id,
      plan_id: fetchParams.plan_id,
      solution_id: (fetchParams.solution_id - 0) || '',
      course_id: fetchParams.course_id || '',
      chap_id: fetchParams.chap_id || '',
      chap_node_id: fetchParams.chap_node_id || '',
      from: 'teacher',
      questions: [],
    };

    Object.keys(this.userAnswers).every((key) => {
      data.questions.push({
        id: key,
        user_answers: (typeof this.userAnswers[key] === 'object' ? this.userAnswers[key] : [this.userAnswers[key]]),
      });

      return data.questions;
    });

    const p = actions.submitSurvey(data);
    if (this.props.afterSubmit) {
      p.then(this.props.afterSubmit);
    }

    // 系列课中的问卷  设为已读
    if (!data.chap_id) {
      const req = {
        plan_id: fetchParams.plan_id,
        solution_id: 0,
        course_id: fetchParams.solution_id,
        chap_node_id: fetchParams.chap_node_id,
      };
      actions.readSurvey(req);
    }
  }

  onCloseAlert() {
    this.setState({ ...this.state, isAlertOpen: false });
  }

  onShowImg(img, event) {
    this.setState({
      showImg: true,
      imgIndex: this.images.indexOf(img),
    });
    event.stopPropagation();
    event.preventDefault();
  }

  onHideImg() {
    this.setState({ showImg: false });
  }

  checkSelected(question, optionId) {
    let answerIds = null;
    if (question.type === 'single') {
      answerIds = this.state.userAnswers[question.id];
      if (answerIds === optionId) {
        return 'active';
      }
    }
    if (question.type === 'multi') {
      answerIds = this.state.userAnswers[question.id] || [];
      return answerIds.indexOf(optionId) > -1 ? 'active' : '';
    }
    return '';
  }

  render() {
    const self = this;
    const { survey, alreadySubmit, fetchParams } = this.props;
    const { userAnswers, showSheet, showImg, imgIndex } = this.state;

    const questions = survey.items || [];
    const upperAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const isIndependent = !fetchParams.chap_id || false;
    let courseIsPass = this.state.courseIsPass;
    // 共享学习 系列课的问卷
    if (fetchParams.solution_id - 0 > 0) {
      const { location } = this.props;
      if (location) {
        courseIsPass = location.query.passStatus - 0 === 7;
      }
    }

    if (alreadySubmit || courseIsPass) {
      return (
        <div>
          { isIndependent ? <DxHeader /> : null }
          <div className="dx-container survey">
            <div className="empty">
              <img src={empty} alt="empty" />
              <span>{this.context.intl.messages['app.survey.submitted']}</span>
            </div>
          </div>
          { isIndependent ? <DxFooter /> : null }
        </div>
      );
    }
    if (!questions.length) {
      return (
        <div>
          { isIndependent ? <DxHeader /> : null }
          <div className="dx-container survey">
            <div className="empty">
              <img src={over} alt="over" />
              <span>{this.context.intl.messages['app.survey.over']}</span>
            </div>
          </div>
          { isIndependent ? <DxFooter /> : null }
        </div>
      );
    }

    return (
      <div>
        { isIndependent ? <DxHeader /> : null }
        <StickyContainer className="dx-container survey">
          <Sticky stickyClassName="exams-sticky">
            <div className="sheet-header">
              <div>
                <div className="sheet-name">《{survey.title}》</div>
                <div className="sheet-submit" onClick={this.onSubmit}>{this.context.intl.messages['app.survey.submit']}</div>
              </div>
              {
                /* 答题卡*/
                showSheet ?
                  <div className="sheet-panel">
                    {
                      questions.map((question, index) => (
                        <a
                          key={question.id}
                          className={`sheet-number ${userAnswers[question.id] !== undefined ? 'active' : ''}`}
                          onClick={() => scrollpoint(`#question-${index}`)}
                        >
                          {index + 1}
                        </a>
                      ))
                    }
                  </div> : null
              }
              <div className="sheet-taggle">
                <a className="sheet-taggle-bar up" onClick={() => { this.setState({ showSheet: !showSheet }); }}>
                  {this.context.intl.messages[`${showSheet ? 'app.survey.hidePanel' : 'app.survey.expandPanel'}`]}
                </a>
              </div>
            </div>
          </Sticky>
          <ul className="question-list">
            {
              questions.map((question, index) => (
                <li className="question-item" key={question.id} id={`question-${index}`}>
                  <div className="question-content">
                    <div className="content">
                      <span>{index + 1}、</span>
                      <span className={`type ${question.type}`}>
                        {this.context.intl.messages[`app.survey.${question.type}`]}
                      </span>
                      {question.title}
                    </div>
                    <ul className="question-imgs">
                      {
                        question.files.map((file) => {
                          this.images.push(file.url);
                          return (<li
                            key={file.id}
                            className="question-img"
                            style={{ background: `url(${file.url}) no-repeat`, backgroundSize: 'cover' }}
                            onClick={event => this.onShowImg(file.url, event)}
                          />);
                        })
                      }
                    </ul>
                  </div>
                  <ul className="question-option">
                    {
                      question.options.map((option, optionIndex) => (
                        <li
                          key={option.id}
                          className={`question-option-item ${question.type} ${this.checkSelected(question, option.id)}`}
                          onClick={() => { this.onAnswer(question, option); }}
                        >
                          <span className="question-option-item-title">{upperAlpha[optionIndex]}. {option.content}</span>
                          <ul className="option-img">
                            {
                              option.files.map((optionFile) => {
                                this.images.push(optionFile.url);
                                return (<li
                                  key={optionFile.id}
                                  className="question-img"
                                  style={{ background: `url(${optionFile.url}) no-repeat`, backgroundSize: 'cover' }}
                                  onClick={event => this.onShowImg(optionFile.url, event)}
                                />);
                              })
                            }
                          </ul>
                        </li>
                      ))
                    }
                  </ul>
                </li>
              ))
            }
          </ul>
        </StickyContainer>
        { isIndependent ? <DxFooter /> : null }
        {showImg ?
          <Lightbox
            mainSrc={this.images[imgIndex]}
            nextSrc={this.images[(imgIndex + 1) % this.images.length]}
            prevSrc={this.images[(imgIndex + this.images.length - 1) % this.images.length]}
            onCloseRequest={() => this.setState({ showImg: false })}
            onMovePrevRequest={() => this.setState({
              imgIndex: (imgIndex + this.images.length - 1) % this.images.length,
            })}
            onMoveNextRequest={() => this.setState({
              imgIndex: (imgIndex + 1) % this.images.length,
            })}
          /> : null
        }
        <Alert
          isShow={this.state.isAlertOpen}
          imgType={'warning'}
          onRequestClose={this.onCloseAlert}
        >
          { this.context.intl.formatMessage({ id: 'app.survey.tip' }, { num: self.noAnswerNum }) }
        </Alert>
      </div>
    );
  }
}

Survey.contextTypes = {
  intl: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  fetchParams: {
    id: ownProps.params.survey_id,
    plan_id: ownProps.params.plan_id,
    course_id: ownProps.params.course_id || '',
    solution_id: ownProps.params.solution_id || '',
    chap_id: ownProps.params.chap_id || '',
    chap_node_id: ownProps.params.chap_node_id || '',
  },
  alreadySubmit: state.survey.detail.alreadySubmit || false,
  survey: state.survey.detail || {},
  assessment: state.course.assessment.info || {},
});

const mapDispatchToProps = dispatch => ({
  // actions: bindActionCreators(Object.assign({},
  //   surveyActions),
  //   dispatch),
  actions: bindActionCreators(Object.assign({},
      surveyActions,
      courseActions),
    dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
