import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export function transformToBasicLive(liveFromServer) {
  // eslint-disable-next-line no-param-reassign
  liveFromServer.price = liveFromServer.price || {};
  const {
    name,
    cover_url: cover,
    info: description,
    begin_time: beginTime,
    price: {
      is_free: free,
      unit_price: price,
    },
    live_status: status,
    tags,
    lecturer_name: lecturer,
    sales: remain,
  } = liveFromServer;
  return { cover, name, description, beginTime, free, price, tags, status, lecturer, remain };
}

export function capitalize(str) {
  const [capital, ...tail] = str;
  return capital.toUpperCase() + tail.join('').toLowerCase();
}

export function getLiveStatusI18nEl(status) {
  // eslint-disable-next-line react/jsx-filename-extension
  return <FormattedMessage id={`app.live.basic.status.${status}`} />;
}
