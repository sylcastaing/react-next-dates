import React, { FC, FocusEventHandler, ReactNode, useState } from 'react';

import {
  CalendarModifiers,
  CalendarModifiersClassNames,
  ClockPrecision,
  ClockSelection,
  DateChangeHandler,
  DatePickerInputProps,
  NullableDateChangeHandler,
} from '../../index';

import { constVoid } from '../../utils/function';
import { useDetectTouch, useOutsideClickHandler } from '../../hooks/utils';
import Popper from '../popper/Popper';
import DatePickerCalendar from '../date-picker-calendar/DatePickerCalendar';
import Clock from '../clock/Clock';
import { startOfDay } from 'date-fns';
import { setTime } from '../../utils/date';
import useDateInput, { UseDateInputValue } from '../../hooks/useDateInput';

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

type DateTimePickerFocus = 'date' | 'time';

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

  const [focus, setFocus] = useState<DateTimePickerFocus | null>(null);

  const [clockSelection, setClockSelection] = useState<ClockSelection>('hours');

  const [dateInputRef, timeInputRef, popperRef] = useOutsideClickHandler<
    HTMLInputElement,
    HTMLInputElement,
    HTMLDivElement
  >(() => {
    setFocus(null);
    setClockSelection('hours');
  });

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
    if (d) {
      onChange(setTime(date ?? new Date(), d));
    } else if (date) {
      onChange(startOfDay(date));
    } else {
      onChange(d);
    }
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

  const getRefFromFocus = (focus: DateTimePickerFocus | null) =>
    focus === 'time' ? timeInputRef.current : dateInputRef.current;

  const handleFocus =
    (inputProps: UseDateInputValue, focus: DateTimePickerFocus): FocusEventHandler<HTMLInputElement> =>
    e => {
      inputProps.onFocus(e);

      if (autoOpen) {
        setFocus(focus);
      }

      if (readOnly) {
        getRefFromFocus(focus)?.blur();
      }
    };

  return (
    <>
      {children({
        dateInputProps: {
          ...dateInputProps,
          onFocus: handleFocus(dateInputProps, 'date'),
          ref: dateInputRef,
          readOnly,
        },
        timeInputProps: {
          ...timeInputProps,
          onFocus: handleFocus(timeInputProps, 'time'),
          onBlur: e => {
            timeInputProps.onBlur(e);

            setFocus(null);
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
        referenceElement={getRefFromFocus(focus)}
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
