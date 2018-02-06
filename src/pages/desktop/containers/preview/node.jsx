import React from 'react';

import iconLock from './img/icon-lock.png';
import iconNodeActive from './img/icon-node-active.png';
import iconNodeRead from './img/icon-node-read.png';
import iconNode from './img/icon-node.png';

import iconVideo from './img/icon-video.png';
import iconVideoActive from './img/icon-video-active.png';
import iconAudio from './img/icon-audio.png';
import iconAudioActive from './img/icon-audio-active.png';
import iconDoc from './img/icon-doc.png';
import iconDocActive from './img/icon-doc-active.png';
import iconH5 from './img/icon-h5.png';
import iconH5Active from './img/icon-h5-active.png';
import iconImg from './img/icon-img.png';
import iconImgActive from './img/icon-img-active.png';
import iconSurvey from './img/icon-survey.png';
import iconSurveyActive from './img/icon-survey-active.png';
import iconPractice from './img/icon-practice.png';
import iconPracticeActive from './img/icon-practice-active.png';

function getTypeIcon(hasRead, active, type) {
  if (hasRead || active) {
    if (type === 'video') return iconVideoActive;
    if (type === 'audio') return iconAudioActive;
    if (type === 'doc') return iconDocActive;
    if (type === 'h5') return iconH5Active;
    if (type === 'img') return iconImgActive;
    if (type === 'practice') return iconPracticeActive;
    if (type === 'survey') return iconSurveyActive;
  } else {
    if (type === 'video') return iconVideo;
    if (type === 'audio') return iconAudio;
    if (type === 'doc') return iconDoc;
    if (type === 'h5') return iconH5;
    if (type === 'img') return iconImg;
    if (type === 'practice') return iconPractice;
    if (type === 'survey') return iconSurvey;
  }
  return null;
}

function Node({ name, active, isOrdered, hasRead, type, onClick, unlocked }) {
  let stateIcon;
  if (active) stateIcon = iconNodeActive;
  else if (hasRead) stateIcon = iconNodeRead;
  else if (unlocked) stateIcon = iconNode;
  else if (isOrdered) stateIcon = iconLock;
  else stateIcon = iconNode;

  const typeIcon = getTypeIcon(hasRead, active, type);

  return (
    <div className="chapter-node" onClick={onClick}>
      <img className="node-state" src={stateIcon} alt={name} />
      <span>{name}</span>
      <img className="node-type" src={typeIcon} alt={name} />
    </div>
  );
}

const { string, bool, func } = React.PropTypes;

Node.propTypes = {
  name: string,
  type: string,
  isOrdered: bool,
  hasRead: bool,
  active: bool,
  onClick: func,
  unlocked: bool,
};

export default Node;
