import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';

const Actions = Object.values(actions).reduce((all, action) => Object.assign({}, all, action), {});
function mapStateToProps(state) {
  return {
    ...state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
