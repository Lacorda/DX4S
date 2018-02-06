import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { passTheNode, blockTheNode } from 'dxActions/preview';
import { isNodePassed } from './selectors';

import Practice from '../practice';

const propTypes = {
  currentParams: PropTypes.object,
  currentNodeId: PropTypes.string,
  passTheNode: PropTypes.func,
  isNodePassed: PropTypes.bool,
};

class PracticePreviewer extends Component {
  constructor(props) {
    super(props);
    this.afterSubmit = ::this.afterSubmit;
  }

  afterSubmit() {
    if (this.props.isNodePassed) return;
    this.props.passTheNode();
  }

  render() {
    const { currentNodeId, currentParams } = this.props;

    const practiceParams = {
      ...currentParams,
      node_id: currentNodeId,
    };

    return (
      <div>
        <Practice params={practiceParams} onClose={this.afterSubmit} />
      </div>
    );
  }
}

PracticePreviewer.propTypes = propTypes;

const mapStateToProps = state => ({
  currentParams: {
    plan_id: state.preview.plan_id,
    course_id: state.preview.course_id,
    solution_id: state.preview.solution_id,
  },
  currentNodeId: state.preview.node_id,
  isNodePassed: isNodePassed(state),
});

const mapDispatchToProps = {
  passTheNode,
  blockTheNode,
};

export default connect(mapStateToProps, mapDispatchToProps)(PracticePreviewer);
