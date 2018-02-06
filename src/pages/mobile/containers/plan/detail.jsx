import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RelativeLink } from 'react-router-relative-links';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { nav } from 'utils/dx';

import Ribbon from '../../../../components/ribbon';
import { staffTask as staffTaskActions } from '../../actions';

import './styles.styl';
import messages from './messages';
import iconDivider from './img/icon-divider.png';

const setNav = (title) => {
  nav.setTitle({
    title,
  });
};

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
    this.productType = {
      live: <FormattedMessage {...messages.live} />,
      course: <FormattedMessage {...messages.micro} />,
      series: <FormattedMessage {...messages.series} />,
      exam: <FormattedMessage {...messages.exam} />,
      solution: <FormattedMessage {...messages.series} />,
    };
    this.bgColor = {
      live: '#F84E4E',
      course: '#38ACFF',
      series: '#82C650',
      solution: '#82C650',
    };
    this.linkTo = ::this.linkTo;
  }

  componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchStaffTaskDetail(fetchParams);
    setNav(this.context.intl.messages['app.staffTask.title.detail']);
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
    if (Object.keys(detail).length === 0) return null;
    let expEl = null;
    const { gold, experience: exp } = detail;
    const shouldExpElShow = gold !== 0 || exp !== 0;
    if (shouldExpElShow) {
      expEl = (
        <div className="staffTask-detail-exp">
          <div className="left">
            <FormattedHTMLMessage
              {...messages.beforeTip}
              values={{ date: detail.end_time.slice(0, -3) }}
            />
          </div>
          <div className="middle">
            <img src={iconDivider} alt="" />
          </div>
          <div className="right">
            <FormattedHTMLMessage
              {...messages.reward}
              values={{ gold, exp }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="staffTask">
        {(() => {
          if (Object.keys(detail).length) {
            return (
              <div className="staffTask-detail">
                <header className="staffTask-detail-header">
                  <img alt="" src={detail.plan_img_url} className="play-img" />
                  <div className="play-name">{detail.plan_name}</div>
                </header>
                {expEl}
                <ul className="task-list">
                  {detail.my_task_items.map(item => (
                    <li className="task-item" key={item.task_id}>
                      <RelativeLink
                        to={item.is_lock ? '' : this.linkTo(item.task_type, item.task_id)}
                        className="task-href">
                        <div className="task-item-img" style={{ position: 'relative' }}>
                          <img className="task-item-img" alt="" src={item.task_img_url} />
                          {(() => {
                            if (item.task_type !== 'course') {
                              return (
                                <Ribbon
                                  text={this.productType[item.task_type]}
                                  backgroundColor={this.bgColor[item.task_type]}
                                />
                              );
                            }

                            return null;
                          })()}
                        </div>
                        <div className="task-item-info">
                          <div className="task-item-name">{item.task_name}</div>
                          {(() => {
                            if (item.is_lock) {
                              return <div className="task-item-lock">
                                <FormattedMessage {...messages.locked} /></div>;
                            } else if (item.pass_state === 'passed') {
                              return <div className="task-item-complete">
                                <FormattedMessage {...messages.completed} /></div>;
                            } else if (item.pass_state === 'inread') {
                              return <div className="task-item-inread">
                                <FormattedMessage {...messages.inread} /></div>;
                            }
                            return null;
                          })()}
                        </div>
                      </RelativeLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          return null;
        })()}
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
