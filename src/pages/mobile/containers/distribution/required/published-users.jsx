import React, { Component } from 'react';

import UserList from './list-user';

class PublishedUsers extends Component {
  static renderUserEl(user) {
    return (
      <li key={user.id}>
        <span>{user.name}</span>
        <span className="dx-list-comment">&nbsp;&nbsp;&nbsp;{user.dept_name}</span>
      </li>
    );
  }

  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { users } = this.props;
    if (!users) return null;

    return (
      <ul className="dx-list">
        <UserList users={users} userElGetter={PublishedUsers.renderUserEl} />
      </ul>
    );
  }
}
const { arrayOf, object } = React.PropTypes;
PublishedUsers.propTypes = { users: arrayOf(object) };

export default PublishedUsers;
