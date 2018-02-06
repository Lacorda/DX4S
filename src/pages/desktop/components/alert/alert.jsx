import React, { Component } from 'react';
import alertSuccess from './img/alertSuccess.png';
import alertError from './img/alertError.png';
import alertPrompt from './img/alertPrompt.png';
import alertWarning from './img/alertWarning.png';

class Alert extends Component {
  constructor() {
    super();
    this.closeCallback = this.closeCallback.bind(this);
    this.state = { isShow: false, timeout: null, style: { display: 'none' }, imgIcon: alertSuccess };
  }
  componentWillReceiveProps(props) {
    clearTimeout(this.state.timeout);
    if (props.isShow) {
      this.setState({
        timeout: setTimeout(this.closeCallback, props.timeout),
        style: { display: 'block' },
      });
    }
    this.setState({ isShow: props.isShow });
  }
  closeCallback() {
    clearTimeout(this.state.timeout);
    if (this.props.onRequestClose) this.props.onRequestClose();
    this.setState({
      isShow: false,
      style: { display: 'none' },
    });
  }
  render() {
    let imgType = '';
    switch (this.props.imgType) {
      case 'success':
        imgType = alertSuccess;
        break;
      case 'error':
        imgType = alertError;
        break;
      case 'prompt':
        imgType = alertPrompt;
        break;
      case 'warning':
        imgType = alertWarning;
        break;
      default:
        imgType = alertSuccess;
        break;
    }
    return (
      <div className="alert" style={this.state.style} onClick={this.closeCallback}>
        <div className="alertBox">
          <div className="alertImg"><img src={imgType} /></div>
          <div className="alertFont">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

Alert.propTypes = {
  isShow: React.PropTypes.bool,
  timeout: React.PropTypes.number,
  children: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
  onRequestClose: React.PropTypes.func,
  imgType: React.PropTypes.string,
};

Alert.defaultProps = {
  timeout: 2000,
  style: { display: 'none' },
  imgType: 'success',
};

export default Alert;
