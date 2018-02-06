import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const defaultProp = {
  prefixCls: 'input',
  type: 'text',
};

const InputSize = {
  large: 'lg',
  small: 'sm',
  block: 'block',
};

class Input extends Component {
  constructor(props, context) {
    super(props, context);
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.any,
    size: PropTypes.oneOf(['large', 'default', 'small', 'block']),
    onChange: PropTypes.func,
  }

  static defaultProps = { ...defaultProp }

  componentDidMount() {

  }

  render() {
    const { style, prefixCls, className, size, onChange, ...props } = this.props;
    const handleChange = (e) => {
      onChange && onChange(e);
    };
    const sizeCls = InputSize[size] || '';
    // dclass
    const dclassName = classNames({
      [`${prefixCls}-comp`]: true,
    });
    // inputClass
    const inputClassName = classNames({
      [className]: !!className,
      [`${sizeCls}`]: sizeCls,
    });

    return (
      <div className={ dclassName }>
        <input
          { ...props }
          className={ inputClassName }
          onChange={ handleChange }
          style={ style }
          ref="input"
        />
      </div>
    );
  }
}

export default Input;
