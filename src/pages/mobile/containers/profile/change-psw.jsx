import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'components/button';
import { Alert } from 'components/modal/';
import Input from '../../components/input';
import classNames from 'classnames';
import messages from './messages';
import { FormattedMessage } from 'react-intl';
import { profile as profileActions } from '../../actions';
import api from 'utils/api';
import { nav } from 'utils/dx';

const defaultProp = {};

class ChangePsw extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isAlertOpen: false,
      isDefault: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.alertMsg = null;
  }

  static contextTypes = {
    router: PropTypes.object,
    intl: PropTypes.object,
  }

  static propTypes = {}

  static defaultProps = { ...defaultProp }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isSuccess){
      // window.alert('修改密码成功!');
      this.alertMsg = (<FormattedMessage {...messages.pwdSuccess} />);
      this.setState({ ...this.state, isAlertOpen: true });
      // this.context.router.push('/');
    }else if(nextProps.message){
      // window.alert(nextProps.message);
      this.alertMsg = nextProps.message;
      this.setState({ ...this.state, isAlertOpen: true });
    }
  }

  handleSubmit() {
    if(this.state.isDefault) return;

    const oid = this.oid.refs.input.value;
    const nid = this.nid.refs.input.value;
    const rid = this.rid.refs.input.value;

    if(!oid || !nid || !rid) {
      // return alert('选项不能为空!');
      this.alertMsg = (<FormattedMessage {...messages.pwdNotEmpty} />);
      this.setState({ ...this.state, isAlertOpen: true });
      return;
    }
    if(nid !== rid) {
      // return alert('两次新密码不一致!');
      this.alertMsg = (<FormattedMessage {...messages.pwdNotTheSame} />);
      this.setState({ ...this.state, isAlertOpen: true });
      return;
    }
    if(nid.length < 6 || nid.length > 20) {
      // return alert('长度不够');
      this.alertMsg = (<FormattedMessage {...messages.pwdLength} />);
      this.setState({ ...this.state, isAlertOpen: true });
      return;
    }
    const data = {
      old_pass: oid,
      new_pass: nid,
    };
    //
    this.props.actions.postPassword(data);
  }

  handleChange(e) {
    const oid = this.oid.refs.input.value;
    const nid = this.nid.refs.input.value;
    const rid = this.rid.refs.input.value;

    (oid && nid && rid) ? this.setState({ ...this.state, isDefault: false }) :
                          this.setState({ ...this.state, isDefault: true });
  }

  closeAlert() {
    this.setState({ ...this.state, isAlertOpen: false });
    if (this.props.isSuccess) {
      const logout = api({ url: '/account/certification/center/logout' });
      logout.then(() => {
        window.location = './#/account';
      });
    }
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.changePwd.title'],
    });
  }

  render() {
    this.setNavBar();
    // whether button is disabled
    const classes = classNames({
      'btn-default': this.state.isDefault
    });

    return (
      <div>
        <Input type="password" ref={(ref) => { this.oid = ref; }} size="block" onChange={this.handleChange} placeholder={this.context.intl.messages['app.profile.old-password']} />
        <Input type="password" ref={(ref) => { this.nid = ref; }} size="block" onChange={this.handleChange} placeholder={this.context.intl.messages['app.profile.new-password']} />
        <Input type="password" ref={(ref) => { this.rid = ref; }} size="block" onChange={this.handleChange} placeholder={this.context.intl.messages['app.profile.repeat-password']} />
        <div className="change-psw">
          <Button className={classes} type="primary" size="block" onClick={this.handleSubmit}><FormattedMessage id="app.profile.confirm" /></Button>
        </div>
        <Alert
          isOpen={this.state.isAlertOpen}
          onRequestClose={this.closeAlert}
          confirmButton={<span><FormattedMessage id="app.profile.ok" /></span>}
        >
          <span>
            {this.alertMsg}
          </span>
        </Alert>
      </div>
    );
  }
}

export default connect((state, ownProps) => (
  {
    isFetching: state.profileDetail.isFetching || false,
    isSuccess: state.profileDetail.isSuccess || false,
    message: state.profileDetail.message || null,
  }
), dispatch => (
  {
    actions: bindActionCreators(profileActions, dispatch),
  }
))(ChangePsw);
