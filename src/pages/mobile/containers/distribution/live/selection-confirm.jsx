import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { pluck } from 'utils/fn';
import { setTitle } from 'utils/dx/nav';
import * as actions from 'dxActions/distribution-live';

import PublishSuccessPopup from '../publish-success';
import * as selectors from './selectors';
import messages from '../messages';

import './selection-confirm.styl';


class ConfirmSelection extends Component {
  constructor() {
    super();
    this.state = {
      showPicker: false,
      isPublishing: false,
      name: '',
      start: '',
      success: false,
    };
    this.goBack = ::this.goBack;
    this.publish = ::this.publish;
    this.getIntl = ::this.getIntl;
  }

  componentDidMount() {
    setTitle({ title: this.getIntl('title') });
    if (!this.props.selectedUserCount || !this.props.selectedCourseCount) {
//      this.context.router.push('/distribution/live/new/selection-live');
      return;
    }
    // default plan name
    const selectedLive = this.props.selectedLive;
    const name = selectedLive.name;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ name });
  }

  getIntl(id) {
    return this.context.intl.messages[`app.distribution.confirm.${id}`];
  }

  goBack() {
    this.context.router.goBack();
  }

  async publish() {
    if (this.state.isPublishing) return;
    this.setState({ isPublishing: true });
    const { selectedUsers, selectedLive } = this.props;
    const receivers = pluck('id', selectedUsers);

    const { name } = this.state;
    const data = { receivers, course_id: selectedLive.id };
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
      this.props.actions.initLiveDistribution();
      this.setState({ isPublishing: false });
    }
  }

  render() {
    const { selectedUserCount, selectedLive } = this.props;
    const { name, success } = this.state;
    const start = selectedLive && selectedLive.begin_time;
    const publishClass = classnames('step-confirm', { 'step-confirm-disabled': !start || !name });

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
            <span>{name}</span>
          </li>
          <li>
            <FormattedMessage {...messages.startTime} />
            <span>{start}</span>
          </li>
          <li className="list-indie">
            <FormattedMessage {...messages.selectedUserCount} />
            <FormattedMessage {...messages.users} values={{ num: selectedUserCount }} />
          </li>
        </ul>

        <div className="dx-footer">
          <div className={publishClass} onClick={this.publish}>
            <FormattedMessage {...messages.confirm} />
          </div>
        </div>
      </div>
    );
  }
}

const { number, object, arrayOf, shape, bool } = React.PropTypes;
ConfirmSelection.propTypes = {
  selectedUserCount: number,
  selectedCourseCount: bool,
  selectedUsers: arrayOf(object),
  selectedLive: object, // eslint-disable-line react/forbid-prop-types
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
  selectedLive: selectors.selectedLiveSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmSelection);
