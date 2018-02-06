import React from 'react';
import api from 'utils/api';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import SubNav from '../../components/sub-nav';
import Calendar from '../../components/calendar';
import { signIn as actions } from '../../actions';

const moment = require('moment');

const contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

class SignInRecord extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignIn = ::this.handleSignIn;
    this.state = {
      selected: moment().startOf('day'),
      month: moment().format('YYYY-MM'),
      isSigning: false,
      show: false,
      animating: false,
      hide: false,
      completeSuccess: false,  // 记录签到成功的瞬间。PS:由于签到成功瞬间，服务端返回已签到日期list存在异步问题
    };
  }

  componentDidMount() {
    this.props.fetchSignList({ month: this.state.month });
    this.props.fetchIsSigned();
  }

  handleClick = (day) => {
    this.setState({ selected: day.date });
  }

  handleSignIn() {
    api({
      method: 'GET',
      url: '/account/account/signin',
    }).then(() => {
      this.setState({ isSigning: true });
      // 显示
      this.setState({ show: true });
      // 打勾动画
      setTimeout(() => {
        this.setState({ animating: true });
      }, 500);
      // 隐藏
      setTimeout(() => {
        this.setState({ hide: true });
      }, 1500);
      setTimeout(() => {
        this.props.fetchIsSigned();
        this.setState({ completeSuccess: true });
      }, 1500);
    });
  }

  render() {
    const { selected, isSigning, show, hide, animating, completeSuccess } = this.state;
    const { sign_list: signList, isSigned, fetchSignList, language } = this.props;
    const btnClass = classNames({
      'sign-in-record-success': true,
      show,
      hide,
    });
    const animateClass = classNames({
      animation: true,
      animating,
    });
    return (
      <div>
        <DxHeader />
        <SubNav title={this.context.intl.messages['app.signInRecord.title']} />
        <div className="sign-in-record dx-container">
          <Calendar
            selected={selected}
            signedDays={signList}
            onPreClick={month => fetchSignList({ month })}
            onNextClick={month => fetchSignList({ month })}
            onClick={day => this.handleClick(day)}
            completeSuccess={completeSuccess}
            language={language}
          />
        </div>
        <DxFooter />
        <div className={btnClass}>
          <div className="mask">
            <div className={animateClass}>&nbsp;</div>
          </div>
        </div>
        {
          (isSigning || isSigned) ? null : (
            <div className="sign-in-record-btn" onClick={this.handleSignIn}>
              {this.context.intl.messages['app.signInRecord.signIn']}
            </div>
          )
        }
      </div>
    );
  }
}

SignInRecord.propTypes = {
  isSigned: React.PropTypes.bool,
  sign_list: React.PropTypes.arrayOf(React.PropTypes.string),
  fetchIsSigned: React.PropTypes.func,
  fetchSignList: React.PropTypes.func,
  language: React.PropTypes.string,
};
SignInRecord.contextTypes = contextTypes;

const mapStateToProps = state => ({
  isSigned: state.signIn.is_signed,
  sign_list: state.signIn.sign_list,
  language: state.language.locale,
});

const mapDispatchToProps = dispatch => ({
  fetchIsSigned: bindActionCreators(actions.fetchIsSigned, dispatch),
  fetchSignList: bindActionCreators(actions.fetchSignList, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInRecord);
