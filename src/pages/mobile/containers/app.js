import React, { Component } from 'react';
import { locationShape, routerShape, withRouter } from 'react-router';

import Connect from '../connect';

class App extends Component {

  componentWillReceiveProps({ location }) {
    const nextPathname = location.pathname;
    const prevPathname = this.props.location.pathname;

    if (nextPathname === '/distribution/required/new/selection-confirm'
      && prevPathname === '/distribution/required') {
      this.props.router.replace('/mall');
    } else if (nextPathname === '/distribution/live/new/selection-confirm'
      && prevPathname === '/distribution/required') {
      this.props.router.replace('/mall');
    }
  }

  render() {
    return (
      <div id="layout">
        <div id="main">{this.props.children}</div>
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element,
  router: routerShape,
  location: locationShape,
};

export default withRouter(App);
