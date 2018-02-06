import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

function Header(props) {
  return (
    <div className="title">
      <div className="title-content pull-left">
        {props.children}
      </div>
      <div className="title-more pull-right">
        <Link to={props.to}> <FormattedMessage {...messages.more} /> </Link>
      </div>
    </div>
  );
}

Header.propTypes = {
  children: React.PropTypes.element.isRequired,
  to: React.PropTypes.string,
};

export default Header;
