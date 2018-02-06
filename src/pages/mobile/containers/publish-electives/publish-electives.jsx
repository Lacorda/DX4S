import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { setTitle } from 'utils/dx/nav';
import api from 'utils/api';
import { publishElectives as actions } from '../../actions';
import Search from '../../components/search';
import RefreshLoad from '../../components/refreshload';
import Toast from '../../../../components/modal/toast';
import './publish-electives.styl';

class PublishElectives extends React.Component {
  constructor() {
    super();
    this.selectItem = ::this.selectItem;
    this.showSelectList = ::this.showSelectList;
    this.pullUpCallback = ::this.pullUpCallback;
    this.handlePublish = ::this.handlePublish;
    this.getResource = ::this.getResource;
    this.handleQuery = ::this.handleQuery;
    this.isSelected = ::this.isSelected;
    this.linkTo = ::this.linkTo;
    this.state = {
      defaultFilter: [''],
      showSelected: false,
      selectedIds: [],
      selectedItems: [],
      count: 0,
      name: '',
      isOpen: false,
      errIsOpen: false,
      errMsg: '',
      isPublishing: false,
    };
  }

  componentWillMount() {
    const { selectedIds, selectedItems, count } = this.props;
    this.setState({ selectedIds, selectedItems, count });
  }

  componentDidMount() {
    this.props.reFetchElectivesList().then(() => {
      this.refresh.refresh();
    });
  }

