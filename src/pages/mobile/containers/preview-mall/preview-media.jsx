import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import MediaViewer from '../../components/media';

import {
  nodeIdSelector,
  getNodeUrl,
  getDuration,
} from './selectors';

import messages from './messages';

class MediaPreview extends React.Component {
  constructor() {
    super();
    this.onProgress = ::this.onProgress;
    this.state = {
      timeout: null,
      done: false,
    };
  }

  componentDidMount() {
    const timeout = setInterval(() => {
      const mediaPlayer = this.mediaPlayer;
      if (!mediaPlayer || !mediaPlayer.myPlayer) return;
      const player = mediaPlayer.myPlayer;
      const currentTime = player.currentTime();
      this.onProgress(Math.floor(currentTime));
    }, 333);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ timeout });
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
  }

  onProgress(time) {
    // const mediaEle = document.getElementById('media');
    const ended = this.mediaPlayer.myPlayer.ended();
    if (time >= this.props.duration || ended) {
      // this.mediaPlayer.myPlayer.pause();
      // mediaEle.parentNode.removeChild(mediaEle);
      this.setState({ done: true });
      clearTimeout(this.state.timeout);
    }
  }

  render() {
    const { nodeId, resourceUrl } = this.props;
    return (
      <div>
        {
          !this.state.done ? (
            <MediaViewer
              controls
              key={nodeId}
              ref={(ref) => { this.mediaPlayer = ref; }}
              src={resourceUrl}
            />
          ) : null
        }

        {
          this.state.done ? (
            <div className="preview-notice-wrap">
              <div className="preview-notice">
                <div className="preview-notice-title"><FormattedMessage {...messages.endTitle} /></div>
                <p><FormattedMessage {...messages.endText} /></p>
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

MediaPreview.propTypes = {
  nodeId: React.PropTypes.string,
  resourceUrl: React.PropTypes.string,
  duration: React.PropTypes.number,
};


const mapStateToProps = state => ({
  nodeId: nodeIdSelector(state),
  resourceUrl: getNodeUrl(state),
  duration: getDuration(state),
});

export default connect(mapStateToProps)(MediaPreview);
