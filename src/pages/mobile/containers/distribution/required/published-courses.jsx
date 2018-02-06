import React, { Component } from 'react';

import Course from './course';

class PublishedCourses extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { courses } = this.props;
    if (!courses) return null;
    return (
      <ul className="dx-list">
        { courses.map(course =>
          (<Course
            viewOnly
            readOnly
            key={course.id}
            {...course}
          />))
        }
      </ul>
    );
  }
}
const { arrayOf, object } = React.PropTypes;
PublishedCourses.propTypes = { courses: arrayOf(object) };

export default PublishedCourses;
