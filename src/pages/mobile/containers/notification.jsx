import React from 'react';
import { connect } from 'react-redux';
import Toast from '../../../components/modal/toast';

class Notification extends React.Component {

  constructor() {
    super();
    this.state = { isOpen: false };
  }

  componentWillReceiveProps(props) {
    this.setState({ isOpen: true });
    setTimeout(
      () => { this.setState({ isOpen: false }); },
      props.notification.timeout || 5000
    );
  }

  render() {
    return (
      <Toast isOpen={this.state.isOpen}>
        {this.props.notification.message}
      </Toast>
    );
  }
}

Notification.propTypes = {
  notification: React.PropTypes.shape({
    timeout: React.PropTypes.number, // eslint-disable-line
    message: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
  }),
};

const mapStateToProps = state => ({
  notification: state.notification,
});

export default connect(mapStateToProps)(Notification);
