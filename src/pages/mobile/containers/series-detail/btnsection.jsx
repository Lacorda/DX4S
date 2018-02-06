import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

function BtnSection(props) {
  return (
    <div className="option-section">
      <div className="btn-favorite" onClick={props.onFavorite}>
        <div className="icon" />
        <div className="text"><FormattedMessage {...messages.favorite} /></div>
      </div>
      <div className="btn-attend" onClick={props.onAttend}><FormattedMessage {...messages.attendtocourse} /></div>
    </div>
  );
}
BtnSection.propTypes = {
  onFavorite: React.PropTypes.func,
  onAttend: React.PropTypes.func,
};

export default BtnSection;
