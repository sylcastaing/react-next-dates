import React, { FC } from 'react';
import { CalendarModifiers, CalendarModifiersClassNames, CalendarType, DateChangeHandler } from '../../index';
import { useControllableState } from '../../hooks/utils';
import { isSameDay, isSameMonth, isSameYear, startOfMonth } from 'date-fns';
import Calendar from '../calendar/Calendar';
import { isDateInRange, removeTime, setTime } from '../../utils/date';
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

  const modifiers = mergeCalendarModifiers(
    {
      day: {
        selected: isSelected,
        disabled: isSelected,
      },
      month: {
        selected: isSelected,
        disabled: isSelected,
      },
      year: {
        selected: isSelected,
        disabled: isSelected,
      },
    },
    receivedModifiers,
  );

  const handleSelectDate: DateChangeHandler = d => {
    if (onDateChange) {
      onDateChange(date ? setTime(d, date) : removeTime(d));
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
