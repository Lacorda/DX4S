import React from 'react';

import Media from 'components/media';

const AnnouncementMedia = () => {
  const resourceUrl = JSON.parse(sessionStorage.getItem('mediaViewer'));
  return (
    <div className="announcement">
      <Media controls src={resourceUrl} />
    </div>
  );
};

export default AnnouncementMedia;
