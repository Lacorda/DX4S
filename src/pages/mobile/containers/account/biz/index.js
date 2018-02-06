// for biz
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../actions';
import Biz from './biz';
import Invoice from './invoice';
import './style.styl';

const mapStateToProps = state => ({
  user: state.account.user,
  biz: state.account.biz,
});

const mapDispatchToProps = dispatch => ({
  fetchUser: bindActionCreators(Actions.account.fetchUser, dispatch),
  fetchBiz: bindActionCreators(Actions.account.fetchBiz, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Biz);
export { Invoice };
