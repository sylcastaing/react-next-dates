import React, { FC, FocusEventHandler, ReactNode, useState } from 'react';
import {
  ClockPrecision,
  ClockSelection,
  DatePickerInputProps,
  DateRangeInputType,
  Modifiers,
  ModifiersClassNames,
  NullableDateChangeHandler,
} from '../../index';
import { constVoid } from '../../utils/function';
import { useDetectTouch, useOutsideClickHandler } from '../../hooks/utils';
import { setTime } from '../../utils/date';
import { startOfDay } from 'date-fns';
import Popper from '../popper/Popper';
import Clock from '../clock/Clock';
import DateRangePickerCalendar from '../date-range-picker-calendar/DateRangePickerCalendar';
import useDateInput, { UseDateInputValue } from '../../hooks/useDateInput';

export interface DateTimeRangePickerChildrenProps {
  startDateInputProps: DatePickerInputProps;
  startTimeInputProps: DatePickerInputProps;
  endDateInputProps: DatePickerInputProps;
  endTimeInputProps: DatePickerInputProps;
  openStartDatePicker: () => void;
  openStartTimePicker: () => void;
  openEndDatePicker: () => void;
  openEndTimePicker: () => void;
}

export type DateTimeRangePickerChildren = (props: DateTimeRangePickerChildrenProps) => ReactNode;

export interface DateTimeRangePickerProps {
  locale: Locale;
  dateFormat?: string;
  timeFormat?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  minLength?: number;
  maxLength?: number;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  startDatePlaceholder?: string;
  startTimePlaceholder?: string;
  endDatePlaceholder?: string;
  endTimePlaceholder?: string;
  timePrecision?: ClockPrecision;
  vibrate?: boolean;
  className?: string;
  portalContainer?: Element;
  readonlyOnTouch?: boolean;
  autoOpen?: boolean;
  onStartDateChange?: NullableDateChangeHandler;
  onEndDateChange?: NullableDateChangeHandler;
  children: DateTimeRangePickerChildren;
}

type DateTimeRangePickerFocus = 'startDate' | 'startTime' | 'endDate' | 'endTime';

