import React from 'react';
import { connect } from 'react-redux';

import Practice from '../practice';

function PracticeBreakPoint(props) {
  return (
    <Practice
      afterSubmitBtn
      indexOfPractice={props.indexOfPractice}
      params={{ ...props.queryParams }}
      afterSubmit={props.afterSubmit}
    />
  );
}

PracticeBreakPoint.propTypes = {
  // state
  queryParams: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  // props
  afterSubmit: React.PropTypes.func,
  indexOfPractice: React.PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  queryParams: {
    plan_id: state.preview.plan_id,
    course_id: state.preview.course_id,
    solution_id: state.preview.solution_id,
    node_id: state.preview.node_id,
  },
});

export default connect(mapStateToProps)(PracticeBreakPoint);
