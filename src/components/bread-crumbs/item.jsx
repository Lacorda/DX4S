import React from 'react';
import classnames from 'classnames';

function BreadCrumbsItem(props) {
  const { onClick, label, active } = props;
  const classNames = classnames({ active });
  return (
    <li className={classNames} onClick={onClick}>{label}</li>
  );
}

BreadCrumbsItem.propTypes = {
  onClick: React.PropTypes.func,
  label: React.PropTypes.string,
  active: React.PropTypes.bool,
};

export default BreadCrumbsItem;
