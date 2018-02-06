import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import SubNav from '../../components/sub-nav';
import aboutImg from './img/logo.png';
import messages from './messages';

class AboutUs extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <DxHeader />
        <SubNav title={this.context.intl.messages['app.about.title']} />
        <div className="about-us-wrapper dx-container">
          <div className="about-us">
            <div className="logo"><img src={aboutImg} alt="" /></div>
            <p><FormattedMessage {...messages.about} /></p>
          </div>
        </div>
        <DxFooter />
      </div>
    );
  }
}

export default AboutUs;
