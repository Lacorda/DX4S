import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { setTitle } from 'utils/dx/nav';
import Crumbs from 'components/bread-crumbs';
import Toast from 'components/modal/toast';
import { findPropEq, findEq, last, diffPropEq } from 'utils/fn';
import * as actions from 'dxActions/distribution-live';

import messages from '../messages';

import RefreshLoad from '../../../components/refreshload';
import Search from '../../../components/search';
import UserList from './list-user';
import User from './user';
import Department from './department';
import SelectAll from './list-select-all';
import SelectedUser from './selected-users';

import * as selectors from './selectors';

import './selection-user.styl';

const MAX_USER_COUNT = 100; // 服务端限制一次最多只能100人

class UserSelection extends Component {
  constructor() {
    super();
    this.state = {
      hasMoreData: false,
      isFetchingDepartment: false,
      isPaginatingUsers: false,
      isFetchingDepartmentUsers: false,
      showLimitedUserCountToast: false,
      selectedAll: false,
      isOpen: false,
      index: 1,
    };
    this.renderUserEl = ::this.renderUserEl;
    this.selectDepartment = ::this.selectDepartment;
    this.checkoutDepartment = ::this.checkoutDepartment;
    this.selectDepartmentUsers = ::this.selectDepartmentUsers;
    this.unselectDepartmentUsers = ::this.unselectDepartmentUsers;
    this.fetchDepartmentAndUser = ::this.fetchDepartmentAndUser;
    this.closeToast = ::this.closeToast;
    this.paginateUser = ::this.paginateUser;
    this.goToNext = ::this.goToNext;
    this.unselectUser = ::this.unselectUser;
  }

  async componentDidMount() {
    setTitle({ title: this.getIntl('title') });
    if (!this.props.selectedCoursesCount) {
//      this.context.router.push('/distribution/live/new/selection-live');
      return;
    }
    await this.fetchDepartmentAndUser();
  }

  componentDidUpdate({ users, departments, childDepartments }) {
    const newListLength = users.length
      + departments.length
      + childDepartments.length;
    const props = this.props;
    const oldListLength = props.users.length
      + props.departments.length
      + props.childDepartments.length;
    if (newListLength !== oldListLength && !this.state.isPaginatingUsers) this.listBox.refresh();
  }

  getIntl(id) {
    return this.context.intl.messages[`app.distribution.user.${id}`];
  }

  async controlPullUp(users) {
    const length = users.length;
    const hasMoreData = length >= 100;
    await this.awaitSetState({ hasMoreData });
  }

  async fetchDepartmentAndUser(cb) {
    this.awaitBlockFetch('isPaginatingUsers', async() => { // eslint-disable-line arrow-parens
      const department = last(this.props.departments);
      const id = department && department.id;
      const { users } = await this.props.actions.selectDepartment(id);
      await this.controlPullUp(users);
      if (cb) this.setState({ index: 1 }, cb);
      else this.listBox.refresh();
    });
  }

  paginateUser(cb) {
    this.awaitBlockFetch('isPaginatingUsers', async() => { // eslint-disable-line arrow-parens
      const department = last(this.props.departments);
      const deptId = department && department.id;
      const nextPageNum = this.state.index + 1;
      const users = await this.props.actions.paginateUser(
        { index: nextPageNum, dept_id: deptId }
      );
      await this.controlPullUp(users);
      if (users.length) this.setState({ index: nextPageNum }, cb);
      else cb();
    });
  }

  showToast() {
    this.setState({ showLimitedUserCountToast: true });
  }

  closeToast() {
    this.setState({ showLimitedUserCountToast: false });
  }

  async awaitSetState(state) {
    await new Promise(resolve => this.setState(state, resolve));
  }

  async checkoutDepartment(deptId, cb) {
    await this.awaitBlockFetch(
      'isFetchingDepartment',
      async() => { // eslint-disable-line arrow-parens
        const { users } = await this.props.actions.selectChildDepartment(deptId);
        await this.controlPullUp(users);
      }
    );
    if (cb) cb();
  }

  async selectDepartment(deptIndex) {
    const departments = this.props.departments;
    const { users } = await this.props.actions.selectDepartment(departments[deptIndex].id);
    await this.awaitSetState({ index: 1 });
    await this.controlPullUp(users);
    this.listBox.refresh();
  }

  async selectDepartmentUsers(dept, cb, recursion) {
    const { selectedDepartmentId, selectedUsersCount, selectedUsers } = this.props;
    const id = (dept && dept.id) || selectedDepartmentId;
    const users = await this.awaitBlockFetch(
      'isFetchingDepartmentUsers',
      () => this.props.actions.selectUsersByDepartment(id, recursion)
    );
    await this.controlPullUp(users);
    const newUsersCount = diffPropEq('id', users, selectedUsers).length;
    if (newUsersCount + selectedUsersCount >= MAX_USER_COUNT) {
      this.showToast();
    } else if (cb) {
      cb();
    }
  }

  async unselectDepartmentUsers(deptId, cb, recursion) {
    deptId = deptId || this.props.selectedDepartmentId; // eslint-disable-line no-param-reassign
    const users = await this.awaitBlockFetch(
      'isFetchingDepartmentUsers',
      () => this.props.actions.unselectUsersByDepartment(deptId, recursion)
    );
    await this.controlPullUp(users);
    if (cb) cb();
  }

  async awaitBlockFetch(stateName, fetchChunk) {
    if (this.state[stateName]) return null;
    await this.awaitSetState({ [stateName]: true });
    const result = await fetchChunk();
    await this.awaitSetState({ [stateName]: false });
    return result;
  }

  unselectUser(id) {
    this.props.actions.unselectUser(id);
    this.awaitSetState({ selectedAll: false });
  }

