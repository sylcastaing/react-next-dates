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
import Popper from '../popper/Popper';
import DateRangePickerCalendar from '../date-range-picker-calendar/DateRangePickerCalendar';

export interface DateRangePickerChildrenProps {
  startDateInputProps: DatePickerInputProps;
  endDateInputProps: DatePickerInputProps;
  openStartDatePicker: () => void;
  openEndDatePicker: () => void;
}

export type DateRangePickerChildren = (props: DateRangePickerChildrenProps) => ReactNode;

export interface DateRangePickerProps {
  locale: Locale;
  format?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  minLength?: number;
  maxLength?: number;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;
  className?: string;
  portalContainer?: Element;
  readonlyOnTouch?: boolean;
  autoOpen?: boolean;
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
  minLength = 0,
  maxLength,
  modifiers,
  modifiersClassNames,
  startDatePlaceholder,
  endDatePlaceholder,
  className,
  portalContainer,
  readonlyOnTouch = true,
  autoOpen = true,
  onStartDateChange = constVoid,
  onEndDateChange = constVoid,
  children,
}) => {
  const [month, setMonth] = useState(startDate ?? endDate ?? new Date());

  const [focus, setFocus] = useState<DateRangeInputType | null>(null);
  const [popperFocus, setPopperFocus] = useState<DateRangeInputType | null>(null);

  const [startDateInputRef, endDateInputRef, popperRef] = useOutsideClickHandler<
    HTMLInputElement,
    HTMLInputElement,
    HTMLDivElement
  >(() => setFocus(null));

  const openStartDatePicker = () => {
    setFocus('startDate');
    startDateInputRef.current?.focus();
  };

  const openEndDatePicker = () => {
    setFocus('endDate');
    endDateInputRef.current?.focus();
  };

  const isTouch = useDetectTouch();

  const prevFocus = usePrevious(focus);

  useEffect(() => {
    if (prevFocus === null) {
      setPopperFocus(focus);
    }

    if (prevFocus === 'startDate' && focus === 'endDate') {
      endDateInputRef.current?.focus();
    }
  }, [focus, prevFocus, endDateInputRef]);

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
    placeholder: startDatePlaceholder,
    onChange: handleStartDateInputChange,
  });

  const endDateInputProps = useDateInput({
    date: endDate,
    locale,
    format,
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

            if (autoOpen) {
              setFocus('startDate');
            }

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

            if (autoOpen) {
              setFocus('endDate');
            }

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
        openStartDatePicker,
        openEndDatePicker,
      })}

      <Popper
        ref={popperRef}
        isOpen={focus !== null}
        referenceElement={popperFocus === 'endDate' ? endDateInputRef.current : startDateInputRef.current}
        popperElement={popperRef.current}
        portalContainer={portalContainer}
        className="date">
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
          onFocusChange={setFocus}
          onMonthChange={setMonth}
        />
      </Popper>
    </>
  );
};

export default DateRangePicker;
