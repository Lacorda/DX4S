import React, { Component } from 'react';
import iScroll from 'iscroll/build/iscroll-probe';
import { FormattedMessage } from 'react-intl';
import emptyImg from './img/empty_content.png';
import ReactIScroll from '../react-iScroll';
import './style.styl';
import messages from './messages';

class RefreshLoad extends Component {
  static contextTypes = {
    intl: React.PropTypes.object,
  }

  constructor() {
    super();
    this.handleRefresh = ::this.handleRefresh;
    this.state = {
      key: 0,
      top: 0,
      fuckKey: 0, // 去你大爷的用来刷新用的key
    };
    this.touch = null;
    this.startPos = null;
    this.endPos = null;
    this.isScrolling = null;
    this.scrollY = 0;
  }

  componentDidMount() {

    if (document.getElementsByClassName('iscroll-body').length === 1) {
      document.body.addEventListener('touchstart', this.touchStart, false);
      document.body.addEventListener('touchmove', this.touchMove, false);
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
    }
    this.SCROLL.iScrollInstance.handleEvent = this.SCROLL.iScrollInstance::this.handleEvent;
  }

  componentWillUnmount() {
    setTimeout(() => {
      if (document.getElementsByClassName('iscroll-body').length === 0) {
        document.body.removeEventListener('touchstart', this.touchStart);
        document.body.removeEventListener('touchmove', this.touchMove);
        document.body.removeAttribute('style');
      }
    }, 50);
  }

  /* eslint-disable */
  //重写iscroll里面的handleEvent方法
  handleEvent(e) {
    switch (e.type) {
      case 'touchstart':
      case 'pointerdown':
      case 'MSPointerDown':
      case 'mousedown':
        this._start(e);
        break;
      case 'touchmove':
      case 'pointermove':
      case 'MSPointerMove':
      case 'mousemove':
        this._move(e);
        break;
      case 'touchend':
      case 'pointerup':
      case 'MSPointerUp':
      case 'mouseup':
      case 'touchcancel':
      case 'pointercancel':
      case 'MSPointerCancel':
      case 'mousecancel':
        this._end(e);
        break;
      case 'orientationchange':
      case 'resize':
        this._resize();
        break;
      case 'transitionend':
      case 'webkitTransitionEnd':
      case 'oTransitionEnd':
      case 'MSTransitionEnd':
        this._transitionEnd(e);
        break;
      case 'wheel':
      case 'DOMMouseScroll':
      case 'mousewheel':
        this._wheel(e);
        break;
      case 'keydown':
        this._key(e);
        break;
      case 'click':
        if (this.enabled && !e._constructed) {
          //e.preventDefault();
          //e.stopPropagation();
        }
        break;
    }
    /* eslint-enable */
  }


  touchStart(event) {
    this.touch = event.targetTouches[0];
    this.startPos = { x: this.touch.pageX, y: this.touch.pageY, time: +new Date() };
    this.isScrolling = 0;
  }


  touchMove(event) {
    // 下拉防微信露底
    this.touch = event.targetTouches[0];
    this.endPos = { x: this.touch.pageX - this.startPos.x, y: this.touch.pageY - this.startPos.y };
    if (Math.abs(this.endPos.y) > Math.abs(this.endPos.x)) {
      event.preventDefault();
    }
  }

  handleRefresh(downOrUp, callback) {
    const { pullDownCallBack, pullUpCallBack } = this.props;
    if (downOrUp === 'down') {
      if (pullDownCallBack) {
        pullDownCallBack(callback);
      } else {
        const rndNum = Math.random();
        this.setState({ key: rndNum });
        callback();
      }
    } else if (pullUpCallBack) {
      pullUpCallBack(callback);
    } else {
      callback();
    }
  }

