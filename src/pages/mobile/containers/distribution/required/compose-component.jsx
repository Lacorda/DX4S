import React, { Component } from 'react';
import api from 'utils/api';

export default function (options = {}) {
  class ComposeComponent extends Component {
    constructor() {
      super();
      this.state = {};
    }

    async componentDidMount() {
      const { url, handler } = options;
      const data = await api({ url });
      this.setState(handler(data)); // eslint-disable-line react/no-did-mount-set-state
    }

    render() {
      return (
        <this.props.component {...this.state} />
      );
    }
  }

  return ComposeComponent;
}
