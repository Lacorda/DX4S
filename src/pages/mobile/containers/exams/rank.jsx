import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';
import RefreshLoad from '../../components/refreshload';
import { exams as examsActions } from '../../actions';

import './styles.styl';
import userImg from './img/icon-user-img.png';
import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const rankItemPropTypes = {
  data: PropTypes.object.isRequired,
  rank: PropTypes.number.isRequired,
  passType: PropTypes.number.isRequired,
};

const RankItem = ({ data, rank, passType }) => {
  const rankClass = classnames({
    rank: true,
    pr: true,
    bgblue: data.rank === rank,
  });

  const scoreNumClass = classnames({
    'rank-score-num': true,
    red: [1, 2, 3].indexOf(data.rank) !== -1,
  });

  return (
    <li className={rankClass}>
      {data.rank === 1 && <i className="icon-NO1" />}
      {data.rank === 2 && <i className="icon-NO2" />}
      {data.rank === 3 && <i className="icon-NO3" />}
      {[1, 2, 3].indexOf(data.rank) === -1 && <i className="rank-NO">{data.rank}</i>}
      <img className="rank-img" src={data.img || userImg} alt="" />
      <p className="rank-name">{data.staff_name}</p>
      <p className="rank-spend">{data.time_spend}</p>
      <p className="rank-score">
        <span className={scoreNumClass}>{Math.round(data.score)}</span>
        <span className="rank-score-unit">{passType === 1 ? '%' : <FormattedMessage {...messages.isShowUnit} />}</span>
      </p>
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

  constructor() {
    super();
    this.pullDownCallBack = ::this.pullDownCallBack;
    this.state = { key: 0 };
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsRank(fetchParams).then(() => {
      const rndNum = Math.random();
      this.setState({ key: rndNum });
    });
    setNav(this.context.intl.messages['app.exams.title.rank']);
  }

  pullDownCallBack(cb) {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsRank(fetchParams).then(() => {
      cb();
    });
  }

  render() {
    const { ranks } = this.props;

    return (
      <RefreshLoad pullDownCallBack={this.pullDownCallBack} needPullUp={false} key={this.state.key}>
        <div className="exams">
          { (() => {
            if (!ranks.list) {
              return (
                <div className="no-rank no-msg">
                  <p style={{ margin: 0 }}><FormattedMessage {...messages.rankEmply} /></p>
                </div>
              );
            }

            if (Object.keys(ranks).length) {
              return (
                <div>
                  {
                    ranks.rank > 10 && (
                      <div className="rank-notify">
                        <FormattedMessage {...messages.notify} />
                      </div>
                    )
                  }
                  <ul className="rank-list">
                    {
                      ranks.list && ranks.list.map(rank => (
                        <RankItem
                          data={rank}
                          rank={ranks.rank}
                          key={rank.rank + rank.staff_name + rank.time_spend}
                          passType={ranks.passType}
                        />
                      ))
                    }
                  </ul>
                  {
                    ranks.rank > 10 && (
                      <div className="rank-footer">
                        <FormattedMessage {...messages.myBestGrade} />
                        <i className="b40 border-color-b1 mlr40" />
                        <FormattedMessage
                          {...messages.myGrade}
                          values={{
                            score: <span className="text-color-h1">{ranks.score}</span>,
                            enRank: <span className="ml24">NO.<span
                              className="text-color-h1">{ranks.rank}</span></span>,
                            zhRank: <span className="ml24">排名 <span
                              className="text-color-h1">{ranks.rank}</span> 名</span>,
                          }}
                        />
                      </div>
                    )
                  }
                </div>
              );
            }
            return null;
          })() }
        </div>
      </RefreshLoad>
    );
  }
}

Rank.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    ranks: state.exams.ranks || {},
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
))(Rank);
