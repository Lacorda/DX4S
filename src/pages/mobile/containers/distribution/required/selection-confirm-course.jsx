import React from 'react';
import { connect } from 'react-redux';

import * as selectors from './selectors';
import PublishedCourses from './published-courses';

function ConfirmCourse({ courses }) {
  return (
    <PublishedCourses courses={courses} />
  );
}

const { arrayOf, object } = React.PropTypes;
ConfirmCourse.propTypes = {
  courses: arrayOf(object),
};

const mapStateToProps = state => ({
  courses: selectors.selectedCoursesSelector(state),
});

export default connect(mapStateToProps)(ConfirmCourse);
