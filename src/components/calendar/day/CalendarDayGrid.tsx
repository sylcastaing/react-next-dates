import React, { FC, useMemo } from 'react';
import {
  addWeeks,
  differenceInCalendarWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import CalendarDay from './CalendarDay';
import CalendarDayHeader from './CalendarDayHeader';
import { Modifiers, ModifiersClassNames } from '../../../index';

function rowsBetweenDates(startDate: Date, endDate: Date, locale: Locale) {
  return differenceInCalendarWeeks(endDate, startDate, { locale }) + 1;
}

function rowsInMonth(date: Date, locale: Locale) {
  return rowsBetweenDates(startOfMonth(date), endOfMonth(date), locale);
}

function getStartDate(date: Date, locale: Locale) {
  return startOfWeek(startOfMonth(date), { locale });
}

function getEndDate(date: Date, locale: Locale) {
  return endOfWeek(addWeeks(endOfMonth(date), 6 - rowsInMonth(date, locale)), { locale });
}

interface CalendarDayGridProps {
  locale: Locale;
  month: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  onSelect: (date: Date) => void;
}

const CalendarDayGrid: FC<CalendarDayGridProps> = ({ locale, month, modifiers, modifiersClassNames, onSelect }) => {
  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: getStartDate(month, locale),
        end: getEndDate(month, locale),
      }),
    [month, locale],
  );

  return (
    <div className="day-grid">
      <CalendarDayHeader locale={locale} />

      <div className="day-grid-content">
        {days.map(day => (
          <CalendarDay
            key={day.toISOString()}
            locale={locale}
            day={day}
            month={month}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            onClick={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarDayGrid;
