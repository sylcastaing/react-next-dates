import React, { FC, ReactNode, useState } from 'react';
import {
  CalendarModifiers,
  CalendarType,
  DateChangeHandler,
  DatePickerInputProps,
  DatePredicate,
  ModifiersClassNames,
  NullableDateChangeHandler,
} from '../../index';
import useDateInput from '../../hooks/useDateInput';
import { useDetectTouch, useOutsideClickHandler } from '../../hooks/utils';
import DatePickerCalendar from '../date-picker-calendar/DatePickerCalendar';
import CalendarPopper from '../popper/CalendarPopper';
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
  validate?: DatePredicate;
  placeholder?: string;
  className?: string;
  modifiers?: CalendarModifiers;
  modifiersClassName?: ModifiersClassNames;
  portalContainer?: Element;
  readonlyOnTouch?: boolean;
  autoOpen?: boolean;
  onChange?: NullableDateChangeHandler;
  children: DatePickerChildren;
}

const DatePicker: FC<DatePickerProps> = ({
  locale,
  type,
  date,
  format,
  minDate,
  maxDate,
  validate,
  placeholder,
  className,
  modifiers,
  modifiersClassName,
  portalContainer,
  readonlyOnTouch = true,
  autoOpen = true,
  onChange = constVoid,
  children,
}) => {
  const [month, setMonth] = useState(date ?? new Date());

  const [isOpen, setOpen] = useState<boolean>(false);

  const openDatePicker = () => setOpen(true);

  const [inputRef, popperRef] = useOutsideClickHandler<HTMLInputElement, HTMLDivElement>(() => setOpen(false));

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
    minDate,
    maxDate,
    validate,
    placeholder,
    onChange: handleDateInputChange,
  });

  const handleChange: DateChangeHandler = date => {
    onChange(date);

    setOpen(false);
  };

  return (
    <>
      {children({
        inputProps: {
          ...inputProps,
          onFocus: () => {
            inputProps?.onFocus();

            if (autoOpen) {
              openDatePicker();
            }

            if (readonlyOnTouch && isTouch) {
              inputRef.current?.blur();
            }
          },
          ref: inputRef,
          readOnly: readonlyOnTouch && isTouch,
        },
        openDatePicker,
      })}

      <CalendarPopper
        ref={popperRef}
        isOpen={isOpen}
        inputElement={inputRef.current}
        popperElement={popperRef.current}
        portalContainer={portalContainer}>
        <DatePickerCalendar
          locale={locale}
          type={type}
          date={date}
          month={month}
          minDate={minDate}
          maxDate={maxDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassName}
          className={className}
          onDateChange={handleChange}
          onMonthChange={setMonth}
        />
      </CalendarPopper>
    </>
  );
};

export default DatePicker;
