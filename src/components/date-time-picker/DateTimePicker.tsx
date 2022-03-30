import {
  CalendarModifiers,
  CalendarModifiersClassNames,
  ClockPrecision,
  ClockSelection,
  DateChangeHandler,
  DatePickerInputProps,
  NullableDateChangeHandler,
  useDateInput,
} from '../../index';
import React, { FC, ReactNode, useState } from 'react';
import { constVoid } from '../../utils/function';
import { useDetectTouch, useOutsideClickHandler } from '../../hooks/utils';
import Popper from '../popper/Popper';
import DatePickerCalendar from '../date-picker-calendar/DatePickerCalendar';
import Clock from '../clock/Clock';
import { startOfDay } from 'date-fns';
import { setTime } from '../../utils/date';

export interface DateTimePickerChildrenProps {
  dateInputProps: DatePickerInputProps;
  timeInputProps: DatePickerInputProps;
  openDatePicker: () => void;
  openTimePicker: () => void;
}

export type DateTimePickerChildren = (props: DateTimePickerChildrenProps) => ReactNode;

export interface DateTimePickerProps {
  locale: Locale;
  date?: Date | null;
  dateFormat?: string;
  timeFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  datePlaceholder?: string;
  timePlaceholder?: string;
  timePrecision?: ClockPrecision;
  vibrate?: boolean;
  className?: string;
  modifiers?: CalendarModifiers;
  modifiersClassNames?: CalendarModifiersClassNames;
  portalContainer?: Element;
  readonlyOnTouch?: boolean;
  autoOpen?: boolean;
  onChange?: NullableDateChangeHandler;
  children: DateTimePickerChildren;
}

const DateTimePicker: FC<DateTimePickerProps> = ({
  locale,
  date,
  dateFormat,
  timeFormat = 'HH:mm',
  minDate,
  maxDate,
  datePlaceholder,
  timePlaceholder,
  timePrecision = 1,
  vibrate = true,
  className,
  modifiers,
  modifiersClassNames,
  portalContainer,
  readonlyOnTouch = true,
  autoOpen = true,
  onChange = constVoid,
  children,
}) => {
  const [month, setMonth] = useState(() => date ?? new Date());

  const [focus, setFocus] = useState<'date' | 'time' | null>(null);

  const [clockSelection, setClockSelection] = useState<ClockSelection>('hours');

  const [dateInputRef, timeInputRef, popperRef] = useOutsideClickHandler<
    HTMLInputElement,
    HTMLInputElement,
    HTMLDivElement
  >(() => setFocus(null));

  const isTouch = useDetectTouch();

  const openDatePicker = () => {
    setFocus('date');
    dateInputRef.current?.focus();
  };

  const openTimePicker = () => {
    setFocus('time');
    timeInputRef.current?.focus();
  };

  const handleDateInputChange: NullableDateChangeHandler = date => {
    onChange(date);

    if (date) {
      setMonth(date);
    }
  };

  const handleTimeInputChange: NullableDateChangeHandler = d => {
    const oldDate = date ?? new Date();

    onChange(setTime(oldDate, d ?? startOfDay(oldDate)));
  };

  const dateInputProps = useDateInput({
    date,
    locale,
    format: dateFormat,
    placeholder: datePlaceholder,
    onChange: handleDateInputChange,
  });

  const timeInputProps = useDateInput({
    date,
    locale,
    format: timeFormat,
    placeholder: timePlaceholder,
    onChange: handleTimeInputChange,
  });

  const handleDateChange: DateChangeHandler = date => {
    onChange(date);

    setFocus('time');

    timeInputRef.current?.focus();
  };

  const handleSelectionEnd = () => setFocus(null);

  const readOnly = readonlyOnTouch && isTouch;

  return (
    <>
      {children({
        dateInputProps: {
          ...dateInputProps,
          onFocus: () => {
            dateInputProps.onFocus();

            if (autoOpen) {
              openDatePicker();
            }

            if (readOnly) {
              dateInputRef.current?.blur();
            }
          },
          ref: dateInputRef,
          readOnly,
        },
        timeInputProps: {
          ...timeInputProps,
          onFocus: () => {
            timeInputProps.onFocus();

            if (autoOpen) {
              openTimePicker();
            }

            if (readOnly) {
              dateInputRef.current?.blur();
            }
          },
          ref: timeInputRef,
          readOnly,
        },
        openDatePicker,
        openTimePicker,
      })}

      <Popper
        ref={popperRef}
        isOpen={focus !== null}
        referenceElement={focus === 'time' ? timeInputRef.current : dateInputRef.current}
        popperElement={popperRef.current}
        portalContainer={portalContainer}
        className={focus === 'time' ? 'time' : 'date'}>
        {focus === 'time' ? (
          <Clock
            locale={locale}
            date={date}
            selection={clockSelection}
            precision={timePrecision}
            vibrate={vibrate}
            className={className}
            onChange={onChange}
            onSelectionChange={setClockSelection}
            onSelectionEnd={handleSelectionEnd}
          />
        ) : (
          <DatePickerCalendar
            locale={locale}
            date={date}
            month={month}
            minDate={minDate}
            maxDate={maxDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className={className}
            onDateChange={handleDateChange}
            onMonthChange={setMonth}
          />
        )}
      </Popper>
    </>
  );
};

export default DateTimePicker;
