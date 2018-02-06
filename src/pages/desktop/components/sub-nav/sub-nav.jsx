import React, { Component, PropTypes } from 'react';

class subNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, nav } = this.props;
    return (
      <div className="dx-sub-nav">
        <div className="dx-container">
          <div className="dx-sub-nav-title"><span className="icon-address">&nbsp;</span>{title}</div>
          {
            nav ? (
              <div className="dx-sub-nav-list">
                {
                  nav.map((n, i) => (
                    <span key={i} className={n.active ? 'active' : ''} onClick={n.onClick}>{n.text}</span>
                  ))
                }
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
}

subNav.propTypes = {
  title: PropTypes.string,
  nav: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    onClick: PropTypes.func,
    active: PropTypes.string,
  })),
};

export default subNav;
