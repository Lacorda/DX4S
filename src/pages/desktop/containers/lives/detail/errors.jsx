import React from 'react';
import errorIcon from './img/errorIcon.png';

const errorStyle = {
  formError: {
    position: 'absolute',
    right: 0,
    top: '-20px',
    color: '#f00',
    fontSize: '12px',
  },
  formChild: {
    width: '15px',
    height: '15px',
    fontWeight: 'bold',
    display: 'inline-block',
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'normal',
    marginRight: '5px',
    lineHeight: '15px',
  },
  formChildImg: {
    width: '15px',
    top: '2px',
  },
};
class Errors extends React.Component {
  constructor() {
    super();
    this.state = {
      style: { display: 'none' },
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen) {
      this.setState({
        style: { display: 'block' },
      });
    }
  }

  render() {
    const formError = { ...errorStyle.formError, ...this.state.style };
    return (
      <span style={formError} >
        <i style={errorStyle.formChild}><img alt="" src={errorIcon} style={errorStyle.formChildImg} /></i>
        {this.props.children}
      </span>
    );
  }
}

Errors.propTypes = {
  children: React.PropTypes.string,
};

export default Errors;
