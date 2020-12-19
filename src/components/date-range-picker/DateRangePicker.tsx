import React, { FC, ReactNode, useEffect, useState } from 'react';
import {
  DatePickerInputProps,
  DateRangeInputType,
  Modifiers,
  ModifiersClassNames,
  NullableDateChangeHandler,
} from '../../index';
import { useDetectTouch, useOutsideClickHandler, usePrevious } from '../../hooks/utils';
import { useDateInput } from '../../hooks';
import { constVoid } from '../../utils/function';
import CalendarPopper from '../popper/CalendarPopper';
import DateRangePickerCalendar from '../date-range-picker-calendar/DateRangePickerCalendar';

export interface DateRangePickerChildrenProps {
  startDateInputProps: DatePickerInputProps;
  endDateInputProps: DatePickerInputProps;
}

export type DateRangePickerChildren = (props: DateRangePickerChildrenProps) => ReactNode;

export interface DateRangePickerProps {
  locale: Locale;
  format?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;
  className?: string;
  portalContainer?: Element;
  readonlyOnTouch?: boolean;
  onStartDateChange?: NullableDateChangeHandler;
  onEndDateChange?: NullableDateChangeHandler;
  children: DateRangePickerChildren;
}

const DateRangePicker: FC<DateRangePickerProps> = ({
  locale,
  format,
  startDate,
  endDate,
  minDate,
  maxDate,
  modifiers,
  modifiersClassNames,
  startDatePlaceholder,
  endDatePlaceholder,
  className,
  portalContainer,
  readonlyOnTouch = true,
  onStartDateChange = constVoid,
  onEndDateChange = constVoid,
  children,
}) => {
  const [month, setMonth] = useState(startDate ?? endDate ?? new Date());

  const [focus, setFocus] = useState<DateRangeInputType | null>(null);
  const [popperFocus, setPopperFocus] = useState<DateRangeInputType | null>(null);

  const isTouch = useDetectTouch();

  const prevFocus = usePrevious(focus);

  useEffect(() => {
    if (prevFocus === null) {
      setPopperFocus(focus);
    }
  }, [focus, prevFocus]);

  const [startDateInputRef, endDateInputRef, popperRef] = useOutsideClickHandler<
    HTMLInputElement,
    HTMLInputElement,
    HTMLDivElement
  >(() => setFocus(null));

  const handleStartDateInputChange: NullableDateChangeHandler = date => {
    onStartDateChange(date);

    if (date) {
      setMonth(date);
    }
  };

  const handleEndDateInputChange: NullableDateChangeHandler = date => {
    onEndDateChange(date);

    if (date) {
      setMonth(date);
    }
  };

  const startDateInputProps = useDateInput({
    date: startDate,
    locale,
    format,
    minDate,
    maxDate,
    placeholder: startDatePlaceholder,
    onChange: handleStartDateInputChange,
  });

  const endDateInputProps = useDateInput({
    date: endDate,
    locale,
    format,
    minDate,
    maxDate,
    placeholder: endDatePlaceholder,
    onChange: handleEndDateInputChange,
  });

  return (
    <>
      {children({
        startDateInputProps: {
          ...startDateInputProps,
          onFocus: () => {
            startDateInputProps?.onFocus();
            setFocus('startDate');

            if (startDate) {
              setMonth(startDate);
            }

            if (readonlyOnTouch && isTouch) {
              startDateInputRef.current?.blur();
            }
          },
          ref: startDateInputRef,
          readOnly: readonlyOnTouch && isTouch,
        },
        endDateInputProps: {
          ...endDateInputProps,
          onFocus: () => {
            endDateInputProps?.onFocus();
            setFocus('endDate');

            if (endDate) {
              setMonth(endDate);
            }

            if (readonlyOnTouch && isTouch) {
              endDateInputRef.current?.blur();
            }
          },
          ref: endDateInputRef,
          readOnly: readonlyOnTouch && isTouch,
        },
      })}

      <CalendarPopper
        ref={popperRef}
        isOpen={focus !== null}
        inputElement={popperFocus === 'endDate' ? endDateInputRef.current : startDateInputRef.current}
        popperElement={popperRef.current}
        portalContainer={portalContainer}>
        <DateRangePickerCalendar
          locale={locale}
          focus={focus ?? 'startDate'}
          startDate={startDate}
          endDate={endDate}
          month={month}
          minDate={minDate}
          maxDate={maxDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className={className}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onFocusChange={setFocus}
          onMonthChange={setMonth}
        />
      </CalendarPopper>
    </>
  );
};

export default DateRangePicker;
