import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import messages from './messages';


const EXAMINATION = 8; // 考试
const SURVEY = 9; // 问卷
const COURSE = 10;  // 课程

const FINISH = 7; // 完成
const UNFINISH = 8; // 未完成

class SubCourse extends React.Component {
  constructor (...args) {
    super(...args);
    this.goToDetail = ::this.goToDetail;
  }

  goToDetail(link, query) {
    const router = this.context.router;
    router.push(router.createPath(link, query));
  }

  render() {
    const props = this.props;
    function getMarkString(nodetype) {
      let resultElement = '';
      switch (nodetype) {
        case EXAMINATION:
          resultElement = (
            <div className="status status-test">
              <FormattedMessage {...messages.test} />
            </div>
          );
          break;
        case SURVEY:
          resultElement = (
            <div className="status status-ques">
              <FormattedMessage {...messages.questionnaire} />
            </div>
          );
          break;
        case COURSE:
          resultElement = (
            <div className="status status-course">
              <FormattedMessage {...messages.course} />
            </div>
          );
          break;
        default:
          break;
      }
      return resultElement;
    }

    function getLink(item) {
      const planId = props.routeParams.plan_id;
      const solutionId = props.routeParams.solution_id;
      let tHref = '';
      switch (item.node_type) {
        case COURSE:
          tHref = `/plan/${planId}/series/${solutionId}/courses/${item.node_id}/nodes/${item.id}`;
          break;
        case EXAMINATION:
          tHref = `plan/${planId}/series/${solutionId}/exams/${item.node_id}/nodes/${item.id}`;
          break;
        case SURVEY:
          tHref = `plan/${planId}/series/${solutionId}/surveys/${item.node_id}/nodes/${item.id}`;
          break;
      }
      return tHref;
    }

    function getQuery(seriesInfo, node) {
      const query = {
        // 如果是共享学习，则planId带被共享的planId
        sharePlanId: seriesInfo.completed_in_plan != null ? seriesInfo.completed_in_plan.id : props.routeParams.plan_id,
        passStatus: node.status,
      };

      return query;
    }

    function getStatus(status, nodeType) {
      let statusElement = '';

      switch (status) {
        case FINISH:
          statusElement = (
            <div className="status-mark finish">
              <FormattedMessage {...messages.finish} />
            </div>
          );
          break;
        case UNFINISH:
          if (nodeType === EXAMINATION) {
            statusElement = (
              <div className="status-mark unfinish">
                <FormattedMessage {...messages.failed} />
              </div>
            );
          }
          else {
            statusElement = (
              <div className="status-mark unfinish">
                <FormattedMessage {...messages.unfinish} />
              </div>
            );
          }
          break;
        default:
          break;
      }
      return statusElement;
    }

    return (
      <div className="course-section">
        <div className="split"><FormattedMessage {...messages.sectionTitle} /></div>
        <div className="items">
          {


            props.items.map((item, index) => (
              <div className="item-line clearfix" key={index}>
                <div className="clearfix" onClick={() => this.goToDetail(getLink(item), getQuery(props.seriesInfo, item)) } >
                  <div className="bl" />
                  <div className="img">
                    <img src={item.node_cover_url} alt={item.node_name} />
                    {getMarkString(item.node_type)}
                  </div>
                  <div className="item-right">
                    <div className="title">
                      {item.node_name}
                    </div>
                    <div className="clearfix">
                      <div className="study-text">
                        <span className="icon"></span>
                        <FormattedMessage
                          {...messages.learncount}
                          values={{ study_count: <span>{item.study_count}</span> }}
                        />
                      </div>
                      {getStatus(item.status, item.node_type)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

      </div>
    );
  }
}

SubCourse.contextTypes = {
  router: React.PropTypes.object,
}

SubCourse.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    status: React.PropTypes.number,
    id: React.PropTypes.number,
    node_id: React.PropTypes.number,
    node_type: React.PropTypes.number,
    node_name: React.PropTypes.string,
    node_cover_url: React.PropTypes.string,
    has_read: React.PropTypes.number,
    study_count: React.PropTypes.number,
  })),
  routeParams: React.PropTypes.shape({
    plan_id: React.PropTypes.string,
    solution_id: React.PropTypes.string,
  }),
  seriesInfo: React.PropTypes.object,
};


export default SubCourse;
