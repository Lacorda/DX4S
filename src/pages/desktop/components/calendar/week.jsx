import React from 'react';

function Week(props) {
  let date = props.date;
  const { month, select, selected, signedDays, completeSuccess } = props;
  const days = [];

  for (let i = 0; i < 7; i += 1) {
    const day = {
      name: date.format('dd').substring(0, 1),
      number: date.date(),
      isCurrentMonth: date.month() === month.month(),
      isToday: date.isSame(new Date(), 'day'),
      isSigned: signedDays.indexOf(date.format('YYYY-MM-DD')) !== -1 || signedDays.indexOf(date.format('YYYY-M-DD')) !== -1,
      completeSuccess,
      date,
    };
    let extendsClassName = '';
    if (!day.isCurrentMonth) {
      extendsClassName = 'different-month';
    } else if (day.isSigned) {
      // 通过接口获取到的已签到日期，signed(已签到)
      extendsClassName = 'signed';
      // 同时，是当天, signed today（当天+已签到）
      if (day.isToday) {
        extendsClassName = 'today signed';
      }
    } else if (day.date.isSame(selected)) {
      // 当前选中日期，selected(选中-灰色背景)
      extendsClassName = 'selected';
      // 选中的是当天日期，还是today(当天样式)
      if (day.isToday) {
        extendsClassName = 'today';
        // 选中的是当天日期，刚刚签到成功，today signed(当天+签到)。PS：此状态用于处理签到成功瞬间服务端返回list异步问题
        if (day.completeSuccess) {
          extendsClassName = 'today signed';
        }
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
  completeSuccess: React.PropTypes.bool,
  signedDays: React.PropTypes.arrayOf(React.PropTypes.string),
};

export default Week;
