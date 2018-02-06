import React from 'react';
import { setTitle } from 'utils/dx/nav';

import composeComponent from './compose-component';
import PublishedCourses from './published-courses';

class CourseDetail extends React.Component {
  componentDidMount() {
    setTitle({ title: this.context.intl.messages['app.distribution.detail.course.title'] });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { plan_id: planId } = this.props.params;
    const ComposedPublishedCourse = composeComponent({
      url: `/training/training-plan/get-plan-task-list?planId=${planId}`,
      handler: ({ data }) => ({ courses: data.tasks }),
    });
    return <ComposedPublishedCourse component={PublishedCourses} />;
  }
}
const { object } = React.PropTypes;
CourseDetail.propTypes = {
  params: object, // eslint-disable-line react/forbid-prop-types
};
CourseDetail.contextTypes = {
  intl: object,
};

export default CourseDetail;
