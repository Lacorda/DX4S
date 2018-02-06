import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

function Day() {
  return (
    <div className="week-name">
      {
        Object.keys(messages).map(day => (
          <span key={day} className="day"><FormattedMessage {...messages[day]} /></span>
        ))
      }
    </div>
  );
}


export default Day;
