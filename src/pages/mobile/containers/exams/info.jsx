import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loading from 'react-loading';
import { RelativeLink } from 'react-router-relative-links';
import { FormattedMessage } from 'react-intl';
import { nav } from 'utils/dx';
import { Confirm } from 'components/modal';

import { exams as examsActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  queryParams: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
};

class Info extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.closeConfirm = this.closeConfirm.bind(this);
    this.openConfirm = this.openConfirm.bind(this);
    this.handleArrange = this.handleArrange.bind(this);
    this.state = {
      isConfirmOpen: false,
    };
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchExamsInfo(fetchParams);
    setNav(this.context.intl.messages['app.exams.title.info']);
  }

  handleArrange() {
    const { info, fetchParams, actions } = this.props;
    const data = {
      is_arranged: !info.arrange,
    };
    actions.fetchExamsPlan(fetchParams, data);
    this.closeConfirm();
  }

  closeConfirm() {
    this.setState(Object.assign({}, this.state, {
      isConfirmOpen: false,
    }));
  }

  openConfirm() {
    this.setState(Object.assign({}, this.state, {
      isConfirmOpen: true,
    }));
  }

  render() {
    const { info, isFetching, fetchParams, queryParams } = this.props;
    const confirmMsgId = info.arrange ? 'msgWithdraw' : 'msgEnroll';
    const setRange = () => {
      const isRange = !info.source &&
        info.plan_type === 1 &&
        (info.rest_chance > 0 || info.rest_chance === -1);

      if (!isRange) {
        return null;
      }
      if (info.arrange) {
        return <a className="info-opt info-opt-withdraw" onClick={this.openConfirm} ><FormattedMessage id="app.exams.withdraw" /></a>;
      }
      return <a className="info-opt info-opt-enroll" onClick={this.openConfirm} ><FormattedMessage id="app.exams.enroll" /></a>;
    };
    return (
      <div className="exams">
        {(() => {
          if (isFetching) {
            return (
              <div className="loading-center">
                <Loading type="balls" color="#38acff" />
              </div>
            );
          }

          if (info.errorCode === 400) {
            return (
              <h3 className="revocation">
                {info.message}
              </h3>
            );
          }

          if (Object.keys(info).length) {
            const sec = info.time % 60;
            const sourcePath = info.source && {
              course: `/plan/${fetchParams.planId}/series/${fetchParams.solutionId}/courses/${info.source.id}/detail`,
              solution: `/plan/${fetchParams.planId}/series/${info.source.id}`,
            };
            // 共享学习取被共享的plan_id
            const planId = queryParams.sharePlanId || fetchParams.planId;
            const toRank = `/plan/${planId}/series/${fetchParams.solutionId}/exams/${fetchParams.quizId}/rank`;
            const toHistory = `/plan/${planId}/series/${fetchParams.solutionId}/exams/${fetchParams.quizId}/history`;

            return (
              <div className="info">
                <img alt="" src={info.img_url} className="info-cover" />
                <div className="info-body" >
                  <div className="bb bgf plr24 pt32">
                    <div className="info-title">
                      <h4 className="info-name">{info.name}</h4>
                      {setRange()}
                    </div>
                    <p className="info-staff"><FormattedMessage {...messages.joinCount} values={{ count: info.staff_count || '0' }} /></p>
                    <p className="info-standard">
                      <FormattedMessage {...messages.passStandard} />{info.standard}
                      {info.have_try_count ?
                        <span className="info-best"><FormattedMessage {...messages.bestGrade} />{info.best}{info.pass_type === 'score' ? <FormattedMessage {...messages.isShowUnit} /> : '%' }</span> : null
                      }
                    </p>
                  </div>
                  <div className="pt24 pb32 plr24 bgf mb16 pr">
                    <div className="mb16 lh24">
                      <p className="info-time mr64"><i className="icon-time" /><FormattedMessage {...messages.duration} values={{ sec, unitEn: sec ? 'seconds' : '', unitZh: sec ? '秒' : '', minutes: Math.floor(info.time / 60) }} /></p>
                      <p className="info-exercise"><i className="icon-count" /><FormattedMessage {...messages.quantity} values={{ count: info.exercise_count }} /></p>
                    </div>
                    <p className="info-try cB2"><i className="icon-try" />{info.try_count === -1 ? <FormattedMessage {...messages.chancesLimitless} /> : <FormattedMessage {...messages.chances} values={{ count: info.try_count || '0' }} />}</p>
                    {
                      info.rest_chance === 0 && <FormattedMessage
                        {...messages.isPass}
                        values={{ enIsPass: <i className={info.pass_status === 1 ? 'en-icon-pass' : 'en-icon-no-pass'} />, zhIsPass: <i className={info.pass_status === 1 ? 'icon-pass' : 'icon-no-pass'} /> }}
                      />
                    }
                  </div>
                  {
                    info.source && (
                      <RelativeLink to={sourcePath[info.source.type]}>
                        <div className="plr24 lh96 bgf pr">
                          <h4 className="info-source-name"><FormattedMessage {...messages.examFrom} values={{ name: info.source.name }} /></h4><i className="icon-enter" />
                        </div>
                      </RelativeLink>
                    )
                  }
                </div>
                <div className="info-footer">
                  {(() => {
                    if (info.have_try_count !== 0) {
                      return <RelativeLink to={toHistory} className="history"><FormattedMessage {...messages.history} /></RelativeLink>;
                    }
                    return <a className="history disabled"><FormattedMessage {...messages.history} /></a>;
                  })()}
                  {(() => {
                    if (info.rest_chance !== 0) {
                      return <RelativeLink to="./process" className="start">{info.rest_chance === -1 ? <FormattedMessage {...messages.enterTheExamLimitless} /> : <FormattedMessage {...messages.enterTheExamChances} values={{ chances: info.rest_chance }} />}</RelativeLink>;
                    }
                    return <a className="start disabled"><FormattedMessage {...messages.enterTheExamChances} values={{ chances: '0' }} /></a>;
                  })()}
                </div>
                <FormattedMessage {...messages.rank} values={{ en: <RelativeLink className="info-rank en" to={toRank} />, zh: <RelativeLink className="info-rank zh" to={toRank} /> }} />
              </div>
            );
          }
          return null;
        })()}
        <Confirm
          shouldCloseOnOverlayClick={false}
          isOpen={this.state.isConfirmOpen}
          onRequestClose={() => { }}
          onConfirm={this.handleArrange}
          confirmButton={<span><FormattedMessage {...messages.btnOk} /></span>}
          cancelButton={<span><FormattedMessage {...messages.btnCancel} /></span>}
        >
          <span>
            <FormattedMessage
              {...messages[confirmMsgId]}
            />
          </span>
        </Confirm>
      </div>
    );
  }
}

Info.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    info: state.exams.info || {},
    isFetching: state.exams.isFetching || false,
    fetchParams: {
      planId: ownProps.params.plan_id,
      solutionId: ownProps.params.solution_id,
      quizId: ownProps.params.quiz_id,
    },
    queryParams: {
      sharePlanId: ownProps.location.query.sharePlanId,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(examsActions, dispatch),
  }
))(Info);
