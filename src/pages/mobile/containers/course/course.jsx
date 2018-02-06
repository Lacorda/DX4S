/**
* 课程中心-课程详情
*/
import React, { Component, PropTypes } from 'react';
import RelativeLink from 'components/links';
import classNames from 'classnames';
import Button from 'components/button';
import { Detail, Chapter } from './detail';
import './course.styl';
import { nav } from 'utils/dx';
import { Alert } from '../../../../components/modal';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Link } from 'react-router';
import api from 'utils/api';

class Course extends Component {
  static contextTypes = {
    router: PropTypes.object,
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      // isConfirmOpen: false,
      isAlertOpen: false,
      isShareAlertOpen: false,
    };
    this.closeShareAlert = ::this.closeShareAlert;
    this.setNavBar = ::this.setNavBar;
    this.handleFavor = ::this.handleFavor;
    this.go2Task = ::this.go2Task;
    this.errorMsg = '';
    this.closeAlert = ::this.closeAlert;
  }

  componentDidMount() {
    console.log(this.props.params);
    const query = {
      plan_id: this.props.params.plan_id,
      solution_id: this.props.params.solution_id || 0,
      course_id: this.props.params.course_id,
    };
    this.props.actions.fetchCourse(query)
    .then(() => {
      this.props.actions.fetchAssement(query).then(() => {
        const detail = this.props.course.detail;
        const info = detail.info;
        if (info.need_update_complete_status && info.pass_state !== 2) {
          this.setState({ ...this.state, isShareAlertOpen: true });
        }
      });
    })
    .catch((err) => {
      const error = JSON.parse(err.message);
      this.errorMsg = error.message;
      this.setState({ ...this.state, isAlertOpen: true });
    });
  }

  componentWillUnmount() {
    this.props.actions.initCourse();
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.course.title'],
    });
  }

  handleFavor(isFavor) {
    const data = {
      plan_id: this.props.params.plan_id,
      solution_id: (this.props.params.solution_id) || 0,
      course_id: this.props.params.course_id,
      is_favor: isFavor,
    };
    this.props.actions.favorCourse(data);
  }

  go2Task(planId) {
    const router = this.context.router;
    router.push(router.createPath(`/plan/detail/${planId}`));
  }

  closeAlert() {
    this.setState({ ...this.state, isAlertOpen: false });
    history.back();
  }

  closeShareAlert() {
    const query = {
      plan_id: this.props.params.plan_id,
      course_id: this.props.params.course_id,
      solution_id: this.props.params.solution_id || 0,
    };
    const detail = this.props.course.detail;
    const info = detail.info;
    const data = {
      completed_in_plan: info.completed_in_plan,
    };

    const shareCourse = api({ method: 'PUT', data: data, url: `/training/plan/${query.plan_id}/solution/${query.solution_id}/course/${query.course_id}/complete` });
    shareCourse.then(() => {
      this.props.actions.fetchCourse(query);
      this.props.actions.fetchAssement(query);
      this.props.actions.fetchChapter(query);
      this.setState({ ...this.state, isShareAlertOpen: false });
    });
  }

  render() {
    const detail = this.props.course.detail;
    const info = detail.info;
    const assessment = this.props.course.assessment.info;
    const nodes = this.props.course.nodes;
    const params = this.props.params;
    const klass = classNames({
      isFetching: detail.isFetching,
      isFetched: !detail.isFetching,
      course: true,
    });

    const toDetail = `./detail${this.props.location.search}`;
    const toComments = `comments${this.props.location.search}`;

    this.setNavBar();

    return (
      <div id="course" className="course">
        <Alert
          shouldCloseOnOverlayClick={false}
          isOpen={this.state.isShareAlertOpen}
          onRequestClose={this.closeShareAlert}
          confirmButton={<span><FormattedMessage id="app.course.ok" /></span>}
        >
          <span>
            <FormattedMessage id="app.course.share" />
          </span>
        </Alert>
        <Alert
          shouldCloseOnOverlayClick={false}
          isOpen={this.state.isAlertOpen}
          onRequestClose={this.closeAlert}
          confirmButton={<span><FormattedMessage id="app.course.ok" /></span>}
        >
          <span>
            {this.errorMsg}
          </span>
        </Alert>

        <div className="banner">
          {<img src={info.thumbnail_url} />}
        </div>
        <ul className="tab">
          <li>
            <RelativeLink activeClassName="active" to={toDetail}><FormattedMessage id="app.course.descripton" /></RelativeLink>
          </li>
          <li>
            <RelativeLink activeClassName="active" to={toComments}><FormattedMessage id="app.course.reviews" /></RelativeLink>
          </li>
        </ul>
          {this.props.children}
        <div className="course-footer">
          {
            (() => {
              if (info.is_elective || params.plan_id == -1) {
                return null;
              }

              return (
                <a className="task w-150" onClick={() => { this.go2Task(params.plan_id); }}>
                  <p>
                    <FormattedMessage
                      {...messages.lbTask}
                    />
                  </p>
                </a>
              );
            })()
          }
          {(() => {
            const favor = !info.is_favor;
            const favoriteId = info.is_favor ? 'lbFavorited' : 'lbFavorite';
            const cls = info.is_favor ? 'favorite active' : 'favorite';
            const clsWidth1 = (info.is_elective || params.plan_id == -1) ? 'w-196' : 'w-150';
            return (
              <a className={`${cls} ${clsWidth1}`} onClick={() => { this.handleFavor(favor); }}>
                <p>
                  <FormattedMessage
                    {...messages[favoriteId]}
                  />
                </p>
              </a>);
          })()}

          {(() => {
            // pass_state: 课程通过状态，0：未开始，1：进行中，2：已完成 ,
            // read_state: 课程阅读状态，0：未开始，1：在读，2：未开始挑战 ...
            let notReadNote = null;
            let query = null;
            let i = 0;
            let firstNode = null;
            for (const o in nodes) {
              if (i === 0) {
                firstNode = nodes[o];
              }
              i++;
              if (assessment.pass_state === 2) {
                notReadNote = nodes[o];
                break;
              }

              if (nodes[o].done === 0) {
                notReadNote = nodes[o];
                break;
              }
            }
            if (notReadNote === null) {
              notReadNote = firstNode;
            }
            const nodeLink = `/preview/plan/${params.plan_id}/series/${params.solution_id || 0}/courses/${params.course_id}`; //getNodeLink(params, notReadNote);
            let btnId = 'btnStart'; // assessment.pass_state === 0 ? 'btnStart' : 'btnContinue';
            if (assessment.pass_state === 1) {
              btnId = 'btnContinue';
            }
            if (assessment.pass_state === 2) {
              btnId = 'btnStduyAgain';
            }
            if (notReadNote) {
              query = {
                node_id: notReadNote.id,
              };
            }
            query = { ...query, continue: true };
            const clsWidth2 = (info.is_elective || params.plan_id == -1) ? 'w-554' : 'w-450';
            return <Link className={`start ${clsWidth2}`} to={nodeLink} query={query}><FormattedMessage {...messages[btnId]} /></Link>;
          })()}
        </div>
      </div>
    );
  }
}

export default Course;
