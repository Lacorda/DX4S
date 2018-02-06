import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import classnames from 'classnames';

import { pluck } from 'utils/fn';
import { setTitle } from 'utils/dx/nav';
import * as actions from 'dxActions/distribution-required';

import PublishSuccessPopup from './publish-success';
import DateTimePicker from '../../../components/datetimepicker';
import * as selectors from './selectors';
import messages from '../messages';

import './selection-confirm.styl';

const TASK_TYPE = {
  micro: 'course',
  solution: 'solution',
};

// eslint-disable-next-line max-len
const EMOJI_REGEX = /[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2694\u2696\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD79\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED0\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3]|\uD83E[\uDD10-\uDD18\uDD80-\uDD84\uDDC0]|\uD83C\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uD83C\uDDFE\uD83C[\uDDEA\uDDF9]|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDFC\uD83C[\uDDEB\uDDF8]|\uD83C\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uD83C\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF8\uDDFE\uDDFF]|\uD83C\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uD83C\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uD83C\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uD83C\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uD83C\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uD83C\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uD83C\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uD83C\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uD83C\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uD83C\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uD83C\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uD83C\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uD83C\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uD83C\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uD83C\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uD83C\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|[#\*0-9]\u20E3/g;
function formatName(name) {
  return name
    .trim()
    .replace(/ /g, '')
    .replace(EMOJI_REGEX, '')
    .substring(0, 50);
}

class ConfirmSelection extends Component {
  constructor() {
    super();
    this.state = {
      showPicker: false,
      isPublishing: false,
      name: '',
      chosen: '',
      start: '',
      end: '',
      success: false,
      isLegal: false,
    };
    this.goBack = ::this.goBack;
    this.publish = ::this.publish;
    this.getIntl = ::this.getIntl;
    this.onDatetimePick = ::this.onDatetimePick;
    this.closePicker = ::this.closePicker;
    this.showPicker = ::this.showPicker;
    this.onNameInput = ::this.onNameInput;
    this.clearName = ::this.clearName;
  }

  componentDidMount() {
    setTitle({ title: this.getIntl('title') });
    if (!this.props.selectedUserCount || !this.props.selectedCourseCount) {
      this.context.router.push('/distribution/required/new/selection-course');
      return;
    }
    // default plan name
    const selectedCourses = this.props.selectedCourses;
    const courseName = selectedCourses[0].name;
    const name = formatName(courseName);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ name });
  }

  onDatetimePick(time) {
    const datetime = moment(time).local().format('YYYY-MM-DD HH:mm:ss');
    const { start, end, chosen } = this.state;
    if (chosen === 'start' && end && datetime > end) return;
    if (chosen === 'end' && start && datetime < start) return;
    this.setState({
      [this.state.chosen]: datetime,
      showPicker: false,
    });
  }

  onNameInput(e) {
    const name = formatName(e.target.value);
    this.setState({ name });
  }

  getIntl(id) {
    return this.context.intl.messages[`app.distribution.confirm.${id}`];
  }

  goBack() {
    this.context.router.goBack();
  }

  clearName() {
    this.setState({ name: '' });
  }

  showPicker(type) {
    this.setState({ showPicker: true, chosen: type });
  }

  closePicker() {
    this.setState({ showPicker: false });
  }

  async publish() {
    if (!this.state.isLegal || this.state.isPublishing) return;
    this.setState({ isPublishing: true });
    const { selectedUsers, selectedCourses } = this.props;
    const users = pluck('id', selectedUsers);
    const tasks = selectedCourses.map(course => (
      { task_id: course.id, task_type: TASK_TYPE[course.course_type] }
    ));
    const { start, end, name } = this.state;
    const data = { name, start, end, users, tasks };
    try {
      await this.props.actions.publishPlan(data);
      this.setState({
        name,
        success: true,
      });
    } catch (e) {
      // eslint-disable-next-line no-alert
      window.alert(e.response.data.message);
    } finally {
      this.props.actions.initRequiredDistribution();
      this.setState({ isPublishing: false });
    }
  }

  render() {
    const { selectedUserCount, selectedCourseCount } = this.props;
    const { start, end, name, success, isLegal } = this.state;
    if (!isLegal && start && end && name) this.setState({ isLegal: true });
    if (isLegal && (!start || !end || !name)) this.setState({ isLegal: false });
    const publishClass = classnames('step-confirm', { 'step-confirm-disabled': !isLegal });

    if (success) {
      return (
        <PublishSuccessPopup
          name={this.state.name}
          toDistribution={() => this.context.router.push('/distribution/required')}
        />
      );
    }
    return (
      <div className="selection-confirm">
        <ul className="dx-list dx-list-form">
          <li>
            <FormattedMessage {...messages.planName} />
            <span>
              <input
                type="text"
                placeholder={this.getIntl('requiredPlan')}
                onChange={this.onNameInput}
                value={name}
              />
            </span>
            <span className="dx-list-form-operation dx-list-form-operation-remove" onClick={this.clearName} />
          </li>
          <li className="drop-down" onClick={() => this.showPicker('start')}>
            <FormattedMessage {...messages.startTime} />
            <span>{start}</span>
          </li>
          <li className="drop-down" onClick={() => this.showPicker('end')}>
            <FormattedMessage {...messages.endTime} />
            <span>{end}</span>
          </li>
          <li className="list-indie">
            <FormattedMessage {...messages.selectedUserCount} />
            <FormattedMessage {...messages.users} values={{ num: selectedUserCount }} />
          </li>
          <li>
            <FormattedMessage {...messages.selectedCourseCount} />
            <FormattedMessage {...messages.courses} values={{ num: selectedCourseCount }} />
          </li>
        </ul>

        <div className="dx-footer">
          <div className={publishClass} onClick={this.publish}>
            <FormattedMessage {...messages.confirm} />
          </div>
        </div>

        <DateTimePicker
          theme="ios"
          isOpen={this.state.showPicker}
          onSelect={this.onDatetimePick}
          onCancel={this.closePicker}
          dateFormat="YYYY-M-D-h-m"
          hasCollapse
        />
      </div>
    );
  }
}

const { number, object, arrayOf, shape } = React.PropTypes;
ConfirmSelection.propTypes = {
  selectedUserCount: number,
  selectedCourseCount: number,
  selectedUsers: arrayOf(object),
  selectedCourses: arrayOf(object),
  actions: shape({}),
};

ConfirmSelection.contextTypes = {
  router: object,
  intl: object,
};

const mapStateToProps = state => ({
  selectedUserCount: selectors.selectedUsersCountSelector(state),
  selectedCourseCount: selectors.selectedCoursesLengthSelector(state),
  selectedUsers: selectors.selectedUsersSelector(state),
  selectedCourses: selectors.selectedCoursesSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmSelection);
