import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import api from 'utils/api';
import { setTitle } from 'utils/dx/nav';
import messages from '../messages';


class PlanDetail extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      start: '',
      end: '',
      course_num: 0,
      user_num: 0,
    };

    this.toCourseDetail = ::this.toCourseDetail;
    this.toUserDetail = ::this.toUserDetail;
  }

  async componentDidMount() {
    setTitle({ title: this.context.intl.messages['app.distribution.detail.title'] });
    const { params } = this.props;
    const { data } = await api({
      url: '/training/training-plan/detail',
      params: { id: params.plan_id },
    });
    this.setState(data); // eslint-disable-line react/no-did-mount-set-state
  }

  toCourseDetail() {
    const { params } = this.props;
    this.context.router.push(`distribution/required/${params.plan_id}/courses`);
  }

  toUserDetail() {
    if (!this.state.user_num) return;
    const { params } = this.props;
    this.context.router.push(`distribution/required/${params.plan_id}/users`);
  }

  render() {
    const { name, user_num, course_num, start, end } = this.state;
    return (
      <ul className="dx-list dx-list-form">
        <li>
          <FormattedMessage {...messages.planTitle} />
          <span>{name}</span>
        </li>
        <li>
          <FormattedMessage {...messages.startTime} />
          <span>{start}</span>
        </li>
        <li>
          <FormattedMessage {...messages.endTime} />
          <span>{end}</span>
        </li>
        <li
          className="list-indie arrow-right"
          onClick={this.toUserDetail}
        >
          <FormattedMessage {...messages.userCount} />
          <FormattedMessage {...messages.users} values={{ num: user_num }} />
        </li>
        <li className="arrow-right" onClick={this.toCourseDetail}>
          <FormattedMessage {...messages.courseCount} />
          <FormattedMessage {...messages.courses} values={{ num: course_num }} />
        </li>
      </ul>
    );
  }
}

const { object } = React.PropTypes;
PlanDetail.propTypes = {
  params: object, // eslint-disable-line react/forbid-prop-types
};

PlanDetail.contextTypes = {
  intl: object,
  router: object,
};

export default PlanDetail;
