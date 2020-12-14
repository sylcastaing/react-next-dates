import React, { FC } from 'react';
import {
  DateChangeHandler,
  DateRangeInputType,
  Modifiers,
  ModifiersClassNames,
  NullableDateChangeHandler,
} from '../../index';
import Calendar from '../calendar/Calendar';
import { isAfter, isBefore, isSameDay, startOfDay, startOfMonth } from 'date-fns';
import { useControllableState } from '../../hooks/utils';
import { constVoid } from '../../utils/function';
import { setTimeOrRemoveTime } from '../../utils/date';
import { mergeModifiers } from '../../utils/modifiers';

export interface DateRangePickerCalendarProps {
  locale: Locale;
  focus: DateRangeInputType;
  startDate?: Date | null;
  endDate?: Date | null;
  month?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  className?: string;
  onStartDateChange?: NullableDateChangeHandler;
  onEndDateChange?: NullableDateChangeHandler;
  onFocusChange: (focus: DateRangeInputType | null) => void;
  onMonthChange?: DateChangeHandler;
}

const DateRangePickerCalendar: FC<DateRangePickerCalendarProps> = ({
  locale,
  focus,
  startDate = null,
  endDate = null,
  month: receivedMonth,
  minDate,
  maxDate,
  modifiers: receivedModifiers,
  modifiersClassNames,
  className,
  onStartDateChange = constVoid,
  onEndDateChange = constVoid,
  onFocusChange,
  onMonthChange,
}) => {
  const [month, setMonth] = useControllableState(
    () => startOfMonth(startDate ?? endDate ?? new Date()),
    receivedMonth ?? undefined,
    onMonthChange,
  );

  const displayedStartDate = startDate ? startOfDay(startDate) : null;
  const displayedEndDate = endDate ? startOfDay(endDate) : null;

  const modifiers = mergeModifiers(
    {
      selectedStart: date => displayedStartDate !== null && isSameDay(date, displayedStartDate),
      selectedMiddle: date =>
        displayedStartDate !== null &&
        displayedEndDate !== null &&
        isAfter(date, displayedStartDate) &&
        isBefore(date, displayedEndDate),
      selectedEnd: date => displayedEndDate !== null && isSameDay(date, displayedEndDate),
    },
    receivedModifiers,
  );

  const handleSelectDate: DateChangeHandler = d => {
    if (focus === 'startDate') {
      const date = setTimeOrRemoveTime(d, startDate);

      if (endDate !== null && isAfter(date, endDate)) {
        onEndDateChange(null);
      }

      onStartDateChange(date);
      onFocusChange('endDate');
    } else if (focus === 'endDate') {
      const date = setTimeOrRemoveTime(d, endDate);

      if (startDate !== null && isBefore(date, startDate)) {
        onStartDateChange(setTimeOrRemoveTime(d, startDate));
        onEndDateChange(null);
        onFocusChange('endDate');
      } else {
        onEndDateChange(date);
        onFocusChange(null);
      }
    }
  };

  return (
    <Calendar
      type="day"
      locale={locale}
      month={month}
      minDate={minDate}
      maxDate={maxDate}
      modifiers={{ day: modifiers }}
      modifiersClassNames={{ day: modifiersClassNames }}
      className={className}
      onMonthChange={setMonth}
      onSelect={handleSelectDate}
    />
  );
};

export default DateRangePickerCalendar;
