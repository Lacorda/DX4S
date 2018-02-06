import React, { Component, PropTypes } from 'react';
import { nav } from 'utils/dx';

import Media from '../../components/media';

import './styles.styl';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const propTypes = {
  location: PropTypes.object.isRequired,
};

export default class AnnouncementMedia extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    setNav(this.context.intl.messages['app.announcement.title.checkTheAttachment']);
  }

  render() {
    const { location: { query } } = this.props;
    const resourceUrl = query.resourceUrl;
    return (
      <div className="announcement">
        <Media controls src={resourceUrl} />
      </div>
    );
  }
}

AnnouncementMedia.propTypes = propTypes;
