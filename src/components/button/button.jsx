import React, { PropTypes } from 'react';
import classNames from 'classnames';

const ButtonType = {
  primary: 'primary',
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

const ButtonSize = {
  large: 'lg',
  small: 'sm',
  block: 'block',
};

const propTypes = {
  type: PropTypes.string,
  shape: PropTypes.oneOf(['circle', 'circle-outline']),
  size: PropTypes.oneOf(['large', 'default', 'small', 'block']),
  loading: PropTypes.bool,
  prefix: PropTypes.string,
  className: PropTypes.string,
  htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
  onClick: PropTypes.func,
  children: PropTypes.any.isRequired,
  style: PropTypes.object,
};

function Button(props) {
  const { type, shape, size, loading, prefix, className, htmlType, ...others } = props;
  const handleClick = (e) => {
    if (typeof props.onClick === 'function') {
      props.onClick(e);
    }
  };
  const prefixCls = prefix || 'btn';
  const sizeCls = ButtonSize[size] || '';
  const classes = classNames({
    [prefixCls]: true,
    [`${prefixCls}-${type}`]: type,
    [`${prefixCls}-${shape}`]: shape,
    [`${prefixCls}-${sizeCls}`]: sizeCls,
    [`${prefixCls}-loading`]: loading,
    [className]: className,
  });
  return (
    <button
      {...others}
      type={htmlType || 'button'}
      className={classes}
      onClick={handleClick}
      style={props.style}
    >{props.children}</button>
  );
}

Button.propTypes = propTypes;
Button.defaultTypes = {
  style: {},
};

export default Button;
export { ButtonType, ButtonSize };