const DateTimeRangePicker: FC<DateTimeRangePickerProps> = ({
  locale,
  dateFormat,
  timeFormat = 'HH:mm',
  startDate,
  endDate,
  minDate,
  maxDate,
  minLength = 0,
  maxLength,
  modifiers,
  modifiersClassNames,
  startDatePlaceholder,
  startTimePlaceholder,
  endDatePlaceholder,
  endTimePlaceholder,
  timePrecision = 1,
  vibrate = true,
  className,
  portalContainer,
  readonlyOnTouch = true,
  autoOpen = true,
  onStartDateChange = constVoid,
  onEndDateChange = constVoid,
  children,
}) => {
  const [month, setMonth] = useState(() => startDate ?? endDate ?? new Date());

  const [focus, setFocus] = useState<DateTimeRangePickerFocus | null>(null);

  const [clockSelection, setClockSelection] = useState<ClockSelection>('hours');

  const [startDateInputRef, startTimeInputRef, endDateInputRef, endTimeInputRef, popperRef] = useOutsideClickHandler<
    HTMLInputElement,
    HTMLInputElement,
    HTMLInputElement,
    HTMLInputElement,
    HTMLDivElement
  >(() => {
    setFocus(null);
    setClockSelection('hours');
  });

  const isTouch = useDetectTouch();

  const openStartDatePicker = () => {
    setFocus('startDate');
    startDateInputRef.current?.focus();
  };

  const openStartTimePicker = () => {
    setFocus('startTime');
    startTimeInputRef.current?.focus();
  };

  const openEndDatePicker = () => {
    setFocus('endDate');
    endDateInputRef.current?.focus();
  };

  const openEndTimePicker = () => {
    setFocus('endTime');
    endTimeInputRef.current?.focus();
  };

  const handleStartDateInputChange: NullableDateChangeHandler = date => {
    onStartDateChange(date);

    if (date) {
      setMonth(date);
    }
  };

  const handleStartTimeInputChange: NullableDateChangeHandler = d => {
    if (d) {
      onStartDateChange(setTime(startDate ?? new Date(), d));
    } else if (startDate) {
      onStartDateChange(startOfDay(startDate));
    } else {
      onStartDateChange(d);
    }
  };

  const handleEndDateInputChange: NullableDateChangeHandler = date => {
    onEndDateChange(date);

    if (date) {
      setMonth(date);
    }
  };

  const handleEndTimeInputChange: NullableDateChangeHandler = d => {
    if (d) {
      onEndDateChange(setTime(endDate ?? new Date(), d));
    } else if (endDate) {
      onEndDateChange(startOfDay(endDate));
    } else {
      onEndDateChange(d);
    }
  };

  const startDateInputProps = useDateInput({
    date: startDate,
    locale,
    format: dateFormat,
    placeholder: startDatePlaceholder,
    onChange: handleStartDateInputChange,
  });

  const startTimeInputProps = useDateInput({
    date: startDate,
    locale,
    format: timeFormat,
    placeholder: startTimePlaceholder,
    onChange: handleStartTimeInputChange,
  });

  const endDateInputProps = useDateInput({
    date: endDate,
    locale,
    format: dateFormat,
    placeholder: endDatePlaceholder,
    onChange: handleEndDateInputChange,
  });

  const endTimeInputProps = useDateInput({
    date: endDate,
    locale,
    format: timeFormat,
    placeholder: endTimePlaceholder,
    onChange: handleEndTimeInputChange,
  });

  const readOnly = readonlyOnTouch && isTouch;

  const getRefFromFocus = (focus: DateTimeRangePickerFocus | null) => {
    switch (focus) {
      case 'startTime':
        return startTimeInputRef.current;
      case 'endDate':
        return endDateInputRef.current;
      case 'endTime':
        return endTimeInputRef.current;
      default:
        return startDateInputRef.current;
    }
  };

  const handleRangeFocusChange = (focus: DateRangeInputType | null) =>
    setFocus(oldFocus => {
      if (oldFocus === 'endDate' && focus === 'endDate') {
        return 'endDate';
      }

      return oldFocus === 'startDate' ? 'startTime' : 'endTime';
    });

  const handleTimeSelectionEnd = () => setFocus(old => (old === 'startTime' ? 'endDate' : null));

  const handleFocus =
    (inputProps: UseDateInputValue, focus: DateTimeRangePickerFocus): FocusEventHandler<HTMLInputElement> =>
    e => {
      inputProps.onFocus(e);

      if (focus === 'startDate' && startDate) {
        setMonth(startDate);
      } else if (focus === 'endDate' && endDate) {
        setMonth(endDate);
      }

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
        startDateInputProps: {
          ...startDateInputProps,
          onFocus: handleFocus(startDateInputProps, 'startDate'),
          ref: startDateInputRef,
          readOnly,
        },
        startTimeInputProps: {
          ...startTimeInputProps,
          onFocus: handleFocus(startTimeInputProps, 'startTime'),
          ref: startTimeInputRef,
          readOnly,
        },
        endDateInputProps: {
          ...endDateInputProps,
          onFocus: handleFocus(endDateInputProps, 'endDate'),
          ref: endDateInputRef,
          readOnly,
        },
        endTimeInputProps: {
          ...endTimeInputProps,
          onFocus: handleFocus(endTimeInputProps, 'endTime'),
          ref: endTimeInputRef,
          readOnly,
        },
        openStartDatePicker,
        openStartTimePicker,
        openEndDatePicker,
        openEndTimePicker,
      })}

      <Popper
        ref={popperRef}
        isOpen={focus !== null}
        referenceElement={getRefFromFocus(focus)}
        popperElement={popperRef.current}
        portalContainer={portalContainer}
        className={focus === 'startTime' || focus === 'endTime' ? 'time' : 'date'}>
        {focus === 'startTime' || focus === 'endTime' ? (
          <Clock
            locale={locale}
            date={focus === 'startTime' ? startDate : endDate}
            selection={clockSelection}
            precision={timePrecision}
            vibrate={vibrate}
            className={className}
            onChange={focus === 'startTime' ? onStartDateChange : onEndDateChange}
            onSelectionChange={setClockSelection}
            onSelectionEnd={handleTimeSelectionEnd}
          />
        ) : (
          <DateRangePickerCalendar
            locale={locale}
            focus={focus ?? 'startDate'}
            startDate={startDate}
            endDate={endDate}
            month={month}
            minDate={minDate}
            maxDate={maxDate}
            minLength={minLength}
            maxLength={maxLength}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className={className}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            onFocusChange={handleRangeFocusChange}
            onMonthChange={setMonth}
          />
        )}
      </Popper>
    </>
  );
};

export default DateTimeRangePicker;
