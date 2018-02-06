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
    top: '2px'
  },
};
class Errors extends React.Component {
  constructor() {
    super();
    this.closeCallback = ::this.closeCallback;
    this.state = { isOpen: false, timeout: null, style: { display: 'none' } };
  }
  componentWillReceiveProps(props) {
    clearTimeout(this.state.timeout);
    if (props.isOpen) {
      this.setState({
        timeout: setTimeout(this.closeCallback, props.timeout),
        style: { display: 'block' },
      });
    }
    this.setState({ isOpen: props.isOpen });
  }
  closeCallback() {
    clearTimeout(this.state.timeout);
    if (this.props.onRequestClose) this.props.onRequestClose();
    this.setState({
      isOpen: false,
      style: { display: 'none' },
    });
  }
  render() {
    const formError = { ...errorStyle.formError, ...this.state.style };
    return (
      <span style={formError} onClick={this.closeCallback} >
        <i style={errorStyle.formChild}><img src={errorIcon} style={errorStyle.formChildImg} /></i>{this.props.children}
      </span>
    );
  }
}

Errors.propTypes = {
  ...Errors.propTypes,
  isOpen: React.PropTypes.bool,
  timeout: React.PropTypes.number,
  style: React.PropTypes.object,
  children: React.PropTypes.string,
};

Errors.defaultProps = {
  timeout: 2000,
  style: { display: 'none' },
};

export default Errors;
