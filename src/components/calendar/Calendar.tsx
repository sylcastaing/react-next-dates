import React, { FC, useState } from 'react';
import CalendarDayGrid from './day/CalendarDayGrid';

import classNames from 'classnames';
import CalendarNavigation from './navigation/CalendarNavigation';
import { startOfMonth } from 'date-fns';
import CalendarYearGrid from './year/CalendarYearGrid';
import CalendarMonthGrid from './month/CalendarMonthGrid';

export type CalendarMode = 'day' | 'month' | 'year';

export interface CalendarProps {
  locale: Locale;
  date?: Date;
  className?: string;
}

const Calendar: FC<CalendarProps> = ({ locale, date, className }) => {
  const [mode, setMode] = useState<CalendarMode>('day');

  const [month, setMonth] = useState(() => startOfMonth(date ?? new Date()));

  const handleSelectYear = (year: Date) => {
    setMonth(year);
    setMode('month');
  };

  const handleSelectMonth = (month: Date) => {
    setMonth(month);
    setMode('day');
  };

  return (
    <div className={classNames('react-next-dates', 'calendar', className)}>
      <CalendarNavigation locale={locale} month={month} mode={mode} onChangeMonth={setMonth} onChangeMode={setMode} />

      {mode === 'day' ? (
        <CalendarDayGrid locale={locale} month={month} onMonthChange={setMonth} />
      ) : mode === 'year' ? (
        <CalendarYearGrid month={month} onYearChange={handleSelectYear} />
      ) : (
        <CalendarMonthGrid locale={locale} month={month} onMonthChange={handleSelectMonth} />
      )}
    </div>
  );
};

export default Calendar;
