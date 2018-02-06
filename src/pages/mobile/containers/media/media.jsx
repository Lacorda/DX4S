import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RelativeLink } from 'react-router-relative-links';
import { media as mediaActions } from '../../actions';
import Media from '../../components/media';

const defaultProp = {
  autoPlay: false,
  loop: false,
  controls: true,
  draggable: true,
  // src: 'http://www.w3school.com.cn/i/movie.ogg#t=2',
  src: 'http://www.w3school.com.cn/i/movie.ogg',
  preload: 'auto',
  dragOnProgress: false,
  // height: 'auto',
  onPlay() {},
  onPause() {},
  // onProgress: function(seconds){ console.log(seconds);(seconds == 5 ? this.pause() : '' ); },
  onProgress(seconds) { console.log(seconds); ( seconds == 10 ? this.pause() : '' ); },
  onEnd() {},
};

class myMedia extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { actions } = this.props;
    // setTimeout(function(){actions.fetchNewMedia();},1000);
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    autoPlay:  PropTypes.bool,
    loop:      PropTypes.bool,
    controls:  PropTypes.bool,
    src:       PropTypes.string,
    preload:   PropTypes.oneOf(['auto', 'none', 'metadata']),
  }

  static defaultProps = { ...defaultProp }

  render() {
    const vjsProps = {};
    //
    for (const key of Object.keys(this.props)) {
      if (key in defaultProp) {
        vjsProps[key] = this.props[key];
      }
    }

    return (
      <Media {...vjsProps} />
    );
  }
}

export default connect(state => (
{
  // draggable: state.media.draggable,
  isFetching: state.media.isFetching,
  detail: state.media.detail || {},
  src: state.media.detail.node_url || state.src,
}
), dispatch => (
{
  actions: bindActionCreators(mediaActions, dispatch),
}
))(myMedia);