  componentDidUpdate() {
    if (this.state.showSelected) {
      const totalHeight = this.selectedScroll.getBoundingClientRect().height;
      const singleHeight = totalHeight / this.state.count;
      if (this.state.count >= 4) {
        this.selectedScrollWrap.style.height = `${singleHeight * 4}px`;
      } else {
        this.selectedScrollWrap.style.height = `${totalHeight}px`;
      }
      if (this.selectedListRefresh) {
        this.selectedRefresh.refresh();
        this.selectedListRefresh = false;
      }
    }
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
      default:
        return '';
    }
  }

  getResource(resource) {
    switch (resource) {
      case 'enterprise':
        return this.context.intl.messages['app.publishElectives.fromLecturer'];
      case 'mall':
        return this.context.intl.messages['app.publishElectives.fromMall'];
      default:
        return null;
    }
  }

  setNavBar() {
    setTitle({
      title: this.context.intl.messages['app.publishElectives.addTitle'],
    });
  }

  getQuery() {
    return [
      {
        title: this.context.intl.messages['app.publishElectives.from'],
        nav: [
          { id: '', name: this.context.intl.messages['app.publishElectives.fromAll'] },
          { id: 'enterprise', name: this.context.intl.messages['app.publishElectives.fromLecturer'] },
          { id: 'mall', name: this.context.intl.messages['app.publishElectives.fromMall'] },
        ],
      },
    ];
  }

  selectedListRefresh = false;

  handleQuery({ filter, search: name }) {
    this.setState({ name });
    this.setState({ defaultFilter: filter });
    this.props.reFetchElectivesList(name, filter[0]).then(() => {
      this.refresh.refresh();
    });
  }

  // 上拉分页加载
  pullUpCallback(cb) {
    if (!this.props.lastElectives) {
      this.props.fetchElectivesList(this.state.name, this.state.defaultFilter[0]).then(() => {
        if (cb()) cb();
      });
    }
  }

  // 添加课程列表 - 添加/删除
  selectItem(item) {
    if (item.isPublished) return;
    const index = this.state.selectedIds.indexOf(item.id);
    const { id, cover_url, name, resource, type } = item;
    if (index === -1) {
      this.state.selectedIds.push(item.id);
      this.state.selectedItems.push({ id, cover_url, name, resource, type });
      this.state.count += 1;
    } else {
      this.state.selectedIds.splice(index, 1);
      this.state.selectedItems.splice(index, 1);
      this.state.count -= 1;
    }
    this.setState({
      selectedIds: this.state.selectedIds,
      selectedItems: this.state.selectedItems,
      count: this.state.count,
    });
    this.props.updateSelectElectives(this.state.selectedIds, this.state.selectedItems);
  }

  // 已选课程列表 - 删除
  deleteItems(id) {
    const index = this.state.selectedIds.indexOf(id);
    this.state.selectedIds.splice(index, 1);
    this.state.selectedItems.splice(index, 1);
    this.state.count -= 1;
    if (this[`input${id}`]) {
      this[`input${id}`].checked = false;
    }
    this.setState({
      selectedIds: this.state.selectedIds,
      selectedItems: this.state.selectedItems,
      count: this.state.count,
      showSelected: this.state.count,
    });
    this.selectedListRefresh = true;
    this.props.updateSelectElectives(this.state.selectedIds, this.state.selectedItems);
  }

  showSelectList() {
    if (!this.state.count) return;
    this.selectedListRefresh = !this.state.showSelected;
    this.setState({ showSelected: !this.state.showSelected });
  }

  handlePublish() {
    if (this.state.selectedIds.length && !this.state.isPublishing) {
      // this.props.updatePublishedElectivesList(this.state.selectedIds.join(','));
      this.setState({ isPublishing: true });
      const ids = this.state.selectedIds.join(',');
      api({
        method: 'PUT',
        url: '/training/elective/publish',
        data: { ids },
      }).then(() => {
        this.setState({ isPublishing: false });
        this.props.resetSelectedElectives();
        const router = this.context.router;
        router.push(router.createPath('/publish-electives'));
      }).catch((err) => {
        this.setState({ isPublishing: false });
        this.setState({ errIsOpen: true, errMsg: err.response.data.message });
        setTimeout(() => {
          this.setState({ errIsOpen: false, errMsg: '' });
        }, 2000);
      });
    }
  }

  isSelected(id) {
    return this.state.selectedIds.indexOf(id) !== -1;
  }

  linkTo(item, e) {
    /* if (item.isPublished) return;
     if (item.resource === 'mall') {
     const router = this.context.router;
     const query = {
     type: 'view',
     };
     router.push(router.createPath(`/products/course/${item.id}`, query));
     } else {
     this.setState({ isOpen: true });
     setTimeout(() => { this.setState({ isOpen: false }); }, 2000);
     }*/
    const router = this.context.router;
    const query = {
      type: 'view',
    };
    router.push(router.createPath(`/products/course/${item.id}`, query));
    e.stopPropagation();
    e.preventDefault();
  }

  renderSelectedList() {
    return (
      <div className="bottom-list-wrap">
        <div className="bottom-list">
          <div className="bottom-list-header">
            <a className="close" onClick={() => this.setState({ showSelected: false })}>&nbsp;</a>
          </div>
          <div
            className="bottom-list-body list-box"
            ref={(ref) => { this.selectedScrollWrap = ref; }}
          >
            <RefreshLoad
              relative
              needPullUp={false}
              needPullDown={false}
              ref={(ref) => { this.selectedRefresh = ref; }}
            >
              <ul className="dx-list" ref={(ref) => { this.selectedScroll = ref; }}>
                {
                  this.state.selectedItems.map((item, index) => {
                    const lastIndex = this.state.selectedItems.length - 1;
                    return (
                      <li key={index} className="one-slide">
                        <div className={`dx-flex-box${(index === lastIndex) ? ' no-border' : ''}`}>
                          <div className="dx-flex-img">
                            <div className={`icon ${item.type}`}>{this.getType(item.type)}</div>
                            <img src={item.cover_url} alt="" />
                          </div>
                          <div className="dx-flex-info">
                            <div className="dx-flex-info-title">{item.name}</div>
                            <div className="dx-flex-info-desc">
                              {this.context.intl.messages['app.publishElectives.resource']}：{this.getResource(item.resource)}
                            </div>
                          </div>
                        </div>
                        <a className="delete" onClick={() => this.deleteItems(item.id)}>&nbsp;</a>
                      </li>
                    );
                  })
                }
              </ul>
            </RefreshLoad>
          </div>
        </div>
      </div>
    );
  }

  render() {
    this.setNavBar();
    const { lastElectives, electives, errMsg } = this.props;

    return (
      <div className="publish-box has-notice">
        <div className="publish-header">{this.context.intl.messages['app.publishElectives.notice']}</div>
        <Search
          query={this.getQuery()}
          onQuery={this.handleQuery}
          defaultFilter={this.state.defaultFilter}
          placeholder={this.context.intl.messages['app.publishElectives.search']}
          buttonText={this.context.intl.messages['app.publishElectives.ok']}
        />
        <RefreshLoad
          absolute
          hidePullUp
          needPullDown={false}
          needPullUp={!lastElectives && !!electives.length}
          pullUpCallBack={this.pullUpCallback}
          ref={(ref) => { this.refresh = ref; }}
          className="refresh-distance"
        >
          <div className="list-box">
            <ul className="dx-list">
              {
                electives.map((item, index) => {
                  const lastIndex = electives.length - 1;
                  const checked = this.isSelected(item.id);
                  return (
                    <li key={index} className={`one-slide${item.isPublished ? ' disabled' : ''}`}>
                      <div
                        className={`dx-flex-box${(index === lastIndex) ? ' no-border' : ''}${item.isPublished ? ' disabled' : ''}`}
                        onClick={() => this.selectItem(item)}
                      >
                        <input
                          readOnly
                          type="checkbox"
                          ref={(ref) => { this[`input${item.id}`] = ref; }}
                          checked={checked}
                          disabled={item.isPublished}
                        />
                        <div className="dx-flex-img">
                          <div className={`icon ${item.type}`}>{this.getType(item.type)}</div>
                          <img src={item.cover_url} alt="" />
                        </div>
                        <div className="dx-flex-info">
                          <div className="dx-flex-info-title">{item.name}</div>
                          <div className="dx-flex-info-desc mt20">
                            {this.context.intl.messages['app.publishElectives.resource']}：{this.getResource(item.resource)}
                            {item.isPublished ? (
                              <span className="icon-added">
                                {this.context.intl.messages['app.publishElectives.selected']}
                              </span>
                            ) : ''}
                          </div>
                        </div>
                      </div>
                      {/* {
                       (item.resource === 'mall' && !item.isPublished) ? (
                       <div className="dx-list-view" onClick={e => this.linkTo(item, e)}><FormattedMessage id="app.publishElectives.view" /> &gt;</div>
                       ) : null
                       }*/}
                    </li>
                  );
                })
              }
            </ul>
          </div>
          {
            lastElectives ? (
              <div className="last-page">{this.context.intl.messages['app.publishElectives.lastPage']}</div>
            ) : null
          }
        </RefreshLoad>
        <div className="publish-footer">
          <div className="dx-footer">
            <div
              className={`dx-footer-desc${this.state.showSelected ? ' active' : ''}`}
              onClick={this.showSelectList}
            >
              <span className="dx-icon-triangle">
                {this.context.intl.messages['app.publishElectives.selectedCourse']}：{this.state.count}{this.context.intl.messages['app.publishElectives.selectedCourseUnit']}
              </span>
            </div>
            <div className="dx-footer-operation" onClick={this.handlePublish}>
              {this.context.intl.messages['app.publishElectives.publish']}
            </div>
          </div>
          {(this.state.showSelected && this.state.count) ? this.renderSelectedList() : ''}
        </div>
        <Toast isOpen={this.state.isOpen}>
          <FormattedMessage id="app.publishElectives.noView4Lecturer" />
        </Toast>
        <Toast isOpen={this.state.errIsOpen}>{this.state.errMsg}</Toast>
      </div>
    );
  }
}

