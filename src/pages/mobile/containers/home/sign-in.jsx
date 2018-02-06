import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { signIn as singInAction } from '../../actions';

class SignInIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchIsSigned();
  }

  render() {
    return (
      <div className="sign-in-wrap">
        {
          !this.props.is_Signed ? (<div className="sign-in" onClick={this.props.signInFromHome}>
              <Link to="/sign-in-record">
                <FormattedMessage id="app.home.signIn" />
              </Link>
            </div>) : ''
        }
      </div>
    );
  }

}

SignInIcon.propTypes = {
  is_Signed: React.PropTypes.bool,
  fetchIsSigned: React.PropTypes.func,
  signInFromHome: React.PropTypes.func,
};
const mapStateToProps = state => ({
  is_Signed: state.signIn.is_signed,
});
const mapDispatchToProps = { fetchIsSigned: singInAction.fetchIsSigned, signInFromHome: singInAction.signInFromHome };

export default connect(mapStateToProps, mapDispatchToProps)(SignInIcon);
