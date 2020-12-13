import React, { FC } from 'react';
import { getDate } from 'date-fns';
import { formatDate } from '../../../utils/date';

interface CalendarDayProps {
  locale: Locale;
  day: Date;
  onClick: () => void;
  onHover: () => void;
}

const CalendarDay: FC<CalendarDayProps> = ({ locale, day }) => {
  const dayNumber = getDate(day);

  return (
    <span className="day">
      {dayNumber === 1 && <span className="day-month">{formatDate(day, 'LLL', locale)}</span>}
      <span className="day-number">{dayNumber}</span>
    </span>
  );
};

export default CalendarDay;
