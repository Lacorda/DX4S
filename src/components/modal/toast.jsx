import React from 'react';
import Modal from 'react-modal';

import './styles.styl';
import { style, px2rem } from './helper';

const toastStyle = {
  overlay: {
    ...style.overlay,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    pointerEvents: 'fill',
  },
  content: {
    ...style.content,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    borderRadius: px2rem(20),
    border: 'none',
    pointerEvents: 'initial',
  },
};

class Toast extends React.Component {
  constructor() {
    super();
    this.closeModal = ::this.closeModal;
    this.state = { isOpen: false, timeout: null };
  }

  componentWillReceiveProps(props) {
    clearTimeout(this.state.timeout);
    if (props.isOpen) {
      this.setState({
        timeout: setTimeout(this.closeModal, props.timeout),
      });
    }
    this.setState({ isOpen: props.isOpen });
  }

  closeModal() {
    clearTimeout(this.state.timeout);
    if (this.props.onRequestClose) this.props.onRequestClose();
    this.setState({ isOpen: false });
  }

  render() {
    const { props, state } = this;
    const styles = {
      overlay: { ...toastStyle.overlay, ...props.style.overlay },
      content: { ...toastStyle.content, ...props.style.content },
    };
    const options = { ...props, style: styles, ...state };
    return (
      <Modal {...options}>
        <div
          style={{ textAlign: 'center' }}
          onClick={this.closeModal}
        >
          {props.children}
        </div>
      </Modal>
    );
  }
}

Toast.propTypes = {
  ...Modal.propTypes,
  isOpen: React.PropTypes.bool,
  timeout: React.PropTypes.number,
  style: React.PropTypes.object, //eslint-disable-line
  children: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element),
  ]),
};

Toast.defaultProps = {
  timeout: 2000,
  style: {},
};
export default Toast;
