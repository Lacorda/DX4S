import React from 'react';
import { connect } from 'react-redux';

import * as selectors from './selectors';
import PublishedUsers from './published-users';

function ConfirmUser({ users }) {
  return (
    <PublishedUsers users={users} />
  );
}

const { arrayOf, object } = React.PropTypes;
ConfirmUser.propTypes = {
  users: arrayOf(object),
};

const mapStateToProps = state => ({
  users: selectors.selectedUsersSelector(state),
});

export default connect(mapStateToProps)(ConfirmUser);
