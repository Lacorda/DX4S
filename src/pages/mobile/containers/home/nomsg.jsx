import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import messages from './messages';
import noMsgImg from './assets/list_empty.png';

function NoMsg() {
  return (
    <div className="nomsg">
      <img src={noMsgImg} alt="not msg" />
      <br />
      <FormattedMessage {...messages.noCourseMsg} />
      <br />
      <Link to="/mall">
        <button><FormattedMessage {...messages.goBuyCourse} /></button>
      </Link>
    </div>
  );
}

export default NoMsg;
