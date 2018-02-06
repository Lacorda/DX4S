import React, { Component, PropTypes } from 'react';
import Connect from '../../../connect';
import classNames from 'classnames';
import { RelativeLink } from 'react-router-relative-links';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import { Link } from 'react-router';

const propTypes = {
  params: PropTypes.object.isRequired,
};

function getTrainDetail(detail) {
  // pass_type 1：学，2：练，3：用 ,
  let trainDetail = null;
  let line = null;
  let notSupport = null;
  let msgKey = null;
  let msgVal = null;

  msgKey = `msgTrainLearn${detail.pass_type}${detail.learning_type}`;
  if (detail.learning_type === 1) {
    msgVal = { num: detail.total_learn_num + '' };
  } else {
    msgVal = { num: detail.finish_learn_num + '', total: detail.total_learn_num + '' };
  }

  line = (
    <p>
      <FormattedMessage
        {...messages[msgKey]}
        values={msgVal}
      />
    </p>
  );

  if (detail.pass_type === 3) {
    notSupport = (
      <p className="not-support"><FormattedMessage id="app.course.trainNotSupport" /></p>
    );
  }

  trainDetail =
    (
      <div className="train-detail">
        {line}
        {notSupport}
      </div>
    );

  return trainDetail;
}

function getTrainStatus(readState) {
  // read_state 课程阅读状态，
  // 0：未开始，1：在读，2：未开始挑战，3：正在挑战，4:挑战失败，
  // 5：未考试，6：在考试，7：已完成，8：失败，9：失效 ,

  if (readState < 2) {
    return {
      state: true,
      lock: true,
    };
  }

  if (readState === 4) {
    return {
      state: true,
      fail: true,
    };
  }

  if (readState > 4) {
    return {
      state: true,
      done: true,
    };
  }

  return {
    state: true,
    go: true,
  };
}

function getLockInof(isLock, infoId) {
  let line = null;
  if (isLock) {
    line = (
      <div className="lock-info"><FormattedMessage {...messages[infoId]} /></div>
    );
  }
  return line;
}

function getTrainCls(passType) {
  return {
    'widget-body': true,
    'body-box': passType !== 3,
  };
}

function getTrain(params, detail, nodes) {
  // pass_type 1：学，2：练，3：用 ,
  if (detail.pass_type === undefined) {
    return null;
  }

  if (detail.pass_type === 0) {
    return null;
  }

  const trainDetail = getTrainDetail(detail);
  const lockBox = getLockInof(detail.read_state <= 1, 'msgLockTrain');
  let trainLink = null;

  if (detail.read_state > 1) {
    switch(detail.pass_type) {
      case 1:
        let notReadNote = null;
        let query = null;
        let i = 0;
        let firstNode = null;

        for (const o in nodes) {
          if (i === 0) {
            firstNode = nodes[o];
          }
          i++;
          // if (detail.read_state === 0 || detail.read_state > 1) {
          if (detail.pass_state === 2) {
            notReadNote = nodes[o];
            break;
          }

          if (nodes[o].done === 0) {
            notReadNote = nodes[o];
            break;
          }
        }
        if (notReadNote === null) {
          notReadNote = firstNode;
        }
        const nodeLink = `/preview/plan/${params.plan_id}/series/${params.solution_id || 0}/courses/${params.course_id}`; //getNodeLink(params, notReadNote);
        if (notReadNote) {
          query = {
            node_id: notReadNote.id,
          };
        }
        trainLink = (<Link className="train" to={nodeLink} query={query}>{trainDetail} <p className={classNames(getTrainStatus(detail.read_state))}></p></Link>);
        break;
      case 2:
        const  practiceLink = `/plan/${params.plan_id}/series/${params.solution_id || 0}/courses/${params.course_id}/training`;
        trainLink = (<RelativeLink className="train" to={practiceLink}> {trainDetail} <p className={classNames(getTrainStatus(detail.read_state))}></p> </RelativeLink>);
        break;
      case 3:
        trainLink = (<a className="train" href="javascript:;"> {trainDetail} <p className={classNames(getTrainStatus(detail.read_state))}></p> </a>);
        break;
    }
  } else {
    trainLink = (<a className="train" href="javascript:;"> {trainDetail} <p className={classNames(getTrainStatus(detail.read_state))}></p> </a>);
  }

  return (
    <div className="widget">
      <div className="widget-header">
        <span><FormattedMessage id="app.course.train" /></span>
        {lockBox}
      </div>
      <div className={classNames(getTrainCls(detail.pass_type))}>
        {trainLink}
      </div>
    </div>
  );
}

function getExamStatus(readState) {
  if (readState < 5) {
    return {
      state: true,
      lock: true,
    };
  }

  if (readState === 7) {
    return {
      state: true,
      success: true,
    };
  }

  if (readState > 7) {
    return {
      state: true,
      fail: true,
    };
  }

  return {
    state: true,
    go: true,
  };
}

function getExam(params, assessment, detail, location) {
  if (assessment.quiz == null) {
    return null;
  }

  const lockBox = getLockInof(assessment.read_state < 5, 'msgLockExam');
  let examLink = '';
  let query = {
    // 如果是共享学习，则planId带被共享的planId
    sharePlanId: detail.completed_in_plan != null ? detail.completed_in_plan.id : params.plan_id,
  };

  if (detail.completed_in_plan === null && location && location.query) {
    if (location.query.sharePlanId) {
      query = {
        sharePlanId: location.query.sharePlanId,
      };
    }
  }

  if (assessment.read_state >= 5) {
    examLink = `/plan/${params.plan_id}/series/${params.solution_id || 0}/exams/${assessment.quiz.id}`;
  }

  return (
    <div className="widget">
      <div className="widget-header">
        <span><FormattedMessage id="app.course.exam" /></span>
        {lockBox}
      </div>
      <div className="widget-body body-box">
        <RelativeLink className="exam" to={examLink} query={query}>
          <p className="exam-title">{assessment.quiz.name}</p>
          <p className={classNames(getExamStatus(assessment.read_state))}></p>
        </RelativeLink>
      </div>
    </div>
  );
}

function getStudyStatus(readState) {
  if (readState > 1) {
    return {
      state: true,
      done: true,
    };
  }

  return null;
}

class Train extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const params = this.props.params;
    const assessment = this.props.course.assessment.info;
    const nodes = this.props.course.nodes;
    const detail = this.props.course.detail.info;
    const location = this.props.location;


    return (
      <div>
        {/*<div className="widget">
          <div className="widget-header">
            <FormattedMessage id="app.course.learn" />
          </div>
          <div className="widget-body body-box">
            <a className="study">
              <div className="study-detail">
                <p><FormattedMessage id="app.course.learnMsg" /></p>
              </div>
              <p className={classNames(getStudyStatus(assessment.read_state))}></p>
            </a>
          </div>
        </div>*/}
        {
          (() => {
            const train = getTrain(params, assessment, nodes);
            const exam = getExam(params, assessment, detail, location);
            return (
              <div>
                {train}
                {exam}
              </div>
            );
          })()
        }
      </div>
    );
  }
}

export default Connect(Train);
