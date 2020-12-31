import React, { FC } from 'react';
import { format2Digits, getClockItemPosition } from '../../../utils/clock';
import classNames from 'classnames';
import { format } from 'date-fns';

interface ClockMinuteProps {
  date?: Date | null;
  index: number;
  containerRadius: number;
}

const ClockMinute: FC<ClockMinuteProps> = ({ date, index, containerRadius }) => {
  const label = format2Digits(index === 11 ? 0 : (index + 1) * 5);

  return (
    <span
      className={classNames({ selected: date && format(date, 'mm') === label })}
      style={getClockItemPosition(index, containerRadius, containerRadius - 20)}>
      {label}
    </span>
  );
};

interface ClockMinutesProps {
  date?: Date | null;
  containerRadius: number;
}

const ClockMinutes: FC<ClockMinutesProps> = ({ date, containerRadius }) => (
  <>
    {Array(12)
      .fill('')
      .map((_, index) => (
        <ClockMinute key={index} date={date} index={index} containerRadius={containerRadius} />
      ))}
  </>
);

export default ClockMinutes;
