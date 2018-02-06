import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../messages';

function SelectAll({ totalUsers, onSelect, onUnselect, selected }) {
  function onChange() {
    if (selected) onUnselect();
    else onSelect();
  }

  return (
    <li className="space-between list-indie" onClick={onChange}>
      <span className="align-items">
        <input type="checkbox" readOnly onClick={onChange} checked={selected} />
        <FormattedMessage {...messages.selectAll} />
        <span className="dx-list-comment">
          (<FormattedMessage {...messages.users} values={{ num: totalUsers }} />)
        </span>
      </span>
    </li>
  );
}

SelectAll.propTypes = {
  totalUsers: React.PropTypes.number,
  selected: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  onUnselect: React.PropTypes.func,
};

export default SelectAll;
