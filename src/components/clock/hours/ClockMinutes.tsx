import React, { FC } from 'react';
import { format2Digits, getClockItemPosition } from '../../../utils/clock';
import classNames from 'classnames';
import { format } from 'date-fns';
import { ClockPrecision } from '../Clock';

interface ClockMinuteProps {
  date?: Date | null;
  precision: ClockPrecision;
  index: number;
  containerRadius: number;
}

const ClockMinute: FC<ClockMinuteProps> = ({ date, precision, index, containerRadius }) => {
  const value = index === 11 ? 0 : (index + 1) * 5;

  const label = format2Digits(value);

  return value % precision === 0 ? (
    <span
      className={classNames({ selected: date && format(date, 'mm') === label })}
      style={getClockItemPosition(index, containerRadius, containerRadius - 20)}>
      {label}
    </span>
  ) : null;
};

interface ClockMinutesProps {
  date?: Date | null;
  containerRadius: number;
  precision: ClockPrecision;
}

const ClockMinutes: FC<ClockMinutesProps> = ({ date, containerRadius, precision }) => (
  <>
    {Array(12)
      .fill('')
      .map((_, index) => (
        <ClockMinute key={index} date={date} precision={precision} index={index} containerRadius={containerRadius} />
      ))}
  </>
);

export default ClockMinutes;
