import React from 'react';
import Modal from 'react-modal';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import Button from '../button';
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
    let options = { style, ...props, ...state };
    if (props.manual) options = { style, ...state, ...props };
    return (
      <Modal {...options}>
        <div style={{ textAlign: 'center' }}>{this.props.children}</div>
        <Button
          onClick={this.onCancel}
          style={{ width: '45%', marginRight: '8%' }}
        >
          {cancelButton}
        </Button>
        <Button
          type="primary"
          onClick={this.onConfirm}
          style={{ width: '45%' }}
        >
          {confirmButton}
        </Button>
      </Modal>
    );
  }
}

Confirm.propTypes = {
  ...Modal.propTypes,
  manual: React.PropTypes.bool,
  onConfirm: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  children: React.PropTypes.element,
  cancelButton: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
  confirmButton: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
};

Confirm.defaultProps = {
  onConfirm: noop,
  onCancel: noop,
  confirmButton: <FormattedMessage {...messages.ok} />,
  cancelButton: <FormattedMessage {...messages.cancel} />,
};

export default Confirm;
