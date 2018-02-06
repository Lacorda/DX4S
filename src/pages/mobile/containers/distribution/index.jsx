import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { setTitle } from 'utils/dx/nav';
import { initRequiredDistribution } from 'dxActions/distribution-required';
import { initLiveDistribution } from 'dxActions/distribution-live';

import Search from '../../components/search';
import RefreshLoad from '../../components/refreshload';
import EmptyContent from './required/empty-content';
import messages from './messages';
import * as apis from '../../apis';

import './style.styl';
import './required/selection-course.styl';

function Plan(props) {
  const { name, date, courseNum, onClick, type } = props;
  const isLive = type === 'live';
  let subEl;
  if (isLive) {
    subEl = (
      <div className="dx-list-comment clearfix">
        <div className="pull-left"><FormattedMessage {...messages.beginTime} />：{date}</div>
        <div className="pull-right"><FormattedMessage {...messages.live} />：{courseNum}</div>
      </div>
    );
  } else {
    subEl = (
      <div className="dx-list-comment clearfix">
        <div className="pull-left"><FormattedMessage {...messages.deadline} />：{date}</div>
        <div className="pull-right"><FormattedMessage {...messages.course} />：{courseNum}</div>
      </div>
    );
  }

  return (
    <li onClick={onClick}>
      <div className="dx-list-title">
        {name}
      </div>
      {subEl}
    </li>
  );
}

Plan.propTypes = {
  name: React.PropTypes.string,
  type: React.PropTypes.string,
  date: React.PropTypes.string,
  courseNum: React.PropTypes.number,
  onClick: React.PropTypes.func,
};

class Distribution extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      hasMoreData: false,
      index: 1,
      plans: [],
      name: '',
      initialized: false,
    };
  }

  async componentDidMount() {
    setTitle({ title: this.getIntlMsg('history') });
    await this.fetchData();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ initialized: true });
  }

  getIntlMsg(id) {
    return this.context.intl.messages[`app.distribution.plan.${id}`];
  }

  async fetchData(params, cb, append = false) {
    await new Promise(resolve => this.setState({ ...params }, resolve));
    const { index, name } = this.state;
    const plans = await apis.getPlans({ index, name });
    await new Promise(resolve =>
      this.setState({
        plans: append ? this.state.plans.concat(plans) : plans,
        hasMoreData: plans.length >= 10,
      }, resolve)
    );
    if (cb) cb();
    else if (this.listBox) this.listBox.refresh();
  }

  render() {
    const { plans, index, hasMoreData } = this.state;
    let listEl;
    if (plans.length) {
      listEl = (
        <RefreshLoad
          absolute
          className="distribution-course-list"
          needPullDown
          needPullUp={hasMoreData}
          pullDownCallBack={cb => this.fetchData({ index: 1 }, cb)}
          pullUpCallBack={cb => this.fetchData({ index: index + 1 }, cb, true)}
          ref={(ref) => { this.listBox = ref; }}
        >
          <ul className="dx-list">
            {plans.map(({ id, name, end, course_num: courseNum, user_num: userNum, plan_category: type }) =>
              <Plan
                key={id}
                name={name}
                date={end}
                courseNum={courseNum}
                userNum={userNum}
                type={type}
                onClick={() => this.context.router.push(`/distribution/required/${id}`)}
              />)}
          </ul>
        </RefreshLoad>
      );
    } else {
      listEl = <EmptyContent whole={!this.state.initialized} />;
    }

    return (
      <div className="distribution distribution-required">
        <Search
          placeholder={this.getIntlMsg('search')}
          onSearch={name => this.fetchData({ name, index: 1 })}
        />
        {listEl}
        <div className="dx-footer">
          <Link
            className="dx-footer-button footer-live"
            onClick={() => {
              this.props.initLiveDistribution();
              this.context.router.push('/distribution/live/new/selection-live');
            }}
          >
            <span className="dx-icon-plus" />
            <FormattedMessage {...messages.addLive} />
          </Link>
          <Link
            className="dx-footer-button footer-plan"
            onClick={() => {
              this.props.initRequiredDistribution();
              this.context.router.push('/distribution/required/new/selection-course');
            }}
          >
            <span className="dx-icon-plus" />
            <FormattedMessage {...messages.addPlan} />
          </Link>

        </div>
      </div>
    );
  }
}

Distribution.propTypes = {
  initRequiredDistribution: React.PropTypes.func,
  initLiveDistribution: React.PropTypes.func,
};

Distribution.contextTypes = {
  intl: React.PropTypes.object,
  router: React.PropTypes.object,
};

export default connect(null, { initRequiredDistribution, initLiveDistribution })(Distribution);
