import React from 'react';

import DocViewer from '../../components/doc-viewer';

const AnnouncementImg = () => {
  const resourceUrl = JSON.parse(sessionStorage.getItem('imgViewer'));
  return (
    <DocViewer imageUrls={resourceUrl} />
  );
};

export default AnnouncementImg;
