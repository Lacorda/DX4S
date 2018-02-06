import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class Cultivate extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { id, name, deadline, rate, moreLink } = this.props;
    return (
      <div className="cultivate">
        <div className="dx-container">
          <Link to={moreLink} className="more">{this.context.intl.messages['app.home.title.more']}
            <small>&gt;</small>
          </Link>
          <div className="cultivate-icon">&nbsp;</div>
          <Link to={`/staffTask/detail/${id}`} className="cultivate-link">
            <ul className="cultivate-course">
              <li>
                <div className="wrap">
                  <span className="text cultivate-course-name">{name}</span>
                </div>
              </li>
              <li>
                <div className="wrap">
                  <span className="text cultivate-course-deadline">{this.context.intl.messages['app.home.cultivate.deadline']}：{deadline}</span>
                </div>
              </li>
              <li>
                <div className="wrap">
                  <span className="text cultivate-course-rate">{this.context.intl.messages['app.home.cultivate.rate']}：{rate}%</span>
                </div>
              </li>
            </ul>
          </Link>
        </div>
      </div>
    );
  }
}

Cultivate.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  deadline: PropTypes.string,
  rate: PropTypes.number,
  moreLink: PropTypes.string,
};

export default Cultivate;
