import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class HotListHeader extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { title, link, hasMore } = this.props;
    return (
      <div className="dx-hot-list-title">
        <div className="title">{title}</div>
        {hasMore ? <Link to={link} className="more">{this.context.intl.messages['app.home.title.more']}
          <small>&gt;</small>
        </Link> : null}
      </div>
    );
  }
}

HotListHeader.propTypes = {
  title: PropTypes.string,
  hasMore: PropTypes.bool,   // 是否显示“更多 >”
  link: PropTypes.string,
};

HotListHeader.defaultProps = {
  hasMore: true,
};

export default HotListHeader;
