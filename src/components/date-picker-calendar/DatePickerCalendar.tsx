import React, { FC } from 'react';
import {
  CalendarModifiers,
  CalendarModifiersClassNames,
  CalendarType,
  DateChangeHandler,
  Modifiers,
} from '../../index';
import { useControllableState } from '../../hooks/utils';
import { isSameDay, isSameMonth, isSameYear, startOfMonth } from 'date-fns';
import Calendar from '../calendar/Calendar';
import { isDateInRange, setTimeOrRemoveTime } from '../../utils/date';
import { mergeCalendarModifiers } from '../../utils/modifiers';
import { constVoid } from '../../utils/function';

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
  type = 'day',
  date = null,
  month: receivedMonth,
  minDate,
  maxDate,
  modifiers: receivedModifiers,
  modifiersClassNames,
  className,
  onDateChange = constVoid,
  onMonthChange,
}) => {
  const [month, setMonth] = useControllableState(
    () => startOfMonth(date ?? new Date()),
    receivedMonth ?? undefined,
    onMonthChange,
  );

  const isSelected = (d: Date) => {
    if (date === null || !isDateInRange(d, minDate, maxDate)) {
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

  const handleSelectDate: DateChangeHandler = d => onDateChange(setTimeOrRemoveTime(d, date));

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
