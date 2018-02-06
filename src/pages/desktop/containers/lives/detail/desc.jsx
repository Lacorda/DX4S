/**
 * 课程详情-简介
*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const propTypes = {
  trainingLive: PropTypes.object.isRequired,
};

const Desc = ({ trainingLive: { description } }) => (
  <div className="description" dangerouslySetInnerHTML={{ __html: description }} />
);

Desc.propTypes = propTypes;

const mapStateToProps = state => ({
  trainingLive: state.trainingLive,
});


export default connect(mapStateToProps)(Desc);
