import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RelativeLink } from 'react-router-relative-links';
import { media as mediaActions } from '../../actions';
import { Preview } from '../../components/media';

const defaultProp = {
  autoPlay: false,
  loop: false,
  controls: true,
  draggable: true,
  src: 'http://dev-media.xm.duoxue/dev/1/media/mp4480p/c34e0c3846fb4d8dbe3169ff201d3115/c34e0c3846fb4d8dbe3169ff201d3115.mp4#123',
  preload: 'auto',
  dragOnProgress: false,
  onPlay() {},
  onPause() {},
  onProgress(seconds) { console.log(seconds); ( seconds == 2 ? this.pause() : '' ); },
  onEnd() {},
};

class myMedia extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    const { actions } = this.props;
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
      <Preview {...vjsProps} />
    );
  }
}

export default connect(state => (
{
  isFetching: state.media.isFetching,
  detail: state.media.detail || {},
  src: state.media.detail.node_url || state.src,
}
), dispatch => (
{
  actions: bindActionCreators(mediaActions, dispatch),
}
))(myMedia);
