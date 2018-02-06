import React from 'react';
import Modal from 'react-modal';

import Button from '../button';
import './styles.styl';
import { noop, style } from './helper';

class Alert extends React.Component {
  constructor() {
    super();
    this.closeModal = ::this.closeModal;
    this.state = { isOpen: false };
  }

  componentWillReceiveProps(props) {
    this.setState({ ...this.state, isOpen: props.isOpen });
  }

  closeModal() {
    if (this.props.onRequestClose) this.props.onRequestClose();
    this.setState({ ...this.state, isOpen: false });
  }

  render() {
    const { props, state } = this;
    const options = { style, ...props, ...state };
    return (
      <Modal {...options}>
        <p style={{ textAlign: 'center' }}>{props.children}</p>
        <Button type="primary" size="block" onClick={this.closeModal}>
          {props.confirmButton}
        </Button>
      </Modal>
    );
  }
}

Alert.propTypes = {
  ...Modal.propTypes,
  confirmButton: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
  children: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
};

Alert.defaultProps = {
  onConfirm: noop,
};

export default Alert;
