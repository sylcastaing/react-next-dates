import React, { FC, Fragment } from 'react';
import { getClockItemPosition } from '../../../utils/clock';
import { format, getHours } from 'date-fns';
import classNames from 'classnames';

interface ClockHourProps {
  date?: Date | null;
  index: number;
  containerRadius: number;
}

const ClockAMHour: FC<ClockHourProps> = ({ date, index, containerRadius }) => {
  const label = index + 1;

  return (
    <span
      className={classNames({ selected: date && getHours(date) === label })}
      style={getClockItemPosition(index, containerRadius, containerRadius - 20)}>
      {label}
    </span>
  );
};

const ClockPMHour: FC<ClockHourProps> = ({ date, index, containerRadius }) => {
  const hour = index + 13;

  const label = hour === 24 ? '00' : `${hour}`;

  return (
    <span
      className={classNames({ selected: date && format(date, 'HH') === label })}
      style={getClockItemPosition(index, containerRadius, containerRadius / 2)}>
      {label}
    </span>
  );
};

interface ClockHoursProps {
  date?: Date | null;
  containerRadius: number;
}

const ClockHours: FC<ClockHoursProps> = ({ date, containerRadius }) => (
  <>
    {Array(12)
      .fill('')
      .map((_, index) => (
        <Fragment key={index}>
          <ClockAMHour date={date} index={index} containerRadius={containerRadius} />
          <ClockPMHour date={date} index={index} containerRadius={containerRadius} />
        </Fragment>
      ))}
  </>
);

export default ClockHours;
