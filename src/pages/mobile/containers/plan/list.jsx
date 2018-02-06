import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RelativeLink } from 'react-router-relative-links';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';

import { staffTask as staffTaskActions } from '../../actions';
import RefreshLoad from '../../components/refreshload';
import Pulltext from '../../../../components/pulltext';
import './styles.styl';

import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const taskPropTypes = {
  data: PropTypes.object.isRequired,
};

const Task = ({ data }) => (
  <li className="task-item">
    <RelativeLink to={{ pathname: `./detail/${data.plan_id}` }} className="task-href">
      <img className="task-item-img" alt="" src={data.img_url} />
      <div className="task-item-info">
        <div className="task-item-name">{data.plan_name}</div>
        <div className="task-item-finishRate"><FormattedMessage {...messages.rateOfProgress} />: {data.finish_rate}%</div>
        <div className="task-item-time"><FormattedMessage {...messages.endTime} />: {data.end_time}</div>
      </div>
      <i className="icon-enter" />
    </RelativeLink>
  </li>
);

Task.propTypes = taskPropTypes;

const propTypes = {
  tasks: PropTypes.array.isRequired,
  page: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

class List extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.pullDownCallBack = ::this.pullDownCallBack;
    this.pullUpCallBack = ::this.pullUpCallBack;
    this.state = { key: 0 };
  }

  componentDidMount() {
    const { actions } = this.props;
    const self = this;
    actions.resetStaffTaskPage();
    actions.fetchStaffTaskList().then(() => {
      const rndNum = Math.random();
      self.setState({ key: rndNum });
    });
    setNav(this.context.intl.messages['app.staffTask.title.list']);
  }

  pullDownCallBack(cb) {
    const { actions } = this.props;
    actions.resetStaffTaskPage();
    actions.fetchStaffTaskList().then(() => {
      cb();
    });
  }

  pullUpCallBack(cb) {
    const { actions } = this.props;
    actions.nextStaffTaskPage();
    actions.fetchStaffTaskList().then(() => {
      cb();
    });
  }

  render() {
    const { tasks, page } = this.props;
    return (
      <div className="staffTask">
        {(() => {
          if (tasks.length) {
            return (
              <RefreshLoad
                needPullUp={!page.end}
                pullDownCallBack={this.pullDownCallBack}
                pullUpCallBack={this.pullUpCallBack}
                key={this.state.key}
              >
                <ul className="task-list">
                  {
                    tasks.map((task, index) => (
                      <Task data={task} key={index} />
                    ))
                  }
                </ul>
                {page.end && <Pulltext isMore={false} />}
              </RefreshLoad>
            );
          }
          return null;
        })()}
      </div>
    );
  }
}

List.propTypes = propTypes;

export default connect(state => (
  {
    tasks: state.staffTask.tasks || [],
    page: state.staffTask.page || {},
  }
), dispatch => (
  {
    actions: bindActionCreators(staffTaskActions, dispatch),
  }
))(List);