  refresh(scrollToLastPosition) {
    const scrollY = this.SCROLL.iScrollInstance.y;
    this.setState({ fuckKey: Math.random() }, () => {
      if (scrollToLastPosition) {
        if (Math.abs(scrollY) > this.SCROLL.iScrollInstance.scrollerHeight) {
          this.SCROLL.iScrollInstance.scrollTo(0, this.SCROLL.iScrollInstance.scrollerHeight);
        }
        else {
          this.SCROLL.iScrollInstance.scrollTo(0, scrollY);
        }
      }
    });
  }

  renderChildren = () => {
    const { empty } = this.props;
    if (empty) {
      return (
        <div className="guide-page">
          <img src={emptyImg} alt={emptyImg} />
          <p className="sub-content">
            <FormattedMessage {...messages.emptyContent} />
          </p>
        </div>
      );
    }
    return this.props.children;
  };

  render() {
    const { relative, needPullUp, needPullDown, isSpecial, absolute, hidePullUp } = this.props;


    let className = 'refreshWebLoadTop';
    if (__platform__.web || __platform__.wechat) {
      if (isSpecial) className = 'refreshWebLoadSpecialTop';
    } else {
      className = 'refreshNoBarTop';
      if (isSpecial) className = 'refreshNoBarSpecialTop';
    }
    if (this.props.className) className = this.props.className;
    if (relative) className = 'full-fill';
    if (absolute) className = '';
    const pullDownToRefresh = this.context.intl.messages['app.commponent.refreshload.pullDownRefresh'];
    const releaseToRefresh = this.context.intl.messages['app.commponent.refreshload.releaseToRefresh'];
    const onloading = this.context.intl.messages['app.commponent.refreshload.onloading'];
    const pullUpToLoadMore = this.context.intl.messages['app.commponent.refreshload.pullUpLoadMore'];
    const releaseToLoadMore = this.context.intl.messages['app.commponent.refreshload.releaseToLoadMore'];
    const pullDownText = [pullDownToRefresh, releaseToRefresh, onloading];
    const pullUpText = [pullUpToLoadMore, releaseToLoadMore, onloading];
    const refreshContainer = (
      <ReactIScroll
        ref={(ref) => { this.SCROLL = ref; }}
        iScroll={iScroll}
        className={className}
        hidePullUp={hidePullUp}
        style={{ position: relative ? 'relative' : 'absolute' }}
        pullDown={needPullDown}
        pullUp={needPullUp}
        handleRefresh={this.handleRefresh}
        pullDownText={pullDownText}
        pullUpText={pullUpText}
        options={{
          mouseWheel: true, // 是否支持鼠标滚轮
          scrollbars: false, // 是否显示滚动条
          probeType: 2, // 滚动的节奏
          bounceEasing: 'quadratic', // 动画算法
          fadeScrollbars: true, // 是否使用滚动 fade 效果
          interactiveScrollbars: true,
          click: true,
          preventDefault: false,
          disablePointer: true,
          disableTouch: false,
          disableMouse: false
        }}
      >
        <div id="refrhshContainer" key={this.state.key}>
          {this.renderChildren()}
        </div>
      </ReactIScroll>
    );
    if (relative) {
      return <div key={this.state.fuckKey} style={{ height: '100%' }}>{refreshContainer}</div>;
    }
    if (absolute) {
      return (
        <div
          key={this.state.fuckKey}
          className={this.props.className}
          style={{ position: 'absolute', left: 0, right: 0 }}
        >
          {refreshContainer}
        </div>
      );
    }
    return refreshContainer;
  }
}

RefreshLoad.propTypes = {
  needPullUp: React.PropTypes.bool,
  needPullDown: React.PropTypes.bool,
  pullDownCallBack: React.PropTypes.func,
  pullUpCallBack: React.PropTypes.func,
  isSpecial: React.PropTypes.bool,
  relative: React.PropTypes.bool,
  absolute: React.PropTypes.bool,
  className: React.PropTypes.string,
  hidePullUp: React.PropTypes.bool,
  empty: React.PropTypes.bool,
};

export default RefreshLoad;
