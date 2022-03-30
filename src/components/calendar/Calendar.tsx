import React, { FC } from 'react';
import CalendarDayGrid from './day/CalendarDayGrid';

import classNames from 'classnames';
import CalendarNavigation from './navigation/CalendarNavigation';
import {
  endOfMonth,
  endOfYear,
  isAfter,
  isBefore,
  isSameMonth,
  isSameYear,
  set,
  setDate,
  startOfMonth,
  startOfYear,
} from 'date-fns';
import CalendarYearGrid from './year/CalendarYearGrid';
import CalendarMonthGrid from './month/CalendarMonthGrid';
import {
  CalendarModifiers,
  CalendarModifiersClassNames,
  CalendarType,
  DateChangeHandler,
  NullableDateChangeHandler,
} from '../../index';
import { useControllableState, useDependentState } from '../../hooks/utils';
import { mergeCalendarModifiers } from '../../utils/modifiers';
import { isDateInRange } from '../../utils/date';
import { constVoid } from '../../utils/function';

export interface CalendarProps {
  locale: Locale;
  type?: CalendarType;
  month?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  modifiers?: CalendarModifiers;
  modifiersClassNames?: CalendarModifiersClassNames;
  className?: string;
  onMonthChange?: DateChangeHandler;
  onSelect?: DateChangeHandler;
  onHover?: NullableDateChangeHandler;
}

const Calendar: FC<CalendarProps> = ({
  locale,
  type = 'day',
  month: receivedMonth,
  minDate,
  maxDate,
  modifiers: receivedModifiers,
  modifiersClassNames,
  className,
  onMonthChange,
  onSelect = constVoid,
  onHover = constVoid,
}) => {
  const [mode, setMode] = useDependentState<CalendarType>(() => type, [type]);

  const [month, setMonth] = useControllableState(
    () => startOfMonth(new Date()),
    receivedMonth ?? undefined,
    onMonthChange,
  );

  const modifiers = mergeCalendarModifiers(
    {
      day: {
        disabled: date => !isDateInRange(date, minDate, maxDate),
      },
      month: {
        disabled: date =>
          !(minDate ? isBefore(date, endOfMonth(minDate)) || isSameMonth(date, minDate) : false) &&
          !(maxDate ? isAfter(date, startOfMonth(maxDate)) || isSameMonth(date, maxDate) : false),
      },
      year: {
        disabled: date =>
          !(minDate ? isBefore(date, endOfYear(minDate)) || isSameYear(date, minDate) : false) &&
          !(maxDate ? isAfter(date, startOfYear(maxDate)) || isSameYear(date, maxDate) : false),
      },
    },
    receivedModifiers,
  );

  const handleSelectYear = (year: Date) => {
    setMonth(year);

    if (type !== 'year') {
      setMode('month');
    } else {
      onSelect(set(year, { date: 1, month: 0 }));
    }
  };

  const handleSelectMonth = (month: Date) => {
    setMonth(month);

    if (type !== 'month') {
      setMode('day');
    } else {
      onSelect(setDate(month, 1));
    }
  };

  return (
    <div className={classNames('react-next-dates', 'calendar', className)}>
      <CalendarNavigation locale={locale} month={month} mode={mode} onChangeMonth={setMonth} onChangeMode={setMode} />

      {mode === 'day' ? (
        <CalendarDayGrid
          locale={locale}
          month={month}
          modifiers={modifiers.day}
          modifiersClassNames={modifiersClassNames?.day}
          onSelect={onSelect}
          onHover={onHover}
        />
      ) : mode === 'year' ? (
        <CalendarYearGrid
          month={month}
          modifiers={modifiers.year}
          modifiersClassNames={modifiersClassNames?.year}
          onYearChange={handleSelectYear}
        />
      ) : (
        <CalendarMonthGrid
          locale={locale}
          month={month}
          modifiers={modifiers.month}
          modifiersClassNames={modifiersClassNames?.month}
          onMonthChange={handleSelectMonth}
        />
      )}
    </div>
  );
};

export default Calendar;
