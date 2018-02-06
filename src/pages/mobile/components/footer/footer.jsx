import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import messages from './messages';
import Cookie from 'tiny-cookie';
import { connect } from 'react-redux';
const propTypes = {
  newMessage: PropTypes.object.isRequired,
};

function getNewMsg(newMessage) {
  return {
    'menu_profile': true,
    'red-dot': newMessage.announcement_msg,
  };
}
class Footer extends React.Component {
  render() {
    const newMessage = this.props.newMessage;

    return (
      <div className="footer">
        <div className="fixed-bottom">
          <ul>
            <li><Link to="/home" className="menu_home" activeClassName="active"><FormattedMessage {...messages.course} /></Link></li>
            {Cookie.get('mallIcon') === 'true' && <li><Link to="/mall" className="menu_mall" activeClassName="active"><FormattedMessage {...messages.mall} /></Link></li>}
            <li><Link to="/profile" className={classNames(getNewMsg(newMessage))} activeClassName="active"><FormattedMessage {...messages.mine} /></Link></li>
          </ul>
        </div>
      </div>
    );
  }
}

Footer.propTypes = propTypes;
const mapStateToProps = (state) => {
  return {
    newMessage: state.newMessage.newMessage || {},
  };
};

export default connect(mapStateToProps)(Footer);
