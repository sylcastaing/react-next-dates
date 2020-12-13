import React, { FC, useMemo } from 'react';
import { setMonth } from 'date-fns';
import CalendarMonth from './CalendarMonth';

interface CalendarMonthGridProps {
  locale: Locale;
  month: Date;
  onMonthChange: (month: Date) => void;
}

const CalendarMonthGrid: FC<CalendarMonthGridProps> = ({ locale, month, onMonthChange }) => {
  const months = useMemo(
    () =>
      Array(12)
        .fill('')
        .map((_, i) => setMonth(month, i), locale),
    [locale, month],
  );

  return (
    <div className="month-grid">
      {months.map(month => (
        <CalendarMonth locale={locale} month={month} onSelect={onMonthChange} />
      ))}
    </div>
  );
};

export default CalendarMonthGrid;
