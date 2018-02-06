import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import messages from './messages';
import { nav } from 'utils/dx';
import aboutImg from 'img/about.png';

class About extends Component {
  constructor(props, context) {
    super(props, context);
    this.setNavBar = ::this.setNavBar;
  }

  static contextTypes = {
    router: PropTypes.object,
    intl: PropTypes.object,
  }

  componentDidMount() {

  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.about.title'],
    });
  }

  render() {
    this.setNavBar();
    // aclass
    const aclass = classNames(
      'about-us',
    );

    return (
      <div className={aclass}>
        <div className="logo"><img src={aboutImg} /></div>
        <FormattedMessage {...messages.about} />
      </div>
    );
  }
}

export default About;
