import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { exams as examsActions } from '../../actions';

import './styles.styl';
import userImg from './img/icon-user-img.png';
import messages from './messages';

const rankItemPropTypes = {
  data: PropTypes.object.isRequired,
  rank: PropTypes.number.isRequired,
  passType: PropTypes.number.isRequired,
};

const RankItem = ({ data, rank, passType }) => {
  const rankClass = classnames({
    rank: true,
    pr: true,
    bgA0: data.rank === rank,
  });
  const rankScoreClass = classnames({
    'rank-score-active': data.rank === rank,
    'rank-score': data.rank !== rank,
    red: data.rank !== rank && [1, 2, 3].indexOf(data.rank) !== -1,
  });

  return (
    <li className={rankClass}>
      {data.rank === 1 ? <i className="icon-NO1" /> : null}
      {data.rank === 2 ? <i className="icon-NO2" /> : null}
      {data.rank === 3 ? <i className="icon-NO3" /> : null}
      {[1, 2, 3].indexOf(data.rank) === -1 ? <i className={data.rank === rank ? 'rank-NO-active' : 'rank-NO'}>{data.rank}</i> : null}
      <img className="rank-img" src={data.img || userImg} alt="" />
      <div className={data.rank === rank ? 'rank-name-active' : 'rank-name'}>{data.staff_name}</div>
      <div className={data.rank === rank ? 'rank-spend-active' : 'rank-spend'}><i className={data.rank === rank ? 'icon-time-active' : 'icon-time'} />{data.time_spend}</div>
      <div className={rankScoreClass}>
        <span className="rank-score-num">{Math.round(data.score)}</span>
        <span className="rank-score-unit">{passType === 1 ? '%' : <FormattedMessage {...messages.isShowUnit} />}</span>
      </div>
    </li>
  );
};

RankItem.propTypes = rankItemPropTypes;

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  ranks: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

class Rank extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsRank(fetchParams);
  }

  render() {
    const { ranks } = this.props;

    return (
      <div>
        {(() => {
          if (!ranks.list) {
            return (
              <div className="no-rank no-msg minh600 mb100">
                <p style={{ margin: 0 }}><FormattedMessage {...messages.rankEmply} /></p>
              </div>
            );
          }

          if (Object.keys(ranks).length) {
            return (
              <div className="mb100">
                <ul className="rank-list">
                  {ranks.list ? ranks.list.map(rank => (
                    <RankItem
                      data={rank}
                      rank={ranks.rank}
                      key={rank.rank + rank.staff_name + rank.time_spend}
                      passType={ranks.passType}
                    />
                  )) : null}
                </ul>
                {ranks.rank > 10 ?
                  <div className="rank-footer">
                    <i className="icon-bestgrade" />
                    <FormattedMessage {...messages.myBestGrade} />
                    <i className="b40 mlr40" />
                    <span className="text-color-Z1">
                      <FormattedMessage
                        {...messages.myGrade}
                        values={{
                          score: <span key="msg1" className="text-color-A1">{ranks.score}</span>,
                          enRank: <span key="msg2">,&nbsp;&nbsp;&nbsp;NO.<span className="text-color-A1">{ranks.rank}</span></span>,
                          zhRank: <span key="msg3">,&nbsp;&nbsp;&nbsp;排名 <span className="text-color-A1">{ranks.rank}</span> 名</span>,
                        }}
                      />
                    </span>
                  </div> : null
                }
              </div>
            );
          }
          return null;
        })()}
      </div>
    );
  }
}

Rank.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    ranks: state.exams.ranks || {},
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
))(Rank);
