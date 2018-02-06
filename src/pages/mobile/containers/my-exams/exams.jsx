import React, { Component } from 'react';
import api from 'utils/api';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';
import Pulltext from '../../../../components/pulltext';
import RefreshLoad from '../../components/refreshload';

const fetchSizeInit = 10;
const contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

class Exams extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      exams: [],
      fetchIndex: 0,
      fetchSize: fetchSizeInit,
      isFetching: false,
      isExamsDate: true,
      needPullUp: true,
      isTofetchData: false,
      key: 0,
    };
    this.fetchExamsList = ::this.fetchExamsList;
    this.setNavBar = ::this.setNavBar;
    this.pullDownCallBack = ::this.pullDownCallBack;
    this.pullUpCallBack = ::this.pullUpCallBack;
    this.refreshLoad = ::this.refreshLoad;
  }

  componentDidMount() {
    this.fetchExamsList();
  }

  componentWillUnmount() {
  }

  pullDownCallBack(cb) {
    this.refreshLoad(cb);
  }

  pullUpCallBack(cb) {
    this.fetchExamsList(cb);
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.exams.title'],
    });
  }

  refreshLoad(cb) {
    const self = this;
    api({
      url: '/training/quizs/my',
      params: {
        index: 1,
        size: self.state.fetchSize,
        type: 0,
      },
    }).then(function(resp) {
      const exams = resp.data;
      const isExamsDate = exams.length <= self.state.fetchSize;
      let needPullUp = true;
      if (exams.length < self.state.fetchSize) {
        needPullUp = false;
      }
      self.setState({
        fetchIndex: 1,
        exams: exams,
        isExamsDate: isExamsDate,
        needPullUp: needPullUp,
      }, cb);
    });
  }

  // 获取数据
  fetchExamsList(cb) {
    const self = this;
    const fetchIndex = self.state.fetchIndex + 1;
    // 请求
    function fetchList() {
      (async function fetchData() {
        const fetchExams = await api({
          url: '/training/quizs/my',
          params: {
            index: self.state.fetchIndex,
            size: self.state.fetchSize,
            type: 0,
          },
        });
        const exams = self.state.exams.concat(fetchExams.data);
        const isExamsDate = fetchExams.data.length === self.state.fetchSize;
        let needPullUp = true;
        if (fetchExams.data.length !== self.state.fetchSize) {
          needPullUp = false;
        }
        const rndNum = Math.random();
        self.setState({ exams, isExamsDate, needPullUp, isTofetchData: true, isFetching: false, key: rndNum });
        if (cb)
          cb();
      }());
    }

    self.setState({ fetchIndex, isFetching: true }, fetchList);
  }


  getLoadText() {
    if (!this.state.isExamsDate)
      return (
        <Pulltext isMore={this.state.isExamsDate} />
      )
    return '';
  }

  render() {
    this.setNavBar();

    if (this.state.exams.length > 0) {
      return (
        <RefreshLoad pullDownCallBack={this.pullDownCallBack} needPullUp={this.state.needPullUp}
                     pullUpCallBack={this.pullUpCallBack}>
          <div className="my-exams">
            <ul className="card card-horizontal">
              {this.state.exams.map((item, index) => {
                const linkTo = `/plan/${item.plan.id}/series/${item.solution_id || 0}/exams/${item.quiz_id}`;
                return (
                  <li key={index}>
                    <Link to={linkTo} style={{ color: '#333' }}>
                      <div className="card-img">
                        <img alt={item.name} src={item.img} />
                      </div>
                      <div className="card-text">
                        <p className="name">
                          {item.name}
                          {(() => {
                            if (item.finish_status === 1) {
                              const percentage = parseInt(item.score, 10);

                              if (item.pass_status === 1) {
                                if (item.score_type === 1) {
                                  return <span className="score passed">{ percentage } %</span>;
                                }
                                return <span className="score passed"><FormattedMessage id="app.myExams.points"
                                                                                        values={{ score: item.score.toString() }} /></span>;
                              }

                              if (item.score_type === 1) {
                                return <span className="score failed">{ percentage } %</span>;
                              }
                              return <span className="score failed"><FormattedMessage id="app.myExams.points"
                                                                                      values={{ score: item.score.toString() }} /></span>;
                            }
                            return null;
                          })() }
                        </p>
                        {(() => {
                          if (item.finish_status === 1) {
                            if (item.pass_status === 1) {
                              return <p className="pass-status passed"><FormattedMessage id="app.myExams.passed" /></p>;
                            }
                            return <p className="pass-status failed"><FormattedMessage id="app.myExams.failed" /></p>;
                          }

                          if (item.rest_chance > 0) {
                            return <p className="rest-chance"><FormattedMessage
                              id="app.myExams.restChance" values={{ chances: item.rest_chance }} /></p>;
                          } else if (item.rest_chance < 0) {
                            return <p className="rest-chance"><FormattedMessage
                              id="app.myExams.unlimitedRestChance" /></p>;
                          }

                          return null;
                        })() }
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {this.getLoadText()}
          </div>
        </RefreshLoad>
      );
    } else if (this.state.exams.length == 0) {
      return (
        <RefreshLoad needPullUp={false} key={this.state.key}>
          <div className="list-no-msg">
            <p><FormattedMessage id="app.myExams.noMsg" /></p>
          </div>
        </RefreshLoad>
      );
    }
    return null;
  }
}
Exams.contextTypes = contextTypes;
export default Exams;
