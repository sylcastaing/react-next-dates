import React, { FC, useState } from 'react';
import {
  DateChangeHandler,
  DatePredicate,
  DateRangeInputType,
  Modifiers,
  ModifiersClassNames,
  NullableDateChangeHandler,
} from '../../index';
import Calendar from '../calendar/Calendar';
import { isAfter, isBefore, isSameDay, startOfDay, startOfMonth } from 'date-fns';
import { useControllableState } from '../../hooks/utils';
import { constVoid } from '../../utils/function';
import { isRangeLengthValid, setTimeOrRemoveTime } from '../../utils/date';
import { mergeModifiers } from '../../utils/modifiers';

export interface DateRangePickerCalendarProps {
  locale: Locale;
  focus: DateRangeInputType;
  startDate?: Date | null;
  endDate?: Date | null;
  month?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  minLength?: number;
  maxLength?: number;
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
  minLength = 0,
  maxLength,
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

  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const displayedStartDate = startDate ? startOfDay(startDate) : null;
  const displayedEndDate = endDate ? startOfDay(endDate) : null;

  const isStartDate: DatePredicate = date => displayedStartDate !== null && isSameDay(date, displayedStartDate);
  const isEndDate: DatePredicate = date => displayedEndDate !== null && isSameDay(date, displayedEndDate);

  const isSelectedMiddleDate: DatePredicate = date =>
    displayedStartDate !== null &&
    displayedEndDate !== null &&
    isAfter(date, displayedStartDate) &&
    isBefore(date, displayedEndDate);

  const isHoverDate: DatePredicate = date =>
    hoveredDate !== null &&
    displayedStartDate !== null &&
    displayedEndDate === null &&
    isAfter(date, displayedStartDate) &&
    (isBefore(date, hoveredDate) || isSameDay(date, hoveredDate));

  const isMiddleDate: DatePredicate = date => isSelectedMiddleDate(date) || isHoverDate(date);

  const modifiers = mergeModifiers(
    {
      selectedStart: isStartDate,
      selectedMiddle: isMiddleDate,
      selectedEnd: isEndDate,
      disabled: date => {
        if (focus === 'endDate' && startDate !== null) {
          return isAfter(date, startOfDay(startDate)) && !isRangeLengthValid(startDate, date, minLength, maxLength);
        } else if (focus === 'startDate' && endDate !== null) {
          return isBefore(date, startOfDay(endDate)) && !isRangeLengthValid(date, endDate, minLength, maxLength);
        }

        return false;
      },
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
      onHover={setHoveredDate}
    />
  );
};

export default DateRangePickerCalendar;
