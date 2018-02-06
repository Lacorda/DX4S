import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setHasRead } from 'dxActions/preview';

import { isNodePassed } from './selectors';

import Survey from '../survey';

const propTypes = {
  nodes: PropTypes.object,
  currentParams: PropTypes.object,
  currentNodeId: PropTypes.string,
  setHasRead: PropTypes.func,
  isNodePassed: PropTypes.bool,
};

class SurveyPreviewer extends Component {
  constructor(props) {
    super(props);
    this.afterSubmit = ::this.afterSubmit;
  }

  afterSubmit() {
    if (this.props.isNodePassed) return;
    this.props.setHasRead();
  }

  render() {
    const { currentNodeId, nodes, currentParams } = this.props;

    const sueveyParams = { ...currentParams,
      survey_id: nodes[currentNodeId].res_id,
      chap_id: nodes[currentNodeId].chapter_id,
      chap_node_id: currentNodeId,
    };

    return (
      <div>
        <Survey params={sueveyParams} afterSubmit={this.afterSubmit} />
      </div>
    );
  }
}

SurveyPreviewer.propTypes = propTypes;

const mapStateToProps = state => ({
  currentParams: {
    plan_id: state.preview.plan_id,
    course_id: state.preview.course_id,
    solution_id: state.preview.solution_id,
  },
  currentNodeId: state.preview.node_id,
  nodes: state.course.nodes,
  isNodePassed: isNodePassed(state),
});

const mapDispatchToProps = {
  setHasRead,
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyPreviewer);
