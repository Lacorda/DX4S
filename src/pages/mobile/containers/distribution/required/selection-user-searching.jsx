import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import Toast from 'components/modal/toast';
import { findPropEq } from 'utils/fn';
import * as actions from 'dxActions/distribution-required';

import * as selectors from './selectors';
import messages from '../messages';

import UserList from './list-user';
import SelectedUser from './selected-users';
import User from './user';
import Search from '../../../components/search';
import RefreashLoad from '../../../components/refreshload';
import EmptyContent from './empty-content';

import './selection-user.styl';

const MAX_USER_COUNT = 100;

class UserSearchingList extends Component {
  constructor() {
    super();
    this.state = {
      hasMoreData: false,
      index: 1,
      name: '',
      isOpen: false,
      showLimitedUserCountToast: false,
      initialized: false,
    };

    this.fetchUsers = ::this.fetchUsers;
    this.paginateUser = ::this.paginateUser;
    this.renderUserEl = ::this.renderUserEl;
    this.goToNext = ::this.goToNext;
  }

  async componentDidMount() {
    if (!this.props.selectedCourseCount) {
      this.context.router.push('/distribution/required/new/selection-course');
      return;
    }
    if (this.props.users.length) {
      this.setState({ initialized: true });// eslint-disable-line react/no-did-mount-set-state
    }
    await this.fetchUsers();
    // eslint-disable-next-line react/no-did-mount-set-state
    if (!this.state.initialized) this.setState({ initialized: true });
  }

  getIntl(id) {
    return this.context.intl.messages[`app.distribution.user.${id}`];
  }

  async controlPullUp(users) {
    const hasMoreData = users.length >= 100;
    return await new Promise(resolve => this.setState({ hasMoreData }, resolve));
  }

  async fetchUsers(name = '', cb) {
    const params = { name, index: 1, recursion: true };
    const users = await this.props.actions.fetchUsers(params);
    await this.controlPullUp(users);
    this.setState(params, () => {
      if (cb) cb();
      else if (this.listBox) this.listBox.refresh();
    });
  }

  async paginateUser(cb) {
    const { name, index } = this.state;
    const params = { name, index: index + 1 };
    const users = await this.props.actions.paginateUser(params);
    await this.controlPullUp(users);
    if (users.length) this.setState(params, cb);
    else cb();
  }

  goToNext() {
    const { maxAvailableUserCount, selectedUsersCount } = this.props;
    if (
      selectedUsersCount > maxAvailableUserCount
      || selectedUsersCount === 0
    ) return;
    this.context.router.push('/distribution/required/new/selection-confirm');
  }

  renderUserEl(user) {
    const { selectUser, unselectUser } = this.props.actions;
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
        onUnselect={unselectUser}
      />
    );
  }


  render() {
    const { selectedUsersCount, selectedUsers, users, maxAvailableUserCount } = this.props;
    const overAvailable = selectedUsersCount > maxAvailableUserCount;
    const nextStepClass = classnames(
      'dx-footer-operation',
      { 'dx-footer-operation-disabled': !this.props.selectedUsersCount || overAvailable },
    );
    let searchResult;
    if (users.length) {
      searchResult = (
        <RefreashLoad
          absolute
          className="user-searching-list"
          needPullUp={this.state.hasMoreData}
          needPullDown
          pullDownCallBack={cb => this.fetchUsers(null, cb)}
          pullUpCallBack={this.paginateUser}
          ref={(ref) => { this.listBox = ref; }}
        >
          <ul className="dx-list">
            <UserList userElGetter={this.renderUserEl} users={users} />
          </ul>
        </RefreashLoad>
      );
    } else {
      searchResult = <EmptyContent whole={!this.state.initialized} />;
    }
    return (
      <div className="distribution-required-user-selection">
        <Search
          placeholder={this.getIntl('search')}
          onSearch={this.fetchUsers}
          ref={(ref) => { this.searchRef = ref; }}
        />

        {searchResult}

        <div className="dx-footer">
          <div
            className={`dx-footer-desc${!this.state.isOpen ? ' active' : ''}`}
            onClick={() => this.setState({ isOpen: !this.state.isOpen })}
          >
            <span className="dx-icon-triangle">
              <FormattedMessage {...messages.selectedUser}
                                values={{ num: `${selectedUsersCount}` }} />
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
          onRequestClose={() => this.setState({ showLimitedUserCountToast: false })}
        >
          <FormattedMessage {...messages.limitedUserCount} />
        </Toast>
      </div>
    );
  }
}

const { arrayOf, object, shape, number } = React.PropTypes;
UserSearchingList.propTypes = {
  users: arrayOf(object),
  actions: shape(),
  selectedUsers: arrayOf(object),
  selectedUsersCount: number,
  selectedCourseCount: number,
  maxAvailableUserCount: number,
};

UserSearchingList.contextTypes = {
  intl: object,
  router: object,
};

const mapStateToProps = state => ({
  users: selectors.usersSelector(state),
  selectedUsers: selectors.selectedUsersSelector(state),
  totalUsers: selectors.totalUsersSelector(state),
  selectedUsersCount: selectors.selectedUsersCountSelector(state),
  selectedCourseCount: selectors.selectedCoursesLengthSelector(state),
  maxAvailableUserCount: selectors.maxAvailableUserCountSelector(state),
});

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) });

export default connect(mapStateToProps, mapDispatchToProps)(UserSearchingList);
