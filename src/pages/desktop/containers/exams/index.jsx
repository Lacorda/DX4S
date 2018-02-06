import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import DxHeader from '../../components/header';
import DxFooter from '../../components/footer';
import History from './history';
import Rank from './rank';
import Info from './info';

import './styles.styl';
import messages from './messages';

class Index extends Component {
  constructor(props, context) {
    super(props, context);
    this.tapClick = ::this.tapClick;
    this.state = {
      activeTab: 'history',
    };
  }

  tapClick(type) {
    this.setState({
      activeTab: type,
    });
  }

  render() {
    const { activeTab } = this.state;
    const historyTabClassName = classnames({
      tab: true,
      active: activeTab === 'history',
    });
    const rankTabClassName = classnames({
      tab: true,
      active: activeTab === 'rank',
    });
    return (
      <div>
        <DxHeader />
        <div className="exams">
          <Info {...this.props} />
          <ul className="tabs">
            <li className={historyTabClassName} onClick={() => this.tapClick('history')}><FormattedMessage {...messages.examRecords} /></li>
            <li className={rankTabClassName} onClick={() => this.tapClick('rank')}><FormattedMessage {...messages.rankingLists} /></li>
          </ul>
          {activeTab === 'history' ? <History {...this.props} /> : <Rank {...this.props} />}
        </div>
        <DxFooter />
      </div>
    );
  }
}

export default Index;
