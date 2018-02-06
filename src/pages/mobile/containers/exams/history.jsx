import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loading from 'react-loading';
import { nav } from 'utils/dx';
import { RelativeLink } from 'react-router-relative-links';
import { FormattedMessage } from 'react-intl';

import { exams as examsActions } from '../../actions';
import RefreshLoad from '../../components/refreshload';

import './styles.styl';
import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const recordPropTypes = {
  data: PropTypes.object.isRequired,
  status: PropTypes.bool.isRequired,
  passType: PropTypes.number.isRequired,
};

const Record = ({ data, status, passType }) => (
  <li className="record pr">
    <div className="record-score">
      <span className="score">{Math.round(data.score)}</span>
      <span className="score-unit">{passType === 1 ? '%' : <FormattedMessage {...messages.isShowUnit} />}</span>
    </div>
    <i className="br48" />
    <div className="record-time">
      <p className="record-spend"><i className="icon-time" />
        <FormattedMessage
          {...messages.minutesSeconds}
          values={{
            minutes: Math.floor(data.time_spend / 60) || '0',
            seconds: data.time_spend % 60 || '0',
          }}
        />
      </p>
      <p className="record-create">{data.time}</p>
    </div>
    {status ?
      <RelativeLink
        className="record-review"
        to={{ pathname: `../review/${data.record_id}` }}
      ><FormattedMessage {...messages.detail} /></RelativeLink> : null
    }
  </li>
);

Record.propTypes = recordPropTypes;

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  records: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
};

class History extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor() {
    super();
    this.state = { key: 0 };
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsHistory(fetchParams).then(() => {
      const rndNum = Math.random();
      this.setState({ key: rndNum });
    });
    this.pullDownCallBack = ::this.pullDownCallBack;
    setNav(this.context.intl.messages['app.exams.title.history']);
  }

  pullDownCallBack(cb) {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsHistory(fetchParams).then(() => {
      cb();
    });
  }

  render() {
    const { records, isFetching } = this.props;
    const list = records.list || [];
    const status = records.reviewable;
    return (
      <RefreshLoad pullDownCallBack={this.pullDownCallBack} needPullUp={false} key={this.state.key}>
        <div className="exams">
          { (() => {
            if (isFetching) {
              return (
                <div className="loading-center">
                  <Loading type="balls" color="#38acff" />
                </div>
              );
            }
            if (list.length) {
              return (
                <ul>
                  {
                    list.map(record => (
                      <Record
                        data={record}
                        key={record.record_id}
                        status={status}
                        passType={records.passType}
                      />
                    ))
                  }
                </ul>
              );
            }
            return null;
          })() }
        </div>
      </RefreshLoad>
    );
  }
}

History.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    records: state.exams.records || {},
    isFetching: state.exams.isFetching || false,
    fetchParams: {
      planId: ownProps.params.plan_id,
      solutionId: ownProps.params.solution_id,
      quizId: ownProps.params.quiz_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(examsActions, dispatch),
  }
))(History);
