import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RelativeLink } from 'react-router-relative-links';
import { FormattedMessage } from 'react-intl';

import { exams as examsActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const formatSeconds = (value) => {
  let theSecond = parseInt(value, 10);
  let theMinute = 0;
  let theHour = 0;
  if (theSecond > 60) {
    theMinute = parseInt(theSecond / 60, 10);
    theSecond = parseInt(theSecond % 60, 10);

    if (theMinute > 60) {
      theHour = parseInt(theMinute / 60, 10);
      theMinute = parseInt(theMinute % 60, 10);
    }
  }
  let result = `${parseInt(theSecond, 10)}″`;
  if (theMinute > 0) {
    result = `${parseInt(theMinute, 10)}′${result}`;
  }
  if (theHour > 0) {
    result = `${parseInt(theHour, 10)}:${result}`;
  }
  return result;
};

const recordPropTypes = {
  data: PropTypes.object.isRequired,
  status: PropTypes.bool.isRequired,
  passType: PropTypes.number.isRequired,
};

const Record = ({ data, status, passType }) => (
  <li className="record">
    <div className="record-score">
      <span className="score">{Math.round(data.score)}</span>
      <span className="score-unit">{passType === 1 ? '%' : <FormattedMessage {...messages.isShowUnit} />}</span>
    </div>
    <div className="record-spend">
      <i className="icon-time" />
      {formatSeconds(data.time_spend)}
    </div>
    <div className="record-create">{data.time}</div>
    {status ?
      <RelativeLink className="record-review" to={{ pathname: `review/${data.record_id}` }}><FormattedMessage {...messages.detail} /><i className="icon-enter" /></RelativeLink> : null
    }
  </li>
);

Record.propTypes = recordPropTypes;

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  records: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

class History extends Component {
  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsHistory(fetchParams);
  }

  render() {
    const { records } = this.props;
    const list = records.list || [];
    const status = records.reviewable;
    return (
      <div>
        {list.length ?
          <ul className="bgf mb100">
            {list.map(record => (
              <Record
                data={record}
                key={record.record_id}
                status={status}
                passType={records.passType}
              />
            ))}
          </ul> :
          <div className="no-history no-msg minh600 mb100">
            <p style={{ margin: 0 }}><FormattedMessage {...messages.historyEmply} /></p>
          </div>
        }
      </div>
    );
  }
}

History.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    records: state.exams.records || {},
    isFetching: state.exams.isFetching || false,
    fetchParams: {
      planId: ownProps.location.query.sharePlanId || ownProps.params.plan_id,
      solutionId: ownProps.params.solution_id,
      quizId: ownProps.params.quiz_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(examsActions, dispatch),
  }
))(History);
