import React from 'react';
import Loading from 'react-loading';

import './style.styl';

export default function WrappedLoading({ wrap }) {
  return (
    <div className="dx-r-loading">
      {wrap && <div className="loading-wrap" />}
      <Loading type="balls" color="#38acff" />
    </div>
  );
}

WrappedLoading.propTypes = { wrap: React.PropTypes.bool };
