import React, { FC } from 'react';
import { formatDate } from '../../../utils/date';

interface CalendarMonthProps {
  locale: Locale;
  month: Date;
  onSelect: (month: Date) => void;
}

const CalendarMonth: FC<CalendarMonthProps> = ({ month, locale, onSelect }) => {
  const handleClick = () => onSelect(month);

  return (
    <span className="month" onClick={handleClick}>
      {formatDate(month, 'LLLL', locale)}
    </span>
  );
};

export default CalendarMonth;
