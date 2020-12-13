import React, { FC, MutableRefObject, ReactNode, useState } from 'react';
import {
  CalendarModifiers,
  CalendarType,
  DateChangeHandler,
  DatePredicate,
  ModifiersClassNames,
  NullableDateChangeHandler,
} from '../../index';
import useDateInput, { UseDateInputValue } from '../../hooks/useDateInput';
import { useOutsideClickHandler } from '../../hooks/utils';
import DatePickerCalendar from '../date-picker-calendar/DatePickerCalendar';
import CalendarPopper from '../popper/CalendarPopper';

export interface DatePickerInputProps extends UseDateInputValue {
  ref: MutableRefObject<HTMLInputElement | null>;
}

export type DatePickerChildren = (props: { inputProps: DatePickerInputProps }) => ReactNode;

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
  onChange?: NullableDateChangeHandler;
  portalContainer?: Element;
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
  onChange,
  children,
}) => {
  const [month, setMonth] = useState(date ?? new Date());

  const [isOpen, setOpen] = useState<boolean>(false);

  const [inputRef, popperRef] = useOutsideClickHandler<HTMLInputElement, HTMLDivElement>(() => {
    setOpen(false);
  });

  const handleDateChange: NullableDateChangeHandler = date => {
    if (onChange) {
      onChange(date);
    }

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
    onChange: handleDateChange,
  });

  const handleChange: DateChangeHandler = date => {
    if (onChange) {
      onChange(date);
    }

    setOpen(false);
  };

  return (
    <>
      {children({
        inputProps: {
          ...inputProps,
          onFocus: () => {
            if (inputProps.onFocus) {
              inputProps.onFocus();
            }

            setOpen(true);
          },
          ref: inputRef,
        },
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
