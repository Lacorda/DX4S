import React from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { formatCourseSource } from '../helpers';
import messages from '../messages';

function Live({
  id,
  name,
  cover_url: cover,
  readOnly,
  viewOnly,
  selected,
  noBottomBorder,
  source,
  available_num: available,
  onChecked,
  onUnchecked,
}) {

  function onCheckChange() {
    const checked = !selected;
    if (checked) onChecked(id);
    else onUnchecked(id);
  }

  const onClick = readOnly ? {} : { onClick: onCheckChange };
  const checkBox = viewOnly ? null : (
    <input
      readOnly
      disabled={readOnly}
      type="checkbox"
      checked={selected}
      {...onClick}
    />
  );

  const listClass = classnames({
    'dx-flex-box': true,
    'no-border': noBottomBorder,
  });

  let availableEl = null;
  if (available !== undefined) {
    availableEl = (
      <div className="dx-flex-info-desc">
        <FormattedMessage {...messages.available} values={{ num: available }} />
      </div>
    );
  }

  return (
    <li key={id} className="one-slide" {...onClick}>
      <div className={listClass}>
        {checkBox}
        <div className="dx-flex-img">
          <img src={cover} alt={name} />
        </div>
        <div className="dx-flex-info">
          <div className="dx-flex-info-title">{name}</div>
          <div className="dx-flex-info-desc">
            <FormattedMessage {...messages.source} />
            ：{formatCourseSource(source)}
          </div>
          {availableEl}
        </div>
      </div>
    </li>
  );
}

const { string, bool, func, number, oneOfType } = React.PropTypes;
Live.propTypes = {
  id: oneOfType([string, number]).isRequired,
  name: string,
  cover_url: string.isRequired,
  selected: bool,
  readOnly: bool,
  viewOnly: bool,
  onChecked: func,
  onUnchecked: func,
  noBottomBorder: bool,
  source: string,
  available_num: number,
};

export default Live;
