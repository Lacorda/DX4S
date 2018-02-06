import React from 'react';
import Hammer from 'react-hammerjs';
class ImageViewer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      scale: 1,
      touchX: 0,
      touchY: 0,
      imgObj: { left: 0, top: 0 },
      tempCount: 0,
    };
  }

  componentDidMount() {
    this.startTime = new Date();
    if (this.props.onTimeCallback) {
      this.viewTimer = setInterval(() => {
        const dtEndTime = new Date();
        const seconds = Math.round(Math.abs(dtEndTime - this.startTime) / 1000);
        this.props.onTimeCallback(seconds);
      }, 500);
    }
  }

  componentWillUnmount() {
    this.startTime = null;
    clearInterval(this.viewTimer);
  }

  render() {
    const self = this;
    let newWidth = 0;
    let newHeight = 0;

    // 缩放手势事件
    const handlePinch = function handlePinchEvent(event) {
      self.state.tempCount += 1;
      if (self.state.tempCount % 12 > 2)
        return
      const image = self.showImg;
      const offsetImage = image.getBoundingClientRect();
      const scale = event.scale;
      if (newWidth === 0 && newHeight === 0) {
        newWidth = offsetImage.width * scale;
        newHeight = offsetImage.height * scale;
      }
      else {
        newWidth *= scale;
        newHeight *= scale;
      }
      if (image.width * scale < self.props.maxWidth) {
        image.width = self.props.maxWidth;
      }
      else {
        image.width *= scale;
      }
      event.stopPropagation();
    }

    const handleDrag = function handleDragEvent(event) {
      self.state.touchX = event.touches[0].pageX;
      self.state.touchY = event.touches[0].pageY;
    }
    // 图片拖动事件
    const handleMove = function handleMoveEvent(event) {
      const toX = event.touches[0].pageX - self.state.touchX;
      const toY = event.touches[0].pageY - self.state.touchY;
      let newLeft = parseInt(self.state.imgObj.left, 10) + toX;
      let newTop = parseInt(self.state.imgObj.top, 10) + toY;
      self.showImg.style.position = 'relative';
      if (newLeft > 0) {
        newLeft = 0;
      }
      if (newLeft < -self.showImg.width + self.props.maxWidth) {
        newLeft = -self.showImg.width + self.props.maxWidth;
      }
      self.showImg.style.left = `${newLeft}px`;
      if (newTop >= 0) {
        newTop = 0;
      }
      if (self.showImg.height > self.props.maxHeight) {
        if (newTop < -(self.showImg.height - self.props.maxHeight)) {
          newTop = -(self.showImg.height - self.props.maxHeight);
        }
      }
      else {
        newTop = 0;
      }
      self.showImg.style.top = `${newTop}px`;
    }
    const handleEnd = function handleEndEvent() {
      self.state.imgObj = {
        left: parseInt(self.showImg.style.left, 10),
        top: parseInt(self.showImg.style.top, 10),
      };
      self.state.touchX = 0;
      self.state.touchY = 0;
    }
    return (
      <div >
        <Hammer
          onPinch={handlePinch}
          options={{
            recognizers: {
              pinch: { enable: true },
            },
          }}
        >
          <div ref={(ref) => { self.wrap = ref; }}>
            <div
              style={{ overflow: 'hidden' }}>
              <img
                alt={self.props.alt}
                src={self.props.imageUrl}
                ref={(ref) => { self.showImg = ref; }}
                width="100%"
                onTouchStart={handleDrag}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
              />
            </div>
          </div>
        </Hammer>
      </div>
    );
  }
}

ImageViewer.propTypes = {
  alt: React.PropTypes.string,
  imageUrl: React.PropTypes.string,
  maxWidth: React.PropTypes.number,
  maxHeight: React.PropTypes.number,
  onTimeCallback: React.PropTypes.func,
};
ImageViewer.defaultProps = {
  alt: '',
  imageUrl: '',
  maxWidth: screen.width,
  maxHeight: screen.height,
  onTimeCallback: function(second) {
    // console.log(second);

  }
};

export default ImageViewer;


