import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

class DocViewer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleScroll = ::this.handleScroll;
    this.loadSuccess = ::this.loadSuccess;
    this.state = {
      currentPage: 1,
      calcTimeout: null, // scroll事件后检测图片数量的timeout
      loaded: 0, // 已经加载的图片数量
      loadedDetectiveInterval: null, // scrollTo检测图片是否完全加载的interval
    };
  }

  componentWillUnmount() {
    const { calcTimeout, loadedDetectiveInterval } = this.state;
    clearTimeout(calcTimeout);
    clearInterval(loadedDetectiveInterval);
  }

  getImagesYPos() {
    const scrollElm = this.scroll;
    const scrollTop = scrollElm.offsetTop;
    const imgTags = scrollElm.getElementsByTagName('img');

    return Array.prototype.map.call(imgTags, img => (img.offsetTop - scrollTop));
  }

  loadSuccess() {
    const loaded = this.state.loaded + 1;
    this.setState({ loaded });
  }

  scrollTo(page) {
    clearInterval(this.state.loadedDetectiveInterval);
    const length = this.props.imageUrls.length;
    const loadedDetectiveInterval = setInterval(() => {
      const loadedImageLength = this.state.loaded;
      if (loadedImageLength === length) {
        const heights = this.getImagesYPos();
        this.scroll.scrollTop = heights[page - 1];
        clearInterval(loadedDetectiveInterval);
      }
    }, 100);
    this.setState({ loadedDetectiveInterval });
  }

  handleScroll() {
    clearTimeout(this.state.calcTimeout);
    const calcTimeout = setTimeout(() => {
      const scrollElm = this.scroll;
      const scrollTop = scrollElm.scrollTop;
      const screenHeight = scrollElm.offsetHeight;
      const imgTags = scrollElm.getElementsByTagName('img');

      let currentPage = 0;
      for (let i = 0, len = imgTags.length; i < len; i += 1) {
        const currentPos = (imgTags[i].offsetTop - scrollTop) + imgTags[i].offsetHeight;
        if (currentPos <= screenHeight) currentPage = i + 1;
      }
      this.setState({ currentPage });
      this.props.onPageTurn(this.state.currentPage);
    }, 200);
    this.setState({ calcTimeout });
  }

  render() {
    return (
      <div
        className="preview-doc"
        onScroll={this.handleScroll}
        ref={(ref) => { this.scroll = ref; }}
      >
        {
          this.props.imageUrls.map((url, index) => (
            <div key={url} className="img">
              <img
                src={url}
                alt=""
                width={this.props.maxWidth}
                onLoad={this.loadSuccess}
              />
              <div className="page">{index + 1}/{this.props.imageUrls.length}</div>
            </div>
          ))
        }
        {
          this.props.isLimited ? (
            <div className="preview-end">
              <div className="preview-end-title"><FormattedMessage {...messages.endTitle} /></div>
              <p><FormattedMessage {...messages.endText} /></p>
            </div>
          ) : ''
        }
      </div>
    );
  }
}

DocViewer.propTypes = {
  imageUrls: React.PropTypes.arrayOf(React.PropTypes.string),
  maxWidth: React.PropTypes.number,
  onPageTurn: React.PropTypes.func,
  isLimited: React.PropTypes.bool,
};
DocViewer.defaultProps = {
  imageUrls: [],
  maxWidth: screen.width,
  onPageTurn() {},
};

export default DocViewer;
