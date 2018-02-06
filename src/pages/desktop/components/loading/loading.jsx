import React, { Component, PropTypes } from 'react';
import loadingImg from './img/loadImg.gif';

class Loading extends Component {
  render() {
    const { isShow } = this.props;
    if (isShow) {
      return (
        <div className="loading">
          <div className="loadingImg"><img src={loadingImg} /></div>
        </div>
      );
    }
    return null;
  }
}

Loading.propTypes = {
  isShow: PropTypes.bool,
};

export default Loading;
