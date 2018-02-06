import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from '../messages';

function Department({
  id, selected, total_num: total, name, onCheckout, onSelect, onUnselect,
}) {
  function onChange() {
    if (selected) onUnselect(id);
    else onSelect(id);
  }

  function checkout(e) {
    if (!selected) onCheckout(id);
    e.stopPropagation();
  }

  const disabledClass = selected ? 'list-operation-disabled' : '';

  return (
    <li className="space-between" onClick={onChange}>
      <span className="align-items">
        <input type="checkbox" readOnly checked={selected} onClick={onChange} />
        <span>{name}</span>
        <span className="dx-list-comment">(<FormattedMessage {...messages.users} values={{ num: total }} />)</span>
      </span>
      <span className={`list-operation ${disabledClass}`} onClick={checkout}>
        <FormattedMessage {...messages.view} />
      </span>
    </li>
  );
}

const { string, bool, number, func, oneOfType } = React.PropTypes;
Department.propTypes = {
  selected: bool,
  name: string,
  total_num: number,
  onCheckout: func,
  onSelect: func,
  onUnselect: func,
  id: oneOfType([string, number]),
};

export default Department;
