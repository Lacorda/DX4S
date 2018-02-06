import React from 'react';

class Confirm extends React.Component {
  constructor() {
    super();
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.state = { isOpen: false };
  }
  componentWillReceiveProps(props) {
    this.setState({ ...this.state, isOpen: props.isOpen });
  }
  onCancel() {
    if (this.props.cancel) this.props.cancel();
    this.setState({ isOpen: false });
  }
  onConfirm() {
    if (this.props.confirm) this.props.confirm();
    this.setState({ isOpen: false });
  }
  render() {
    const { cancelButton, confirmButton } = this.props;
    const display = this.state.isOpen ? { display: 'block' } : { display: 'none' };
    return (
      <div id="confirm" style={display}>
        <div className="confirmBox">
          <div className="confirmContent">{this.props.children}</div>
          {this.props.buttonNum === 2 &&
            <div className="confirmBtn">
              <div className="sumbit" onClick={this.onConfirm}>{confirmButton}</div>
              <div className="cancel" onClick={this.onCancel} style={{ marginLeft: '20px' }}>{cancelButton}</div>
            </div>
          }
          {this.props.buttonNum === 1 &&
            <div className="confirmBtn">
              <div className="midBtn sumbit" onClick={this.onConfirm}>{confirmButton}</div>
            </div>
          }
        </div>
      </div>
    );
  }

}

Confirm.propTypes = {
  confirm: React.PropTypes.func,
  cancel: React.PropTypes.func,
  children: React.PropTypes.element,
  buttonNum: React.PropTypes.number,
  cancelButton: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
  confirmButton: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
};

Confirm.defaultProps = {
  confirmButton: 'OK',
  cancelButton: 'cancel',
  buttonNum: 2,
};

export default Confirm;
