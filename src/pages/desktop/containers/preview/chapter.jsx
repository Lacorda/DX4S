import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Chapter({ index, name }) {
  return (
    <div className="chapter-node-title">
      <FormattedMessage {...messages.chapter} />
      <span>{index}</span>
      <span className="chapter-name">{name}</span>
    </div>
  );
}

Chapter.propTypes = { index: React.PropTypes.number, name: React.PropTypes.string };
export default Chapter;
