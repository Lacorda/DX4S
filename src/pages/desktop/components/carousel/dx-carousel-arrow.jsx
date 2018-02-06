import React, { PropTypes } from 'react';

function DxCarouselArrow(props) {
  return (
    <div {...props} className={`dx-carousel-arrow dx-carousel-arrow-${props.type}`}>&nbsp;</div>
  );
}

DxCarouselArrow.propTypes = {
  type: PropTypes.string,
};

export default DxCarouselArrow;
