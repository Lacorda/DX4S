import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export function formatCourseSource(source) {
  return <FormattedMessage id={`app.distribution.source.${source}`} />;
}
