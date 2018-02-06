import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'components/button';
import img from '../img/publish_success.png';

import messages from '../messages';
import './guide-page.styl';

function PublishSuccessPopup({ name, toDistribution }) {
  return (
    <div className="guide-page">
      <img src={img} alt={name} />
      <p><FormattedMessage {...messages.publishSuccess} values={{ name }} /></p>
      <Button onClick={toDistribution}>
        <FormattedMessage {...messages.viewPublish} />
      </Button>
    </div>
  );
}

PublishSuccessPopup.propTypes = {
  name: React.PropTypes.string,
  toDistribution: React.PropTypes.func,
};

export default PublishSuccessPopup;
