import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import moment from 'moment';
import api from 'utils/api';
import { nav } from 'utils/dx';
import Button from 'components/button';
import DateTimePicker from '../../../components/datetimepicker';

function convertDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

class Biz extends Component {
  static contextTypes = { intl: PropTypes.object } // set i18n
  constructor(...args) {
    super(...args);
    // init state
    this.state = {
      isFetching: false,
      didInvalidate: true,
      lastUpdated: null,
      logs: [],
      cond: {
        index: 1,
        size: 10,
        type: 'all',
        start: moment().subtract(6, 'days').toDate(),
        end: new Date(),
      },
      datepicker: {
        value: new Date(),
        isOpen: false,
        to: null,
      },
    };
    // init handle event
    this.setTitle = ::this.setTitle;
    this.fetchLogs = ::this.fetchLogs;
    this.handleClickDateInput = ::this.handleClickDateInput;
    this.handleSelectDatePicker = ::this.handleSelectDatePicker;
    this.handleCancelDatePicker = ::this.handleCancelDatePicker;
    this.handleSelectTabs = ::this.handleSelectTabs;
    this.handleSearch = ::this.handleSearch;
    this.handleLoadMore = ::this.handleLoadMore;
  }
  // on componet had mount
  componentDidMount() {
    // if user data is never fetch, start to fetch user info
    if (!this.props.user.lastUpdated) this.props.fetchUser();
    // fetch biz info
    this.props.fetchBiz();
    // fetch biz logs
    this.fetchLogs();
  }
  // set app title
  setTitle() { nav.setTitle({ title: this.context.intl.messages['app.a4biz.title'] }); }
  // fetch logs data
  fetchLogs() {
    const cond = this.state.cond;
    this.setState({ isFetching: true });
    api({
      url: '/mall/accounts/logs',
      params: {
        index: cond.index,
        size: cond.size,
        status: cond.type,
        create_time_start: cond.start,
        create_time_end: cond.end,
      },
    }).then((res) => {
      this.setState({
        isFetching: false,
        lastUpdated: new Date(),
        logs: this.state.logs.concat(res.data.items),
      });
    }).catch(() => {
      this.setState({ isFetching: false });
    });
  }
  // tabs switch event
  handleSelectTabs(type) {
    if (!this.state.isFetching) {
      const cond = { ...this.state.cond, index: 1, type };
      this.setState({ logs: [], cond }, () => { this.fetchLogs(); });
    }
  }
  // load more logs event
  handleLoadMore() {
    const cond = { ...this.state.cond, index: (this.state.cond.index + 1) };
    this.setState({ cond }, () => { this.fetchLogs(); });
  }
  // search event
  handleSearch() {
    const cond = { ...this.state.cond, index: 1 };
    this.setState({ logs: [], cond }, () => { this.fetchLogs(); });
  }
  // for datepicker
  handleClickDateInput(to) {
    const value = this.state.cond[to];
    const datepicker = { ...this.state.datepicker, value, isOpen: true, to };
    this.setState({ datepicker });
  }
  handleSelectDatePicker(time) {
    const datepicker = { ...this.state.datepicker, isOpen: false };
    const cond = { ...this.state.cond, [datepicker.to]: time };
    this.setState({ cond, datepicker });
  }
  handleCancelDatePicker() {
    const datepicker = { ...this.state.datepicker, isOpen: false };
    this.setState({ datepicker });
  }
  // render
  render() {
    // set title
    this.setTitle();
    // alias
    const self = this;
    const cond = self.state.cond;
    const user = self.props.user;
    const biz = self.props.biz;
    // tab
    const tabs = [];
    ['all', 'recharge', 'payment'].forEach((item) => {
      const cls = classnames('tab-item', { active: item === cond.type });
      tabs.push(
        <a key={item} className={cls} onClick={() => self.handleSelectTabs(item)}>
          <FormattedMessage id={`app.a4biz.type.${item}`} />
        </a>
      );
    });
    // table content
    const logs = [];
    self.state.logs.forEach((item) => {
      logs.push(
        <tr key={item.id}>
          <td>{item.type}</td>
          <td className="right">{item.amount}</td>
          <td className="right">{item.balance}</td>
          <td>{item.creator}</td>
          <td>{moment(item.create_time).format('YYYY-MM-DD')}</td>
        </tr>
      );
    });
    // loading message
    const loadMessage = () => {
      if (self.state.isFetching) {
        return (<span className="loading-message">加载中...</span>);
      }
      return '';
    };
    // button for load more logs
    const loadMore = () => {
      if (!self.state.isFetching && self.state.logs.length >= cond.index * cond.size) {
        return (<Button className="more" onClick={self.handleLoadMore}>加载更多</Button>);
      }
      return '';
    };

    return (
      <div className="a4biz">
        <div className="info clearfix">
          <img className="avatar pull-left" src={user.avatar} alt="" />
          <div className="pull-left">
            <p className="name"><b>{user.name}</b><span>{biz.name}</span></p>
            <p className="balance"><FormattedMessage id="app.a4biz.info.balance" />: <b>￥ {biz.balance}</b></p>
          </div>
          <div className="pull-right">
            <Link to="/account/biz/invoice" className="btn btn-sm"><FormattedMessage id="app.a4biz.info.button" /></Link>
          </div>
        </div>
        <div className="logs">
          <h3><FormattedMessage id="app.a4biz.list.title" /></h3>
          <div className="search-toolbar">
            <span className="search-toolbar-input" onClick={() => self.handleClickDateInput('start')}>{convertDate(self.state.cond.start)}</span>
            {/*<input type="text" name="start" readOnly value={convertDate(self.state.cond.start)} onClick={() => self.handleClickDateInput('start')} />*/}
            <span><FormattedMessage id="app.a4biz.search.to" /></span>
            <span className="search-toolbar-input" onClick={() => self.handleClickDateInput('end')}>{convertDate(self.state.cond.end)}</span>
            {/*<input type="text" name="end" readOnly value={convertDate(self.state.cond.end)} onClick={() => self.handleClickDateInput('end')} />*/}
            <Button type="primary" size="small" onClick={self.handleSearch}><FormattedMessage id="app.a4biz.search" /></Button>
          </div>
          <div className="tabs">{tabs}</div>
          <table>
            <thead>
              <tr>
                <th><FormattedMessage id="app.a4biz.col1" /></th>
                <th><FormattedMessage id="app.a4biz.col2" /></th>
                <th><FormattedMessage id="app.a4biz.col3" /></th>
                <th><FormattedMessage id="app.a4biz.col4" /></th>
                <th><FormattedMessage id="app.a4biz.col5" /></th>
              </tr>
            </thead>
            <tbody>{logs}</tbody>
          </table>
          {loadMessage()}
          {loadMore()}
        </div>
        <DateTimePicker
          theme="ios"
          value={self.state.datepicker.value}
          isOpen={self.state.datepicker.isOpen}
          onSelect={self.handleSelectDatePicker}
          onCancel={self.handleCancelDatePicker} />
      </div>
    );
  }
}

Biz.propTypes = {
  user: PropTypes.object,
  biz: PropTypes.object,
  fetchUser: PropTypes.func,
  fetchBiz: PropTypes.func,
};

export default Biz;
