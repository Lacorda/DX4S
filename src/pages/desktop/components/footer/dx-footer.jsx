import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class DxFooter extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { theme, hiddenLink } = this.props;
    return (
      <div className={`dx-footer ${theme}`}>
        {hiddenLink ? null : (
          <div className="link">
            <Link to="help">{this.context.intl.messages['app.footer.help']}</Link>|
            {
              !__PLATFORM__.DINGTALKPC ? (
                <span><Link to="feedback">{this.context.intl.messages['app.footer.feedback']}</Link>|</span>) : null
            }
            <Link to="about-us">{this.context.intl.messages['app.footer.about']}</Link>
          </div>
        )}
        <div className="copyright">
          Copyright 1999-2017 © www.nd.com.cn All rights
          reserved.<br />{this.context.intl.messages['app.footer.copyright']}
        </div>
      </div>
    );
  }
}

DxFooter.propTypes = {
  theme: PropTypes.string,
  hiddenLink: PropTypes.bool,   // 是否隐藏帮助中心/关于我们/问题反馈等链接
};

DxFooter.defaultProps = {
  theme: 'black',       // black/white
  hiddenLink: false,
};


export default DxFooter;
