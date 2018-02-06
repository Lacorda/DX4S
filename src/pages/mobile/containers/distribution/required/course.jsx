import React from 'react';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { withRouter, routerShape } from 'react-router';
import Ribbon from 'components/ribbon';

import messages from '../messages';
import { formatCourseSource } from './helpers';

function generateCourseTypeRibbonProps(type) {
  if (type === 'solution') {
    return (
      <Ribbon
        text={<FormattedMessage {...messages.seriesType} />}
        backgroundColor="#82C650"
      />
    );
  }
  return null;
}

function Course({
  id,
  selected,
  last,
  readOnly,
  viewOnly,
  onChecked,
  onUnchecked,
  type,
  name,
  cover_url: cover,
  available_num: available,
  source,
  router,
}) {
  const listClass = classnames({
    'dx-flex-box': true,
    'no-border': last,
  });

  function onCheckChange() {
    const checked = !selected;
    if (checked) onChecked(id);
    else onUnchecked(id);
  }

  function viewDetail(e) {
    router.push(`/products/course/${id}?type=view`);
    e.stopPropagation();
    e.preventDefault();
  }

  const onClick = readOnly ? {} : { onClick: onCheckChange };
  const checkBox = viewOnly ? null : (
    <input
      disabled={readOnly}
      type="checkbox"
      checked={selected}
      {...onClick}
    />
  );

  let availableEl = null;
  if (available !== undefined) {
    availableEl = (
      <div className="dx-flex-info-desc">
        <FormattedMessage {...messages.available} values={{ num: available }} />
      </div>
    );
  }

  let viewEl = null;
  if (false /* TODO: goto detail */ && source !== 'enterprise' ) {
    viewEl = (
      <div className="dx-list-view" onClick={viewDetail}>
        <FormattedMessage {...messages.viewCourse} />
      </div>
    );
  }

  return (
    <li key={id} className="one-slide" {...onClick}>
      <div className={listClass}>
        {checkBox}
        <div className="dx-flex-img">
          {generateCourseTypeRibbonProps(type)}
          <img src={cover} alt={name} />
        </div>
        <div className="dx-flex-info">
          <div className="dx-flex-info-title">{name}</div>
          <div className="dx-flex-info-desc">
            <FormattedMessage {...messages.source} />
            ：{formatCourseSource(source)}
          </div>
          {availableEl}
          {viewEl}
        </div>
      </div>
    </li>
  );
}

Course.propTypes = {
  id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  last: React.PropTypes.bool,
  readOnly: React.PropTypes.bool,
  selected: React.PropTypes.bool,
  onChecked: React.PropTypes.func,
  onUnchecked: React.PropTypes.func,
  cover_url: React.PropTypes.string,
  type: React.PropTypes.string,
  name: React.PropTypes.string,
  source: React.PropTypes.string,
  available_num: React.PropTypes.number,
  viewOnly: React.PropTypes.bool,
  router: routerShape,
};

export default withRouter(Course);