PublishElectives.propTypes = {
  isFetching: React.PropTypes.bool,
  lastElectives: React.PropTypes.bool,
  electives: React.PropTypes.arrayOf(React.PropTypes.object),
  updatedSuccess: React.PropTypes.bool,
  selectedIds: React.PropTypes.arrayOf(React.PropTypes.number),
  selectedItems: React.PropTypes.arrayOf(React.PropTypes.object),
  count: React.PropTypes.number,
  reFetchElectivesList: React.PropTypes.func,
  fetchElectivesList: React.PropTypes.func,
  resetPublishElectivesRedux: React.PropTypes.func,
  updatePublishedElectivesList: React.PropTypes.func,
  updateSelectElectives: React.PropTypes.func,
  resetSelectedElectives: React.PropTypes.func,
  errMsg: React.PropTypes.string,
};

PublishElectives.contextTypes = {
  intl: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isFetching: state.publishElectives.isFetching,
  lastElectives: state.publishElectives.lastElectives,
  electives: state.publishElectives.electives,
  updatedSuccess: state.publishElectives.updatedSuccess,
  selectedIds: state.publishElectives.selectedIds,
  selectedItems: state.publishElectives.selectedItems,
  count: state.publishElectives.count,
  errMsg: state.publishElectives.errMsg,
});

const mapDispatchToProps = dispatch => ({
  reFetchElectivesList: bindActionCreators(actions.reFetchElectivesList, dispatch),
  fetchElectivesList: bindActionCreators(actions.fetchElectivesList, dispatch),
  resetPublishElectivesRedux: bindActionCreators(actions.resetPublishElectivesRedux, dispatch),
  updatePublishedElectivesList: bindActionCreators(actions.updatePublishedElectivesList, dispatch),
  updateSelectElectives: bindActionCreators(actions.updateSelectElectives, dispatch),
  resetSelectedElectives: bindActionCreators(actions.resetSelectedElectives, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PublishElectives);
