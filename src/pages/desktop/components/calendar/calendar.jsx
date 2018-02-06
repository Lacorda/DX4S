import React from 'react';
import Week from './week';
import Day from './day';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.previous = ::this.previous;
    this.next = ::this.next;
    this.hancleClick = ::this.hancleClick;
    this.state = {
      month: this.props.selected.clone(),
    };
  }

  previous() {
    const month = this.state.month.add(-1, 'M');
    this.setState({ month });
    if (this.props.onPreClick) this.props.onPreClick(month.format('YYYY-MM'));
  }

  next() {
    const month = this.state.month.add(1, 'M');
    this.setState({ month });
    if (this.props.onNextClick) this.props.onNextClick(month.format('YYYY-MM'));
  }

  hancleClick(day) {
    if (this.props.onClick && !day.isSigned) {
      this.props.onClick(day);
    }
  }

  renderWeeks() {
    const weeks = [];
    const date = this.state.month.clone().startOf('month').add('w' - 1).day('Sunday');
    let done = false;
    let monthIndex = date.month();
    let count = 0;

    while (!done) {
      weeks.push(
        <Week
          key={date.toString()}
          date={date.clone()}
          month={this.state.month}
          select={this.hancleClick}
          selected={this.props.selected}
          signedDays={this.props.signedDays}
          completeSuccess={this.props.completeSuccess}
        />
      );
      date.add(1, 'w');
      done = (count += 1) > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }

    return weeks;
  }

  renderMonthLabel() {
    const format = (this.props.language === 'en') ? 'MMMM YYYY' : 'YYYY年MM月';
    return <span className="label">{this.state.month.format(format)}</span>;
  }

  render() {
    return (
      <div id="calendar">
        <div className="header">
          <span className="pre" onClick={this.previous}>&nbsp;</span>
          {this.renderMonthLabel()}
          <span className="next" onClick={this.next}>&nbsp;</span>
        </div>
        <Day />
        {this.renderWeeks()}
      </div>
    );
  }
}


Calendar.propTypes = {
  selected: React.PropTypes.object,  // eslint-disable-line
  signedDays: React.PropTypes.arrayOf(React.PropTypes.string),
  onPreClick: React.PropTypes.func,
  onNextClick: React.PropTypes.func,
  onClick: React.PropTypes.func,
  completeSuccess: React.PropTypes.bool,
  language: React.PropTypes.string,
};
Calendar.defaultProps = {
  signedDays: [],
};

export default Calendar;
