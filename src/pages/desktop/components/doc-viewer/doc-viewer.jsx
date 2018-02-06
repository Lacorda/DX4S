import React from 'react';
import Slider from '../../components/carousel';

import example01 from './img/01.jpg';
import example02 from './img/02.jpg';
import example03 from './img/03.jpg';
import example04 from './img/04.jpg';

class DocViewer extends React.Component {
  constructor(props) {
    super(props);
    this.slickPrev = ::this.slickPrev;
    this.slickNext = ::this.slickNext;
    this.state = {
      lineHeight: 1,
      className: '',
      thumb: false,
      currentPage: 1,
    };
  }

  componentDidMount() {
    const baseHeight = this.sliderWrapper.offsetHeight;
    // eslint-disable-next-line
    this.setState({ lineHeight: `${baseHeight}px` });
    if (__PLATFORM__.DINGTALKPC) {
      this.setState({ className: 'slick-slide-dingtalk' });
    }
  }

  componentWillReceiveProps({ fullScreenMode }) {
    if (fullScreenMode !== this.props.fullScreenMode) {
      this.setState({ className: 'fade-out' });
      setTimeout(() => {
        this.setState({ className: '' });
      }, 500);
      this.slider.slickGoTo(this.state.currentPage - 1);
    }
  }

  handleChange(e) {
    let val = e.target.value.replace(/^:/, '').replace(/[^:\d]/, '');
    const len = this.props.imageUrls.length;
    if (val > len) val = len;
    if (val) this.setState({ currentPage: Number(val) });
  }

  slickGoTo(e) {
    if ((e.keyCode || e.which) === 13) {
      this.slider.slickGoTo(this.state.currentPage - 1);
    }
  }

  scrollTo(page) {
    this.slider.slickGoTo(page - 1);
  }

  slickPrev() {
    this.slider.slickPrev();
  }

  slickNext() {
    this.slider.slickNext();
  }

  render() {
    const { imageUrls, width, onPageTurn } = this.props;
    const { lineHeight, className, thumb, currentPage } = this.state;
    const settings = {
      className: 'dx-doc-previewer',
      // autoplay: true,
      dots: thumb,
      infinite: true,
      // fade: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      customPaging: i => (
        <div className="dx-slick-dots">
          <div className="icon-page">{i + 1}</div>
          <img src={imageUrls[i]} alt="" />
        </div>
      ),
      afterChange: (i) => {
        onPageTurn(i + 1);
        this.setState({ currentPage: i + 1 });
      },
    };

    return (
      <div className="doc-wrapper">
        <div className="doc-slider" ref={(ref) => { this.sliderWrapper = ref; }}>
          <Slider
            {...settings}
            ref={(ref) => { this.slider = ref; }}
          >
            {
              imageUrls.map((url, i) => (
                <div key={i} className={className} style={{ lineHeight, width }}><img src={url} alt="" /></div>
              ))
            }
          </Slider>
        </div>
        <div className="doc-operation">
          <div className="doc-icon-thumb" onClick={() => { this.setState({ thumb: !thumb }); }}>&nbsp;</div>
          <div className="doc-pagination">
            <div className="doc-icon-pre" onClick={this.slickPrev}>&nbsp;</div>
            <div className="doc-page">
              <input
                type="text"
                name="current-page"
                value={currentPage}
                onChange={(e) => { this.handleChange(e); }}
                onKeyUp={(e) => { this.slickGoTo(e); }}
              /> / {imageUrls.length}
            </div>
            <div className="doc-icon-next" onClick={this.slickNext}>&nbsp;</div>
          </div>
        </div>
      </div>
    );
  }
}

DocViewer.propTypes = {
  imageUrls: React.PropTypes.arrayOf(React.PropTypes.string),
  onPageTurn: React.PropTypes.func,
  width: React.PropTypes.string,
  fullScreenMode: React.PropTypes.bool,
};
DocViewer.defaultProps = {
  imageUrls: [example01, example01, example02, example01, example03, example04],
  onPageTurn() {},
};

export default DocViewer;
