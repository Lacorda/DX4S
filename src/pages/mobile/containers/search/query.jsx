import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

const propTypes = {
  onFetch: PropTypes.func.isRequired,
};

// 搜索栏
class Query extends React.Component {
  constructor(...args) {
    super(...args);
    this.handleSubmit = ::this.handleSubmit;
    this.handleChange = ::this.handleChange;
    this.state = {
      keyword: '',
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const { keyword } = this.state;
    const { onFetch } = this.props;
    onFetch({ keyword });
  }

  handleChange(event) {
    this.setState({
      keyword: event.target.value,
    });
  }

  render() {
    const { keyword } = this.state;
    return (
      <div className="query">
        <div className="placeholder">
          <FormattedMessage {...messages.placeholder} />
        </div>
        <form action="/" onSubmit={this.handleSubmit}>
          <input type="search" value={keyword} onChange={this.handleChange} className={keyword ? 'active' : ''} />
        </form>
      </div>
    );
  }
}

Query.propTypes = propTypes;

export default Query;
