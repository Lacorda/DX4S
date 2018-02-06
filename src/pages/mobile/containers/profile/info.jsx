import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { profile as profileActions } from '../../actions';
import { Alert } from '../../../../components/modal';

import messages from './messages';
import goldIcon from './img/icon_gold.png';
import expIcon from './img/icon_exp.png';

function getDefaultHead(headerUrl) {
  const header = headerUrl || '';
  return {
    'default-head': !header.length,
  };
}

const propTypes = {
  actions: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

class Info extends React.Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, contexts) {
    super(props, contexts);
     this.state = {
      isAlertOpen: false,
    };
    this.errorMsg = '';
    this.closeAlert = ::this.closeAlert;
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchProfile();
  }

  handleImageChange(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.props.actions.uploadPhoto(formData)
    .catch((err) => {
      this.errorMsg = err.response.data.message || this.context.intl.messages['app.profile.uploadFail'];
      this.setState({ ...this.state, isAlertOpen: true });
    });
  }

  closeAlert() {
    this.setState({ ...this.state, isAlertOpen: false });
  }

  render() {
    const { profile } = this.props;
    return (
      <div className="info-box">
        <div className="info">
          <div className="avatar">
            <input type="file" name="file" accept="image/*;capture=camera" onChange={(e) => { this.handleImageChange(e); }} />
            <img className={classNames(getDefaultHead(profile.header_url))} src={profile.header_url} alt="" />
          </div>
          <div className="username">{profile.person_name}</div>
          <div className="exp">
            <div className="border-right">
              <img className="icon" src={goldIcon} alt="" />
              <FormattedMessage {...messages.gold} />{profile.gold}</div>
            <div>
              <img className="icon" src={expIcon} alt="" />
              <FormattedMessage {...messages.exp} />{profile.exp}
            </div>
          </div>
        </div>
        <Alert
          shouldCloseOnOverlayClick={false}
          isOpen={this.state.isAlertOpen}
          onRequestClose={this.closeAlert}
          confirmButton={this.context.intl.messages['app.profile.ok']}
        >
          <span>
            {this.errorMsg}
          </span>
        </Alert>
      </div>
    );
  }
}

Info.propTypes = propTypes;

const mapStateToProps = (state) => {
  return {
    profile: state.profileDetail.profile || {},
    newMessage: state.newMessage.newMessage || {},
    isFetching: state.isFetching || false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(profileActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Info);
