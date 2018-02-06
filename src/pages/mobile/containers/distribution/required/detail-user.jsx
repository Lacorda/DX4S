import React from 'react';
import { setTitle } from 'utils/dx/nav';

import composeComponent from './compose-component';
import PublishedUsers from './published-users';

class UserDetail extends React.Component {
  componentDidMount() {
    setTitle({ title: this.context.intl.messages['app.distribution.detail.user.title'] });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { plan_id: planId } = this.props.params;
    const ComposedPublishedUser = composeComponent({
      url: `/training/training-plan/get-plan-user-list?planId=${planId}&index=1&size=100`,
      handler: ({ data }) => ({ users: data.users }),
    });
    return <ComposedPublishedUser component={PublishedUsers} />;
  }
}
const { object } = React.PropTypes;
UserDetail.propTypes = {
  params: object, // eslint-disable-line react/forbid-prop-types
};
UserDetail.contextTypes = {
  intl: object,
};

export default UserDetail;
