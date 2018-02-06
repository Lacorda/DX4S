import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import UserList from './list-user';
import RefreshLoad from '../../../components/refreshload';
import messages from '../messages';

class SelectedUsers extends Component {
  constructor() {
    super();
    this.refresh = ::this.refresh;
    this.renderUserEl = ::this.renderUserEl;
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate() {
    this.refresh();
  }

  refresh() {
    if (!this.props.isOpen) return;
    const clientHeight = document.body.clientHeight;
    const realHeight = this.selectedScroll.clientHeight;
    this.selectedScrollWrap.style.height = `${clientHeight / 2 >= realHeight ? realHeight : clientHeight / 2}px`;
    this.iScrollWrapper.refresh(true);
  }

  renderUserEl(user) {
    const onRemove = this.props.onRemove;
    return (
      <li key={user.id} className="space-between">
        {user.name}
        <span className="list-operation list-operation-danger" onClick={() => onRemove(user.id)}>
          <FormattedMessage {...messages.remove} />
        </span>
      </li>
    );
  }

  render() {
    if (!this.props.isOpen) return null;

    const { onClose, items } = this.props;
    return (
      <div className="bottom-list-wrap">
        <div className="bottom-list">
          <div className="bottom-list-header">
            <a className="close" onClick={onClose}>&nbsp;</a>
          </div>
          <div
            className="bottom-list-body list-box"
            ref={(ref) => { this.selectedScrollWrap = ref; }}
          >
            <RefreshLoad
              relative
              needPullDown={false}
              needPullUp={false}
              ref={(ref) => { this.iScrollWrapper = ref; }}
            >
              <ul className="dx-list" ref={(ref) => { this.selectedScroll = ref; }}>
                {
                  <UserList userElGetter={this.renderUserEl} users={items} />
                }
              </ul>
            </RefreshLoad>
          </div>
        </div>
      </div>

    );
  }
}

const { bool, func, arrayOf, object } = PropTypes;

SelectedUsers.propTypes = {
  isOpen: bool,
  onClose: func,
  onRemove: func,
  items: arrayOf(object),
};

SelectedUsers.defaultProps = {
  isOpen: false,
  items: [],
};

export default SelectedUsers;
