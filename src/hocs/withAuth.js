/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUser } from 'dxActions/account';

/**
 * 需要从state.account.user中取得数据的组件可以先用withAuth进行高阶处理
 * @param WrappedComponent
 * @return {*}
 */
export default function withAuth(WrappedComponent) {
  class WithAuthedComponent extends Component {
    constructor() {
      super();
      this.state = { fetched: false };
    }

    async componentDidMount() {
      const { user, actions } = this.props;
      if (!user.lastUpdated) await actions.fetchUser();
      this.setState({ fetched: true }); // eslint-disable-line react/no-did-mount-set-state
    }

    render() {
      if (!this.state.fetched) return null;
      return <WrappedComponent {...this.props.ownProps} />;
    }
  }

  const { shape, func, object } = React.PropTypes;
  WithAuthedComponent.propTypes = {
    actions: shape({ fetchUser: func }),
    user: object, // eslint-disable-line react/forbid-prop-types
    ownProps: object, // eslint-disable-line react/forbid-prop-types
  };

  const mapStateToProps = (state, ownProps) => ({
    user: state.account.user,
    ownProps,
  });

  const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({ fetchUser }, dispatch),
  });

  return connect(mapStateToProps, mapDispatchToProps)(WithAuthedComponent);
}
