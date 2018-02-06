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

const propTypes = {
  fetchParams: PropTypes.object.isRequired,
  detail: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

class Detail extends Component {
  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.linkTo = ::this.linkTo;

    this.productType = {
      live: messages.live.id,
      course: messages.micro.id,
      series: messages.series.id,
      exam: messages.exam.id,
      solution: messages.series.id,
    };
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchStaffTaskDetail(fetchParams);
  }

  linkTo(type, id) {
    const { fetchParams: { planId } } = this.props;
    const urls = {
      course: `/plan/${planId}/series/0/courses/${id}`,
      exam: `/plan/${planId}/series/0/exams/${id}`,
      solution: `/plan/${planId}/series/${id}`,
      series: `/plan/${planId}/series/${id}`,
    };
    return urls[type];
  }

  render() {
    const { detail } = this.props;
    return (
      <div>
        <DxHeader />
        <div className="staffTask">
          {(() => {
            if (Object.keys(detail).length) {
              return (
                <div className="staffTask-detail">
                  <div className="staffTask-header">
                    <img alt="" src={detail.plan_img_url} className="play-img" />
                    <div className="play-name">{detail.plan_name}</div>
                  </div>
                  <ul className="tabs">
                    <li className="tab active"><FormattedMessage {...messages.contents} /></li>
                  </ul>
                  <ul className="staffTask-list">
                    {detail.my_task_items.map(item => (
                      <li className="staffTask-item" key={item.task_id}>
                        <RelativeLink to={item.is_lock ? '' : this.linkTo(item.task_type, item.task_id)} className="task-href">
                          <img className="staffTask-item-img" alt="" src={item.task_img_url} />
                          {
                            (() => {
                              if (item.task_type === 'course') {
                                return null;
                              }

                              return (
                                <div className={`corner ${item.task_type}`}>
                                  {this.context.intl.messages[this.productType[item.task_type]]}
                                </div>
                              );
                            })()
                          }
                          <div className="staffTask-item-info">
                            <div className="staffTask-item-name">{item.task_name}{item.is_lock ? <i className="staffTask-item-lock" /> : <i className="staffTask-item-unlock" />}</div>
                            <div className="staffTask-item-count">{item.finish_count}<FormattedMessage {...messages.haveBeenLearning} /></div>
                          </div>
                          {item.pass_state === 'passed' ? <div className="staffTask-item-complete" /> : null}
                        </RelativeLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return null;
          })()}
          <DxFooter />
        </div>
      </div>
    );
  }
}

Detail.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    detail: state.staffTask.detail || {},
    fetchParams: {
      planId: ownProps.params.plan_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(staffTaskActions, dispatch),
  }
))(Detail);
