import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import Comment from './comment';

import { announcement as announcementActions } from '../../actions';

import './styles.styl';
import messages from './messages';

const dateFormat = date => (
  `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${date.slice(8, 10)}:${date.slice(10, 12)}:${date.slice(12, 14)}`
);

const propTypes = {
  detail: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  fetchParams: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
};

class Detail extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleLike = this.handleLike.bind(this);
    this.viewer = this.viewer.bind(this);
  }

  componentDidMount() {
    const { actions, fetchParams } = this.props;
    actions.fetchAnnouncementDetail(fetchParams);
  }

  handleLike() {
    const { actions, fetchParams } = this.props;
    actions.fetchAnnouncementLike(fetchParams);
  }

  viewer(type, accessory) {
    const { router } = this.props;
    if (type === 'img') {
      const imgJson = accessory.snapshots.length ?
        JSON.stringify(accessory.snapshots) :
        JSON.stringify([accessory.accessory_url]);
      sessionStorage.setItem('imgViewer', imgJson);
      router.push('/announcement/imgViewer');
    } else {
      const mediaJson = JSON.stringify(accessory.accessory_url);
      sessionStorage.setItem('mediaViewer', mediaJson);
      router.push('/announcement/mediaViewer');
    }
  }

  render() {
    const { detail } = this.props;
    return (
      <div>
        <DxHeader />
        <div className="announcement">
          <div className="announcement-header">
            <div className="announcement-header-container">
              <div className="announcement-title"><i className="icon-task" /><FormattedMessage {...messages.detailTitle} /></div>
            </div>
          </div>
          <div className="announcement-detail">
            <div className="announcement-detail-header">
              <h3 className="announcement-detail-title">{detail.title}</h3>
              <div className="announcement-detail-info">
                <span className="announcement-detail-date"><FormattedMessage {...messages.time} />：{detail.update_time && dateFormat(detail.update_time)}</span><span className="announcement-detail-publisher"><FormattedMessage {...messages.from} />：{detail.publisher_man}</span>
              </div>
            </div>
            <div className="announcement-detail-content" dangerouslySetInnerHTML={{ __html: detail.content }} />
            {Array.isArray(detail.accessories) && detail.accessories.length ?
              <div className="announcement-detail-accessories">
                <div className="announcement-detail-accessories-header">
                  <i className="icon-paperclip" /><span className="accessories-tag"><FormattedMessage {...messages.attachment} /><sapn className="accessories-tag-number">({detail.accessories.length}<FormattedMessage {...messages.unit} values={{ en: <span /> }} />)</sapn></span>
                </div>
                <ul className="announcement-detail-accessories-content">
                  {
                    detail.accessories.map((accessory) => {
                      if (accessory.accessory_type === '3' || accessory.accessory_type === '4') {
                        return <li key={accessory.accessory_id} className="announcement-detail-accessory">{accessory.accessory_name}<span className="span" onClick={() => this.viewer('media', accessory)}><FormattedMessage {...messages.preview} /></span></li>;
                      }
                      return <li key={accessory.accessory_id} className="announcement-detail-accessory">{accessory.accessory_name}<span className="span" onClick={() => this.viewer('img', accessory)}><FormattedMessage {...messages.preview} /></span></li>;
                    })
                  }
                </ul>
              </div> : null
            }
          </div>
          {detail.is_allow_comment === 1 ?
            <div>
              <Comment {...this.props} />
              {detail.has_liked === false ?
                <span className="announcement-detail-like" onClick={this.handleLike}><span className={detail.like_count > 9 ? 'announcement-detail-like-count max' : 'announcement-detail-like-count'}>{detail.like_count > 99 ? '99+' : detail.like_count}</span></span> :
                <span className="announcement-detail-like liked" onClick={this.handleLike}><span className={detail.like_count > 9 ? 'announcement-detail-like-count max' : 'announcement-detail-like-count'}>{detail.like_count > 99 ? '99+' : detail.like_count}</span></span>
              }
            </div> : null
          }
        </div>
        <DxFooter />
      </div>
    );
  }
}

Detail.propTypes = propTypes;

export default connect((state, ownProps) => (
  {
    detail: state.announcement.detail || [],
    isFetching: state.announcement.isFetching || false,
    fetchParams: {
      announcementId: ownProps.params.announcement_id,
    },
  }
), dispatch => (
  {
    actions: bindActionCreators(announcementActions, dispatch),
  }
))(withRouter(Detail));
