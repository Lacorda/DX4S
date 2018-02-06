import React from 'react';
import { FormattedMessage } from 'react-intl';
import img from './img/empty_content.png';

import messages from './messages';
import './guide-page.styl';

function PublishSuccessPopup({ whole }) {
  if (whole) return null;
  return (
    <div className="guide-page">
      <img src={img} alt={img} />
      <p className="sub-content"><FormattedMessage {...messages.emptyContent} /></p>
    </div>
  );
}

PublishSuccessPopup.propTypes = {
  whole: React.PropTypes.bool,
};

export default PublishSuccessPopup;
