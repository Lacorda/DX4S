import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class DxDropDown extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const baseWidth = this.dropDown.getBoundingClientRect().width;
    this.dropDownMenu.style.marginLeft = `${(baseWidth - 142) / 2}px`;
  }

  renderIcon() {
    if (!this.props.hasIcon) return null;
    return <span className="icon">&nbsp;</span>;
  }

  renderTitle() {
    const { dropDownTitle } = this.props;
    if (!dropDownTitle) return null;
    return <div className="drop-down-menu-title">{dropDownTitle}</div>;
  }

  renderItems() {
    const { items } = this.props;
    if (!items || !items.length) return null;
    return (
      <div className="drop-down-menu-list">
        {
          items.map((item, index) => (
            <Link
              key={index}
              to={item.link || null}
              href={item.href || null}
              onClick={item.onClick}
              target={item.target || null}
            >
              {item.text}
            </Link>
          ))
        }
      </div>
    );
  }

  renderContent() {
    const { type, content, imgSrc, onClick } = this.props;
    if (type !== 'content') return false;
    return (
      <div>
        {content ? <div className="content" onClick={onClick || null}>{content}</div> : null}
        {imgSrc ? <img src={imgSrc} alt="" /> : null}
      </div>
    );
  }

  render() {
    const { className, text, type } = this.props;
    return (
      <div className={`dx-drop-down ${className}`}>
        <span className="drop-down-title" ref={(ref) => { this.dropDown = ref; }}>
          <span className="text">{text || '　'}</span>
          {this.renderIcon()}
        </span>
        <div className={`drop-down-menu ${type}`} ref={(ref) => { this.dropDownMenu = ref; }}>
          <span className="triangle">&nbsp;</span>
          <div className="drop-down-menu-content">
            {this.renderTitle()}
            {this.renderItems()}
            {this.renderContent()}
          </div>
        </div>
      </div>
    );
  }
}

DxDropDown.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  text: PropTypes.string,
  hasIcon: PropTypes.bool,
  dropDownTitle: PropTypes.element,
  items: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string,
    href: PropTypes.string,
    target: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
  })),
  content: PropTypes.string,
  imgSrc: PropTypes.string,
  onClick: PropTypes.func,
};

DxDropDown.defaultProps = {
  type: 'list',
}

export default DxDropDown;
