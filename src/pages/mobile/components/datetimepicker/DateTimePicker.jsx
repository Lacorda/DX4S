/**
 * @module DatePicker Component
 */

import React, { Component, PropTypes } from 'react';
import DatePickerItem from './DateTimePickerItem.jsx';
import PureRender from './pureRender.js';
import { convertDate, nextSecond } from './time.js';

/**
 * Class DatePicker Component Class
 * @extends Component
 */
class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: nextSecond(this.props.value),
    };

    this.handleFinishBtnClick = ::this.handleFinishBtnClick;
    this.handleDateSelect = ::this.handleDateSelect;
  }

  componentWillReceiveProps(nextProps) {
    // update value of state
    const date = nextSecond(nextProps.value);
    if (date.getTime() !== this.state.value.getTime()) {
      this.setState({ value: date });
    }
  }

  /**
   * Optimization component, Prevents unnecessary rendering
   * Only props or state change or value before re-rendering
   *
   * @param  {Object} nextProps next props
   * @param  {Object} nextState next state
   * @return {Boolean}          Whether re-rendering
   */
  shouldComponentUpdate(nextProps, nextState) {
    const date = nextSecond(nextState.value);
    return date.getTime() !== this.state.value.getTime() ||
      PureRender.shouldComponentUpdate(nextProps, nextState, this.props, this.state);
  }

  /**
   * 点击完成按钮事件
   * @return {undefined}
   */
  handleFinishBtnClick() {
    /*
     const dateFormatArray = this.props.dateFormat.split('-');
     const dateArray = [];
     dateFormatArray.forEach((format) => {
     switch (format) {
     case 'YYYY':
     dateArray.push(this.state.value.getFullYear());
     break;
     case 'M':
     dateArray.push(this.state.value.getMonth() + 1);
     break;
     case 'D':
     dateArray.push(this.state.value.getDate());
     break;
     case 'h':
     dateArray.push(this.state.value.getHours());
     break;
     case 'm':
     dateArray.push(this.state.value.getMinutes());
     break;
     case 's':
     dateArray.push(this.state.value.getSeconds());
     break;
     default:
     break;
     }
     })
     this.props.onSelect(dateArray.join('-'));
     */
    this.props.onSelect(this.state.value);
  }

  /**
   * 选择下一个日期
   * @return {undefined}
   */
  handleDateSelect(value) {
    this.setState({ value });
  }

  /**
   * render函数
   * @return {Object} JSX对象
   */
  render() {
    const { min, max, theme, dateFormat, english, hasCollapse } = this.props;
    const value = this.state.value;
    const themeClassName =
      ['default', 'dark', 'ios', 'android', 'android-dark'].indexOf(theme) === -1 ?
        'default' : theme;
    const getTypeName = {
      YYYY: 'Year',
      M: 'Month',
      D: 'Date',
      h: 'Hour',
      m: 'Minute',
      s: 'Second',
    };
    const getSubNav = english ? getTypeName : {
      YYYY: '年',
      M: '月',
      D: '日',
      h: '时',
      m: '分',
      s: '秒',
    };
    const dateFormatArray = dateFormat.split('-');
    if (hasCollapse) {
      var collapseIndex = dateFormatArray.indexOf('D') + 1;
      dateFormatArray.splice(collapseIndex, 0, 'collapse');
    }
    return (
      <div className={`datepicker ${themeClassName}`}>
        <div className="datepicker-header">{convertDate(value, 'YYYY/MM/DD')}</div>
        <div className="datepicker-content">
          {
            dateFormatArray.map(format => {
              return (format === 'collapse') ? (<div className="collapse"><div className="datepicker-wheel"></div></div>) : (
                <DatePickerItem
                  key={format}
                  value={value}
                  min={min}
                  max={max}
                  typeName={getTypeName[format]}
                  format={format}
                  onSelect={this.handleDateSelect}
                />
              );
            })
          }
        </div>

        <div className="datepicker-navbar">
          <a className="datepicker-navbar-btn" onClick={this.handleFinishBtnClick}>{this.props.selectButtonText}</a>
          <a className="datepicker-navbar-btn" onClick={this.props.onCancel}>{this.props.cancelButtonText}</a>
        </div>
        <div className="datepicker-navbar-sub">
          <ul>
            {
              dateFormatArray.map(format => {
                return (format === 'collapse') ? (<li className="collapse"></li>) : (
                  <li>{getSubNav[format]}</li>
                )
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

DatePicker.propTypes = {
  theme: PropTypes.string,
  value: PropTypes.object,
  min: PropTypes.object,
  max: PropTypes.object,
  dateFormat: PropTypes.string,
  onSelect: PropTypes.func,
  onCancel: PropTypes.func,
  selectButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  english: PropTypes.string,
  hasCollapse: PropTypes.bool,
};

export default DatePicker;
