import React from 'react';

// eslint-disable-next-line no-unused-vars
function User({ id, selected, cover_url: avatar, name, onSelect, onUnselect }) {
  function onClick() {
    if (selected) onUnselect(id);
    else onSelect(id);
  }

  return (
    <li className="align-center" onClick={onClick}>
      <input type="checkbox" readOnly checked={selected} onClick={onClick} />
      {/* <img className="avatar" src={avatar} alt={name} /> */}
      <span>{name}</span>
    </li>
  );
}

const { string, bool, func, oneOfType, number } = React.PropTypes;
User.propTypes = {
  cover_url: string,
  selected: bool,
  name: string,
  onSelect: func,
  onUnselect: func,
  id: oneOfType([string, number]),
};

export default User;