  goToNext() {
    const {
      maxAvailableUserCount,
      selectedUsersCount,
      selectedLive,
    } = this.props;
    if (
      !selectedLive
      || selectedUsersCount > maxAvailableUserCount
      || selectedUsersCount === 0
    ) return;
    this.context.router.push('/distribution/live/new/selection-confirm');
  }

  renderDepartmentList() {
    const { childDepartments, selectedDepartments } = this.props;
    return (
      childDepartments.map(dept =>
        <Department
          key={dept.id}
          {...dept}
          selected={!!findEq(dept.id, selectedDepartments)}
          onCheckout={id =>
            this.checkoutDepartment(id, () => this.setState({ selectedAll: false }))
          }
          onSelect={() => this.selectDepartmentUsers(dept)}
          onUnselect={this.unselectDepartmentUsers}
        />
      )
    );
  }

  renderUserEl(user) {
    const { selectUser } = this.props.actions;
    const { selectedUsers, selectedUsersCount } = this.props;
    return (
      <User
        key={user.id}
        {...user}
        selected={!!findPropEq('id', user.id, selectedUsers)}
        onSelect={(id) => {
          if (selectedUsersCount >= MAX_USER_COUNT) this.showToast();
          else selectUser(id);
        }}
        onUnselect={this.unselectUser}
      />
    );
  }

  render() {
    const {
      departmentsName,
      totalUsers,
      users,
      selectedUsers,
      maxAvailableUserCount,
      selectedUsersCount,
    } = this.props;

    const overAvailable = selectedUsersCount > maxAvailableUserCount;
    const nextStepClass = classnames(
      'dx-footer-operation',
      { 'dx-footer-operation-disabled': !selectedUsersCount || overAvailable },
    );
    const headerClass = classnames(
      'distribution-header',
      { 'distribution-header-error': overAvailable }
    );
    return (
      <div className="distribution-required-user-selection">
        <div className={headerClass}>
          <FormattedMessage
            {...messages.availableUserCount}
            values={{ num: maxAvailableUserCount }}
          />
        </div>
        <Search
          placeholder={this.getIntl('search')}
          onFocus={() => this.context.router.push('/distribution/live/new/selection-user/search')}
        />
        <Crumbs
          items={departmentsName}
          onSelect={this.selectDepartment}
        />

        <RefreshLoad
          absolute
          className="user-selection-list"
          needPullUp={this.state.hasMoreData}
          needPullDown
          pullDownCallBack={this.fetchDepartmentAndUser}
          pullUpCallBack={this.paginateUser}
          ref={(ref) => { this.listBox = ref; }}
        >
          <ul className="dx-list">
            { this.renderDepartmentList() }
            <SelectAll
              totalUsers={totalUsers}
              selected={this.state.selectedAll}
              onSelect={() =>
                this.selectDepartmentUsers(null, () => this.setState({ selectedAll: true }), false)
              }
              onUnselect={() =>
                this.unselectDepartmentUsers(
                  null,
                  () => this.setState({ selectedAll: false }),
                  false)
              }
            />
            <UserList users={users} userElGetter={this.renderUserEl} />
          </ul>
        </RefreshLoad>

        <div className="dx-footer">
          <div
            className={`dx-footer-desc${!this.state.isOpen ? ' active' : ''}`}
            onClick={() => this.setState({ isOpen: !this.state.isOpen })}
          >
            <span className="dx-icon-triangle">
              <FormattedMessage {...messages.selectedUser}
                                values={{ num: `${selectedUsers.length}` }} />
            </span>
          </div>
          <div className={nextStepClass} onClick={this.goToNext}>
            <FormattedMessage {...messages.nextStep} />
          </div>
        </div>
        <SelectedUser
          items={selectedUsers}
          isOpen={this.state.isOpen}
          onRemove={this.props.actions.unselectUser}
          onClose={() => this.setState({ isOpen: false })}
        />

        <Toast
          isOpen={this.state.showLimitedUserCountToast}
          shouldCloseOnOverlayClick={false}
          onRequestClose={this.closeToast}
        >
          <FormattedMessage {...messages.limitedUserCount} />
        </Toast>
      </div>
    );
  }
}

const { shape, arrayOf, string, object, number, oneOfType, bool } = React.PropTypes;
UserSelection.propTypes = {
  actions: shape(),
  departments: arrayOf(object),
  departmentsName: arrayOf(string),
  childDepartments: arrayOf(object),
  totalUsers: number,
  selectedUsersCount: number,
  users: arrayOf(object),
  selectedUsers: arrayOf(object),
  selectedDepartments: arrayOf(oneOfType([string, number])),
  selectedDepartmentId: oneOfType([string, number]),
  selectedCoursesCount: bool,
  maxAvailableUserCount: number,
  selectedLive: shape({}),
};
UserSelection.contextTypes = {
  intl: object,
  router: object,
};

const mapStateToProps = state => ({
  users: selectors.usersSelector(state),
  selectedUsers: selectors.selectedUsersSelector(state),
  totalUsers: selectors.totalUsersSelector(state),
  selectedUsersCount: selectors.selectedUsersCountSelector(state),
  departments: selectors.departmentsSelector(state),
  selectedDepartments: selectors.selectedDepartmentsSelector(state),
  selectedDepartmentId: selectors.selectedDepartmentIdSelector(state),
  departmentsName: selectors.departmentsNameSelector(state),
  childDepartments: selectors.childDepartmentsSelector(state),
  selectedCoursesCount: selectors.selectedCoursesLengthSelector(state),
  maxAvailableUserCount: selectors.maxAvailableUserCountSelector(state),
  selectedLive: selectors.selectedLiveSelector(state),
});

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(UserSelection);
