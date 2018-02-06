import React from 'react';
import prefixAll from 'inline-style-prefixer/static';
import { px2rem } from '../helpers';

function Ribbon(props) {
  const {
    text,
    backgroundColor,
    textColor,
    location,
    height: width, // square
    height,
    ribbonHeight,
  } = props;

  let {
    wrapperStyle,
    ribbonStyle,
  } = props;

  // eslint-disable-next-line
  let [, heightNum, unit] = height.match(/([\d]+)([^\d]+)/);
  let [ribbonHeightNum] = ribbonHeight.match(/\d+/);
  heightNum = +heightNum;
  ribbonHeightNum = +ribbonHeightNum;

  wrapperStyle = {
    width,
    height,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    ...wrapperStyle,
  };

  ribbonStyle = {
    backgroundColor,
    color: textColor,
    textAlign: 'center',
    position: 'relative',
    left: '-21%',
    width: '142%', // make it longer then diagonal (√2 * sideLength)
    top: `${(heightNum / 2) - ribbonHeightNum}${unit}`,
    height: ribbonHeight,
    lineHeight: ribbonHeight,
    transformOrigin: 'bottom',
    ...ribbonStyle,
  };

  // TODO feature for bottom
  if (location === 'top-right') {
    Object.assign(wrapperStyle, { right: 0 });
    Object.assign(ribbonStyle, { transform: 'rotate(45deg)' });
  } else/* if (location === 'top-left')*/ {
    Object.assign(ribbonStyle, { transform: 'rotate(-45deg)' });
  }

  const prefixedWrapperStyle = prefixAll(wrapperStyle);
  const prefixedRibbonStyle = prefixAll(ribbonStyle);
  return (
    <div style={prefixedWrapperStyle}>
      <div style={prefixedRibbonStyle}>{text}</div>
    </div>
  );
}


Ribbon.propTypes = {
  text: React.PropTypes.element,
  textColor: React.PropTypes.string,
  backgroundColor: React.PropTypes.string,
  location: React.PropTypes.string,
  height: React.PropTypes.string,
  ribbonHeight: React.PropTypes.string,

  // eslint-disable-next-line
  wrapperStyle: React.PropTypes.object,
  // eslint-disable-next-line
  ribbonStyle: React.PropTypes.object,
};

Ribbon.defaultProps = {
  textColor: 'white',
  backgroundColor: 'tomato',
  location: 'top-left',
  height: px2rem(100),
  ribbonHeight: px2rem(40),
};

export default Ribbon;
