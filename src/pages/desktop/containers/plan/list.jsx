import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RelativeLink } from 'react-router-relative-links';
import { FormattedMessage } from 'react-intl';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';

import { staffTask as staffTaskActions } from '../../actions';
import './styles.styl';

import messages from './messages';

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
  constructor(props, context) {
    super(props, context);
    this.nextPage = ::this.nextPage;
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.resetStaffTaskPage();
    actions.fetchStaffTaskList();
  }

  nextPage() {
    const { actions } = this.props;
    actions.nextStaffTaskPage();
    actions.fetchStaffTaskList();
  }

  render() {
    const { tasks, page } = this.props;
    return (
      <div>
        <DxHeader />
        <div className="staffTask">
          <div className="staff-header">
            <div className="staff-header-container">
              <div className="staff-title"><i className="icon-task" /><FormattedMessage {...messages.listTitle} /></div>
            </div>
          </div>
          {(() => {
            if (tasks.length) {
              return (
                <ul className="task-list">
                  {
                    tasks.map((task, index) => (
                      <Task data={task} key={index} />
                    ))
                  }
                </ul>
              );
            }
            return null;
          })()}
          <div className="staff-footer">
            {page.end ?
              <div className="staff-next disable" onClick={this.nextPage}><FormattedMessage {...messages.noMore} /></div> :
              <div className="staff-next" onClick={this.nextPage}><FormattedMessage {...messages.loadMore} /></div>
            }
          </div>
        </div>
        <DxFooter />
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
