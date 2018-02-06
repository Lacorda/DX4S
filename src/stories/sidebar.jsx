import React from 'react';
import { storiesOf } from '@kadira/storybook';

import Sidebar from '../components/sidebar';

class SidebarExample extends React.Component {
  constructor() {
    super();
    this.state = { isOpen: false };
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div>
        <Sidebar isOpen={isOpen} pullRight operations={[]}>
          <h1>hello</h1>
        </Sidebar>
        <button onClick={() => this.setState({ isOpen: !isOpen })}>toggle</button>
      </div>
    );
  }
}

storiesOf('Sidebar', module)
  .add('basic', () => (
    <SidebarExample />
  ));
