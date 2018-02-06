import React, { Component } from 'react';

import UserList from './list-user';

class UserSearchingList extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillReceiveProps({ name }) {

  }

  render() {
    const { users } = this.state;
    const { userElGetter } = this.props;
    return (
      <ul className="dx-list">
        <UserList userElGetter={userElGetter} users={users} />
      </ul>
    );
  }
}

const { func, string } = React.PropTypes;
UserSearchingList.propTypes = {
  userElGetter: func,
  name: string,
};

export default UserSearchingList;
