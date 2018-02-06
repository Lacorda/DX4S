import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Detail from './detail';
import Chapter from './chapter';
import Train from './train';

class Wrapper extends Component {

  componentDidMount() {
    const query = {
      plan_id: this.props.params.plan_id,
      solution_id: this.props.params.solution_id || 0,
      course_id: this.props.params.course_id,
    };
    // this.props.actions.fetchCourse(query);
    // this.props.actions.fetchAssement(query);
    this.props.actions.fetchChapter(query);
  }

  render() {
    const params = this.props.params;
    const location = this.props.location;
    return (
      <div>
        <Detail
          detail={this.props.course.detail}
          params={params}
        />
        <Train params={params} location={location} />
        <Chapter
          chapters={this.props.course.chapter}
          nodes={this.props.course.nodes}
          detail={this.props.course.detail}
          planId={this.props.course.detail.info.plan ? this.props.course.detail.info.plan.id : 0}
          solutionId={this.props.course.detail.info.solution_id}
          courseId={this.props.course.detail.info.course_id}
        />
      </div>
    );
  }
}

Wrapper.propTypes = {
  params: PropTypes.objectOf(PropTypes.string),
  actions: PropTypes.objectOf(PropTypes.func),
};

export default Wrapper;
