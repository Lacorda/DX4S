import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

const propTypes = {
  isMore: PropTypes.bool.isRequired,
};

function Pulltext(props) {
  const { isMore } = props;

  return (
    <p className="pulltext">
      {(() => {
        if (isMore) {
          return <FormattedMessage id="app.list.loading" />;
        }
        return <FormattedMessage id="app.list.noMore" />;
      })() }
    </p>
  );
}

Pulltext.propTypes = propTypes;

export default Pulltext;
