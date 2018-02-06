import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from 'components/button';
import * as actions from 'dxActions/distribution-live';
import { setTitle } from 'utils/dx/nav';

import * as selectors from './selectors';
import Live from './live';
import Search from '../../../components/search';
import RefreshLoad from '../../../components/refreshload';
import messages from './messages';

import '../style.styl';

class LiveSelection extends Component {
  constructor() {
    super();
    this.state = {
      hasMoreData: false,
    };
  }

  async componentDidMount() {
    setTitle({ title: this.getIntl('title') });
    await this.fetchData();
    this.refreshListBox();
  }

  getIntl(id) {
    return this.context.intl.messages[`app.distribution.live.${id}`];
  }

  asyncSetState(state) {
    return new Promise(resolve => this.setState(state, resolve));
  }

  queryParams = { index: 1, name: '' };

  // eslint-disable-next-line arrow-parens
  fetchData = async (params = {}, cb) => {
    this.queryParams = { ...this.queryParams, ...params };
    const lives = await this.props.actions.fetchDistributionLives(this.queryParams);
    await this.controlHasMoreDataState(lives);
    if (cb) cb();
    return lives;
  };

  // eslint-disable-next-line arrow-parens
  paginateData = async (cb) => {
    this.queryParams.index += 1;
    const lives = await this.props.actions.appendDistributionLive(this.queryParams);
    await this.controlHasMoreDataState(lives);
    if (cb) cb();
    return lives;
  };

  refreshListBox() {
    this.listBox.refresh();
  }

  // eslint-disable-next-line arrow-parens
  searchLive = async ([name]) => {
    await this.fetchData({ name, index: 1 });
    this.refreshListBox();
  };

  controlHasMoreDataState = (newLives) => {
    const oldHasMoreState = this.state.hasMoreData;
    const newHasMoreState = newLives.length >= 10;
    return Promise.resolve(
      oldHasMoreState === newHasMoreState
        ? null
        : this.asyncSetState({ hasMoreData: !oldHasMoreState })
    );
  };

  toNextStep = () => {
    this.context.router.push('/distribution/live/new/selection-user');
  };

  renderLiveList = () => {
    const {
      lives,
      selectedId,
      actions: {
        selectDistributionLive,
        unselectDistributionLive,
      },
    } = this.props;
    return (
      <RefreshLoad
        absolute
        className="distribution-course-list"
        needPullDown
        needPullUp={this.state.hasMoreData}
        pullDownCallBack={cb => this.fetchData({ index: 1 }, cb)}
        pullUpCallBack={cb => this.paginateData(cb)}
        ref={(ref) => { this.listBox = ref; }}
      >
        <ul className="dx-list">
          { lives.map(live =>
            (<Live
              key={live.id}
              readOnly={live.available_num === 0}
              {...live}
              type={live.course_type}
              selected={selectedId === live.id}
              onChecked={selectDistributionLive}
              onUnchecked={unselectDistributionLive}
            />))
          }
        </ul>
      </RefreshLoad>
    );
  };

  render() {
    const liveListEl = this.renderLiveList();

    return (
      <div className="full-fill distribution-required">
        <Search
          placeholder={this.getIntl('selection.live.search')}
          onSearch={this.searchLive}
        />
        {liveListEl}
        <div className="dx-footer">
          <Button

            size="block"
            type="primary"
            style={{ height: '100%' }}
            onClick={this.toNextStep}
          >
            <FormattedMessage {...messages.nextStep} />
          </Button>
        </div>
      </div>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
const { arrayOf, object, oneOfType, string, number, shape, func } = React.PropTypes;

LiveSelection.contextTypes = {
  intl: object,
  router: object,
};

LiveSelection.propTypes = {
  lives: arrayOf(object),
  selectedId: oneOfType([string, number]),
  actions: shape({
    fetchDistributionLives: func.isRequired,
    appendDistributionLive: func.isRequired,
  }),
};
/* eslint-enable */

const mapStateToProps = state => ({
  lives: selectors.liveListSelectors(state),
  selectedId: selectors.selectedLiveIdSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LiveSelection);
