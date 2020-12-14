import React, { FC } from 'react';
import {
  CalendarModifiers,
  CalendarModifiersClassNames,
  CalendarType,
  DateChangeHandler,
  Modifiers,
} from '../../index';
import { useControllableState } from '../../hooks/utils';
import { isSameDay, isSameMonth, isSameYear, startOfDay, startOfMonth } from 'date-fns';
import Calendar from '../calendar/Calendar';
import { isDateInRange, setTime } from '../../utils/date';
import { mergeCalendarModifiers } from '../../utils/modifiers';

export interface DatePickerCalendarProps {
  locale: Locale;
  type?: CalendarType;
  date?: Date | null;
  month?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  modifiers?: CalendarModifiers;
  modifiersClassNames?: CalendarModifiersClassNames;
  className?: string;
  onDateChange?: DateChangeHandler;
  onMonthChange?: DateChangeHandler;
}

const DatePickerCalendar: FC<DatePickerCalendarProps> = ({
  locale,
  type,
  date,
  month: receivedMonth,
  minDate,
  maxDate,
  modifiers: receivedModifiers,
  modifiersClassNames,
  className,
  onDateChange,
  onMonthChange,
}) => {
  const [month, setMonth] = useControllableState(
    () => startOfMonth(date ?? new Date()),
    receivedMonth ?? undefined,
    onMonthChange,
  );

  const isSelected = (d: Date) => {
    if (!date || !isDateInRange(d, minDate, maxDate)) {
      return false;
    }

    switch (type) {
      case 'month':
        return isSameMonth(d, date);
      case 'year':
        return isSameYear(d, date);
      default:
        return isSameDay(d, date);
    }
  };

  const baseModifier: Modifiers = { selected: isSelected };

  const modifiers = mergeCalendarModifiers(
    {
      day: baseModifier,
      month: baseModifier,
      year: baseModifier,
    },
    receivedModifiers,
  );

  const handleSelectDate: DateChangeHandler = d => {
    if (onDateChange) {
      onDateChange(date ? setTime(d, date) : startOfDay(d));
    }
  };

  return (
    <Calendar
      locale={locale}
      type={type}
      month={month}
      minDate={minDate}
      maxDate={maxDate}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      className={className}
      onMonthChange={setMonth}
      onSelect={handleSelectDate}
    />
  );
};

export default DatePickerCalendar;
