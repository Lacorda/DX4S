import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import api from 'utils/api';
import { FormattedMessage } from 'react-intl';

import './detail.styl';
import Info from './info';
import SubCourse from './subcourse';
import { seriesDetail } from '../../actions';
import nav from '../../../../utils/dx/nav';
import { Alert } from '../../../../components/modal';
import messages from './messages';

class Detail extends React.Component {
  static propTypes() {
    return {
      fetchParams: PropTypes.object.isRequired,
      actions: PropTypes.object.isRequired,
      needUpdateCompleteStatus: PropTypes.bool.isRequired,
      completedInPlan: PropTypes.object.isRequired,
    };
  }

  static contextTypes = {
    intl: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      isFetched: false,
      isShareAlertOpen: false,
    };
    this.closeShareAlert = ::this.closeShareAlert;
  }

  async componentDidMount() {
    const { fetchParams, actions } = this.props;
    actions.fetchSeriesDetail(fetchParams).then(() => {
      this.setState({ isFetched: true });
      const { needUpdateCompleteStatus } = this.props;
      if (needUpdateCompleteStatus) {
        this.setState({ ...this.state, isShareAlertOpen: true });
      }
    });
  }

  setNavBar() {
    nav.setTitle({
      title: this.context.intl.messages['app.series-detail.title'],
    });
  }

  closeShareAlert() {
    const { actions, fetchParams, completedInPlan } = this.props;
    const query = {
      plan_id: fetchParams.plan_id,
      solution_id: 0,
      course_id: fetchParams.solution_id,
    };
    const data = {
      completed_in_plan: completedInPlan,
    };

    const shareCourse = api({
      method: 'PUT',
      data: data,
      url: `/training/plan/${query.plan_id}/solution/${query.solution_id}/course/${query.course_id}/complete`
    });
    shareCourse.then(() => {
      actions.fetchSeriesDetail(fetchParams);
      this.setState({ ...this.state, isShareAlertOpen: false });
    });
  }

  render() {
    this.setNavBar();
    const info = this.state.isFetched
      ? <Info key="series_details_info" {...this.props.InfoObj} />
      : null;
    return (
      <div id="series-detail">
        <Alert
          isOpen={this.state.isShareAlertOpen}
          onRequestClose={this.closeShareAlert}
          confirmButton={<span><FormattedMessage id="app.series-detail.ok" /></span>}
        >
          <span>
            <FormattedMessage id="app.series-detail.share" />
          </span>
        </Alert>

        <div className="img-section">
          <img src={this.props.Img_Url} alt={this.props.name} />
        </div>
        {info}
        <SubCourse key="series_details_subcourse" items={this.props.items} routeParams={{
          plan_id: this.props.routeParams.plan_id,
          solution_id: this.props.routeParams.solution_id,
        }} seriesInfo={this.props.detailInfo} />
      </div>
    );
  }
}

const getFilter = (state, str) => {
  const obj = (state.seriesDetail.detailInfo.labels || []).filter(item => item.classification === str);
  if (obj.length > 0) return obj[0];
};
const getCourseObj = (state) => {
  const obj = [getFilter(state, 'industry'), getFilter(state, 'post'), getFilter(state, 'experience')]
    .filter(o => !!o).map(item => ({ id: item.id, name: item.name }));
  return obj;
};

const getInfoObj = function getInfoObj(state) {
  const obj = {
    name: state.seriesDetail.detailInfo.name || '',
    labels: (state.seriesDetail.detailInfo.labels || [])
      .filter(item => item.classification === 'tag')
      .map(item => ({ id: item.id, name: item.name })),
    course_obj: getCourseObj(state),
    desc: state.seriesDetail.detailInfo.info,
  }
  return obj;
}

const mapStateToProps = (state, ownProps) => ({
  fetchParams: {
    plan_id: ownProps.params.plan_id,
    solution_id: ownProps.params.solution_id,
  },
  InfoObj: getInfoObj(state),
  Img_Url: state.seriesDetail.detailInfo.thumbnail_url,
  items: state.seriesDetail.detailInfo.nodes || [],
  name: state.seriesDetail.detailInfo.name,
  detailInfo: state.seriesDetail.detailInfo,
  needUpdateCompleteStatus: state.seriesDetail.detailInfo.need_update_complete_status || false,
  completedInPlan: state.seriesDetail.detailInfo.completed_in_plan || {},
}
);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(seriesDetail, dispatch),
}
);
export default connect(mapStateToProps, mapDispatchToProps)(Detail);


