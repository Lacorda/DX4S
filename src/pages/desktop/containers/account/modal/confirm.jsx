import React from 'react';
import Modal from 'react-modal';

import { noop, style } from './helper';

class Confirm extends React.Component {
  constructor() {
    super();
    this.onCancel = ::this.onCancel;
    this.onConfirm = ::this.onConfirm;
    this.state = { isOpen: false };
  }

  componentWillReceiveProps(props) {
    this.setState({ ...this.state, isOpen: props.isOpen });
  }

  onCancel() {
    this.props.onCancel();
    if (this.props.onRequestClose) this.props.onRequestClose();
    this.setState({ ...this.state, isOpen: false });
  }

  onConfirm() {
    this.props.onConfirm();
    if (this.props.onRequestClose) this.props.onRequestClose();
    this.setState({ ...this.state, isOpen: false });
  }

  render() {
    const { state, props } = this;
    const { cancelButton, confirmButton } = this.props;
    const options = { style, ...props, ...state };
    return (
      <Modal {...options}>
        <p style={{ textAlign: 'center' }}>{this.props.children}</p>
        <button
          onClick={this.onConfirm}
          style={{ width: '45%', marginRight: '8%', border: 'none', background: '#009aec', color: '#fff', height: '40px', lineHeight: '40px' }}
        >
          {confirmButton}
        </button>
        <button
          onClick={this.onCancel}
          style={{ width: '45%', border: 'none', background: '#b4b4b4', color: '#fff', height: '40px', lineHeight: '40px' }}
        >
          {cancelButton}
        </button>
      </Modal>
    );
  }
}

Confirm.propTypes = {
  ...Modal.propTypes,
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  children: React.PropTypes.element,
  cancelButton: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
  confirmButton: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
};

Confirm.defaultProps = {
  onConfirm: noop,
  onCancel: noop,
  confirmButton: 'OK',
  cancelButton: 'cancel',
};

export default Confirm;
