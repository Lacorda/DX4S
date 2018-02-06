import React, { Component } from 'react';
import classnames from 'classnames';

import './style.styl';

function generateOperationProps({ disabled, onClick }) {
  const className = classnames({ disabled });
  const props = { className, key: Math.random() };
  if (disabled) return props;
  return { onClick, ...props };
}

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { isOpen, pullRight, operations } = this.props;
    const sidebarStyles = classnames(
      'dx-sidebar',
      { 'dx-sidebar-right': pullRight },
      { 'dx-sidebar-open': isOpen }
    );
    return (
      <aside
        className={sidebarStyles}
        ref={(ref) => { this.sidebar = ref; }}
      >
        <div className="dx-sidebar-operation">
          {
            operations.map(operation => (
              <span {...generateOperationProps(operation)}>
                <img src={operation.icon} alt="" />
                {operation.content}
              </span>
            ))
          }
        </div>
        <div className="dx-sidebar-content">
          {this.props.children}
        </div>
      </aside>
    );
  }
}

const { bool, oneOfType, arrayOf, element, shape, func, string } = React.PropTypes;
Sidebar.propTypes = {
  operations: arrayOf(shape({
    onClick: func,
    icon: string,
    content: oneOfType([element, string]),
  })),
  children: oneOfType([arrayOf(element), element]),
  isOpen: bool,
  pullRight: bool,
};

Sidebar.defaultPropTypes = {
  operations: [],
};

export default Sidebar;
