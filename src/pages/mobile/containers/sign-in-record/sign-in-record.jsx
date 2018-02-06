import React from 'react';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { setTitle } from 'utils/dx/nav';
import Calendar from '../../components/calendar';
import Button from '../../../../components/button';
import { signIn as actions } from '../../actions';
import Toast from '../../../../components/modal/toast';

const moment = require('moment');

const contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

class SignInRecord extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignIn = ::this.handleSignIn;
    this.renderButton = ::this.renderButton;
    this.showSuccessToast = ::this.showSuccessToast;
    this.setNavBar = ::this.setNavBar;
    this.state = {
      selected: moment().startOf('day'),
      month: moment().format('YYYY-MM'),
      isOpen: false,
    };
  }

  componentDidMount() {
    this.props.fetchSignList({ month: this.state.month });
    this.props.fetchIsSigned();
    if (this.props.from === 'home') {
      setTimeout(() => {
        this.props.signIn();
      }, 500);
    }
  }

  componentWillReceiveProps({ signSuccess }) {
    if (signSuccess) {
      this.props.resetState();
      this.showSuccessToast();
    }
  }

  componentWillUnmount() {
    this.props.removeFromHome();
  }

  setNavBar() {
    setTitle({
      title: this.context.intl.messages['app.signInRecord.title'],
    });
  }

  showSuccessToast() {
    this.setState({ isOpen: true });
    setTimeout(() => this.setState({ isOpen: false }), 2000);
  }

  handleClick = (day) => {
    this.setState({ selected: day.date });
  }

  handleSignIn() {
    this.props.signIn().then(this.showSuccessToast);
    // this.props.fetchIsSigned();
    // this.props.fetchSignList({ month: this.state.month });
  }

  renderButton() {
    if (this.props.isSigned) {
      return (
        <Button type="disable">
          <FormattedMessage id="app.signInRecord.isSigned" />
        </Button>
      );
    }
    return (
      <Button type="primary" onClick={this.handleSignIn}>
        <FormattedMessage id="app.signInRecord.signIn" />
      </Button>
    );
  }

  render() {
    this.setNavBar();
    return (
      <div className="sign-in-record">
        <Calendar
          selected={this.state.selected}
          signedDays={this.props.sign_list}
          onPreClick={month => this.props.fetchSignList({ month })}
          onNextClick={month => this.props.fetchSignList({ month })}
          onClick={day => this.handleClick(day)}
          isTodaySigned={this.props.isSigned && this.props.from === 'home'}
          language={this.props.language}
        />
        {/* <div className="sign-in-btn">
          {this.renderButton()}
        </div>*/}
        <Toast isOpen={this.state.isOpen}>
          <FormattedMessage id="app.signInRecord.successSign" />
        </Toast>
      </div>
    );
  }
}

SignInRecord.propTypes = {
  from: React.PropTypes.string,
  isSigned: React.PropTypes.bool,
  sign_list: React.PropTypes.arrayOf(React.PropTypes.string),
  signSuccess: React.PropTypes.bool,
  fetchIsSigned: React.PropTypes.func,
  fetchSignList: React.PropTypes.func,
  signIn: React.PropTypes.func,
  removeFromHome: React.PropTypes.func,
  resetState: React.PropTypes.func,
  language: React.PropTypes.string,
};
SignInRecord.contextTypes = contextTypes;

const mapStateToProps = state => ({
  from: state.signIn.from,
  isSigned: state.signIn.is_signed,
  sign_list: state.signIn.sign_list,
  language: state.language.locale,
  signSuccess: state.signIn.signSuccess,
});

const mapDispatchToProps = dispatch => ({
  fetchIsSigned: bindActionCreators(actions.fetchIsSigned, dispatch),
  fetchSignList: bindActionCreators(actions.fetchSignList, dispatch),
  signIn: bindActionCreators(actions.signIn, dispatch),
  removeFromHome: bindActionCreators(actions.removeFromHome, dispatch),
  resetState: bindActionCreators(actions.resetState, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInRecord);
