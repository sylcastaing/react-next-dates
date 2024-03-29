import React, { FC, ReactNode, useState } from 'react';
import {
  CalendarModifiers,
  CalendarModifiersClassNames,
  CalendarType,
  DateChangeHandler,
  DatePickerInputProps,
  NullableDateChangeHandler,
} from '../../index';
import useDateInput from '../../hooks/useDateInput';
import { useDetectTouch, useOutsideClickHandler } from '../../hooks/utils';
import DatePickerCalendar from '../date-picker-calendar/DatePickerCalendar';
import Popper from '../popper/Popper';
import { constVoid } from '../../utils/function';

export interface DatePickerChildrenProps {
  inputProps: DatePickerInputProps;
  openDatePicker: () => void;
}

export type DatePickerChildren = (props: DatePickerChildrenProps) => ReactNode;

export interface DatePickerProps {
  locale: Locale;
  type?: CalendarType;
  date?: Date | null;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
  modifiers?: CalendarModifiers;
  modifiersClassNames?: CalendarModifiersClassNames;
  portalContainer?: Element;
  readonlyOnTouch?: boolean;
  autoOpen?: boolean;
  onChange?: NullableDateChangeHandler;
  children: DatePickerChildren;
}

const DatePicker: FC<DatePickerProps> = ({
  locale,
  type = 'day',
  date,
  format,
  minDate,
  maxDate,
  placeholder,
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

  const [isOpen, setOpen] = useState<boolean>(false);

  const [inputRef, popperRef] = useOutsideClickHandler<HTMLInputElement, HTMLDivElement>(() => setOpen(false));

  const openDatePicker = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  const isTouch = useDetectTouch();

  const handleDateInputChange: NullableDateChangeHandler = date => {
    onChange(date);

    if (date) {
      setMonth(date);
    }
  };

  const inputProps = useDateInput({
    locale,
    date,
    format,
    placeholder,
    onChange: handleDateInputChange,
  });

  const handleChange: DateChangeHandler = date => {
    onChange(date);

    setOpen(false);
  };

  const readOnly = readonlyOnTouch && isTouch;

  return (
    <>
      {children({
        inputProps: {
          ...inputProps,
          onFocus: e => {
            inputProps.onFocus(e);

            if (autoOpen) {
              setOpen(true);
            }

            if (readOnly) {
              inputRef.current?.blur();
            }
          },
          ref: inputRef,
          readOnly,
        },
        openDatePicker,
      })}

      <Popper
        ref={popperRef}
        isOpen={isOpen}
        referenceElement={inputRef.current}
        popperElement={popperRef.current}
        portalContainer={portalContainer}
        className="date">
        <DatePickerCalendar
          locale={locale}
          type={type}
          date={date}
          month={month}
          minDate={minDate}
          maxDate={maxDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className={className}
          onDateChange={handleChange}
          onMonthChange={setMonth}
        />
      </Popper>
    </>
  );
};

export default DatePicker;
