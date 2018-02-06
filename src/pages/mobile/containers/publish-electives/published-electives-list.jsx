import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setTitle } from 'utils/dx/nav';
import { publishElectives as actions } from '../../actions';
import Search from '../../components/search';
import RefreshLoad from '../../components/refreshload';

class PublishedElectivesList extends React.Component {
  constructor() {
    super();
    this.pullDownCallback = ::this.pullDownCallback;
    this.pullUpCallBack = ::this.pullUpCallBack;
    this.setNavBar = ::this.setNavBar;
    this.getType = ::this.getType;
    this.state = { name: '' };
  }

  componentDidMount() {
    this.props.reFetchPublishedElectivesList().then(() => {
      this.refresh.refresh();
    });
  }

  componentWillUnmount() {
    this.props.resetPublishElectivesRedux();
  }

  getType(type) {
    switch (type) {
      case 'series':
        return this.context.intl.messages['app.publishElectives.typeSeries'];
      case 'live':
        return this.context.intl.messages['app.publishElectives.typeLive'];
      case 'exam':
        return this.context.intl.messages['app.publishElectives.typeExam'];
      default:
        return '';
    }
  }

  setNavBar() {
    setTitle({
      title: this.context.intl.messages['app.publishElectives.publishedTitle'],
    });
  }

  linkTo(item) {
    switch (item.type) {
      case 'course':
        return `plan/${item.plan_id}/series/0/courses/${item.id}`;
      case 'exam':
        return `plan/${item.plan_id}/series/0/exams/${item.id}`;
      default:
        return null;
    }
  }

  // 搜索 API
  handleSearch(name) {
    this.props.reFetchPublishedElectivesList(name).then(() => {
      this.refresh.refresh();
    });
    this.setState({ name });
  }

  // 下拉刷新
  pullDownCallback(cb) {
    this.props.reFetchPublishedElectivesList(this.state.name).then(() => {
      if (cb) cb();
    });
  }

  // 上拉分页加载
  pullUpCallBack(cb) {
    if (!this.props.lastPublishedElectives) {
      this.props.fetchPublishedElectivesList(this.state.name).then(() => {
        if (cb) cb();
      });
    }
  }

  render() {
    this.setNavBar();
    const { lastPublishedElectives, publishedElectives } = this.props;

    return (
      <div className="publish-box">
        <Search
          onSearch={name => this.handleSearch(name)}
          placeholder={this.context.intl.messages['app.publishElectives.search']}
        />
        <RefreshLoad
          absolute
          hidePullUp
          needPullUp={!lastPublishedElectives && !!publishedElectives.length}
          pullDownCallBack={this.pullDownCallback}
          pullUpCallBack={this.pullUpCallBack}
          ref={(ref) => { this.refresh = ref; }}
          className="refresh-distance"
        >
          <div className="list-box">
            <ul className="dx-list">
              {
                publishedElectives.map((item, index) => {
                  const lastIndex = publishedElectives.length - 1;
                  return (
                    <li className="one-slide" key={index}>
                      <Link to={this.linkTo(item)} className={`dx-flex-box${(index === lastIndex) ? ' no-border' : ''}`}>
                        <div className="dx-flex-img">
                          <div className={`icon ${item.type}`}>{this.getType(item.type)}</div>
                          <img src={item.cover_url} alt="" />
                        </div>
                        <div className="dx-flex-info">
                          <div className="dx-flex-info-title">{item.name}</div>
                          <div className="dx-flex-info-desc mb20">
                            {
                              item.type !== 'exam' ? (
                                `${this.context.intl.messages['app.publishElectives.lecturer']}：${item.lecturer_name || ''}`
                              ) : '　'
                            }
                          </div>
                          <div className="dx-flex-info-desc">
                            {item.create_time}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          {
            lastPublishedElectives ? (
              <div className="last-page">{this.context.intl.messages['app.publishElectives.lastPage']}</div>
            ) : null
          }
        </RefreshLoad>
        <div className="publish-footer">
          <div className="dx-footer">
            <Link className="dx-footer-button" to="publish-electives/publish">
              <span className="dx-icon-plus">{this.context.intl.messages['app.publishElectives.addNew']}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

PublishedElectivesList.propTypes = {
  lastPublishedElectives: React.PropTypes.bool,
  publishedElectives: React.PropTypes.arrayOf(React.PropTypes.object),
  reFetchPublishedElectivesList: React.PropTypes.func,
  fetchPublishedElectivesList: React.PropTypes.func,
  resetPublishElectivesRedux: React.PropTypes.func,
};

PublishedElectivesList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  lastPublishedElectives: state.publishElectives.lastPublishedElectives,
  publishedElectives: state.publishElectives.publishedElectives,
});

const mapDispatchToProps = dispatch => ({
  reFetchPublishedElectivesList: bindActionCreators(actions.reFetchPublishedElectivesList, dispatch),
  fetchPublishedElectivesList: bindActionCreators(actions.fetchPublishedElectivesList, dispatch),
  resetPublishElectivesRedux: bindActionCreators(actions.resetPublishElectivesRedux, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishedElectivesList);
