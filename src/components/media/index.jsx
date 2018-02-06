import React, { Component, PropTypes } from 'react';
import 'video.js/dist/video-js.css';
import './index.styl';

const videojs = require('video.js');
require('videojs-contrib-hls');

class Media extends Component {
  constructor() {
    super();
    this.player = null;
    this.myPlayer = null; // legacy
    this.attachAttributes = ::this.attachAttributes;
  }

  componentWillUnmount() {
    if (this.player) this.player.dispose();
  }

  enableProgressBar() {
    const player = this.player;
    player.controlBar.progressControl.seekBar.on('mousedown', player.controlBar.progressControl.seekBar.handleMouseDown);
    player.controlBar.progressControl.seekBar.on('touchstart', player.controlBar.progressControl.seekBar.handleMouseDown);
    player.controlBar.progressControl.seekBar.on('click', player.controlBar.progressControl.seekBar.handleClick);
  }

  disableProgressBar() {
    const player = this.player;
    player.controlBar.progressControl.seekBar.off('mousedown');
    player.controlBar.progressControl.seekBar.off('touchstart');
    player.controlBar.progressControl.seekBar.off('click');
  }

  attachAttributes(node) {
    if (!node) return;
    node.setAttribute('playsinline', true);
    node.setAttribute('webkit-playsinline', true);
    node.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
    const poster = this.props.poster;
    const otherProps = poster ? { poster } : {};
    const player = videojs(node, { preload: 'auto', ...otherProps });
    const src = this.props.src;
    const type = src.indexOf('.m3u8') !== -1 ? 'application/x-mpegURL' : undefined;
    player.src({ src, type });
    player.ready(() => {
      player.volume(0.5);
      player.play();
    });

    this.player = player;
    this.myPlayer = player;
  }

  render() {
    const { controls } = this.props;
    return (
      <div className="media video-js vjs-default-skin vjs-big-play-centered vjs-no-flex">
        <video
          ref={this.attachAttributes}
          className="vjs-tech"
          controls={controls}
        />
      </div>
    );
  }
}

const { string, bool } = PropTypes;
Media.propTypes = {
  src: string,
  poster: string,
  controls: bool,
};

export default Media;
