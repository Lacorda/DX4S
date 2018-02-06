import React from 'react';

function Week(props) {
  let date = props.date;
  const { month, select, selected, signedDays, isTodaySigned } = props;
  const days = [];

  for (let i = 0; i < 7; i += 1) {
    const day = {
      name: date.format('dd').substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), 'day'),
      isSigned: signedDays.indexOf(date.format('YYYY-MM-DD')) !== -1 || signedDays.indexOf(date.format('YYYY-M-DD')) !== -1,
      isTodaySigned,
      date,
    };
    let extendsClassName = '';
    if (!day.isCurrentMonth) {
      extendsClassName = 'different-month';
    } else if (day.isSigned) {
      extendsClassName = 'signed';
    } else if (day.date.isSame(selected)) {
      extendsClassName = 'selected';
      if (day.isToday) {
        extendsClassName = 'selected today';
        if (day.isTodaySigned) {
          extendsClassName = 'signed';
        }
      }
    } else if (day.isToday) {
      extendsClassName = 'today';
      if (day.isTodaySigned) {
        extendsClassName = 'signed';
      }
    }
    days.push(
      <span
        key={day.date.toString()}
        className={`day ${extendsClassName}`}
        onClick={() => select(day)}
      >
        <span className="number">{day.number}</span>
      </span>
    );
    date = date.clone();
    date.add(1, 'd');
  }

  return (
    <div className="week" key={days[0].toString()}>
      {days}
    </div>
  );
}

Week.propTypes = {
  date: React.PropTypes.object,  // eslint-disable-line
  month: React.PropTypes.object, // eslint-disable-line
  select: React.PropTypes.func,
  selected: React.PropTypes.object, // eslint-disable-line
  isTodaySigned: React.PropTypes.bool,
  signedDays: React.PropTypes.arrayOf(React.PropTypes.string),
};

export default Week;
