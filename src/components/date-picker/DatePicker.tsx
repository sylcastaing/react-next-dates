import React, { FC, MutableRefObject, ReactNode, useState } from 'react';
import {
  CalendarModifiers,
  CalendarType,
  DateChangeHandler,
  DatePredicate,
  ModifiersClassNames,
  NullableDateChangeHandler,
  useDateInput,
} from '../../index';
import { UseDateInputValue } from '../../hooks/useDateInput';
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
  const [month, setMonth] = useState(date || new Date());

  const [focused, setFocused] = useState<boolean>(false);

  const [inputRef, popperRef] = useOutsideClickHandler<HTMLInputElement, HTMLDivElement>(() => {
    setFocused(false);
  });

  const inputProps = useDateInput({ locale, date, format, minDate, maxDate, validate, placeholder, onChange });

  const handleChange: DateChangeHandler = date => {
    if (onChange) {
      onChange(date);
    }

    setFocused(false);
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

            setFocused(true);
          },
          ref: inputRef,
        },
      })}

      <CalendarPopper
        ref={popperRef}
        isOpen={focused}
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
