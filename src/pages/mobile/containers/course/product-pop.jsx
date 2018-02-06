/**
 * 多学课堂-弹出Pop
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { products as productActions } from '../../actions';
import ProductPop from './basic-product-pop';

const mapStateToProps = (state, ownProps) => ({
  priceInfo: state.products.detail.price,
  closePop: ownProps.closePop,
  onBuy: ownProps.onBuy,
  popAction: ownProps.popAction,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(productActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPop);
