import React, { FC, ReactNode } from 'react';
import { DateChangeHandler, DateValidator, useDateInput } from '../../index';
import { UseDateInputValue } from '../../hooks/useDateInput';

export interface DatePickerInputProps extends UseDateInputValue {}

export type DatePickerChildren = (props: { inputProps: DatePickerInputProps }) => ReactNode;

interface DatePickerProps {
  locale: Locale;
  date?: Date | null;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  validate?: DateValidator;
  onChange?: DateChangeHandler;
  children: DatePickerChildren;
}

const DatePicker: FC<DatePickerProps> = ({ locale, date, format, minDate, maxDate, validate, onChange, children }) => {
  const inputProps = useDateInput({ locale, date, format, minDate, maxDate, validate, onChange });

  return <div className="react-next-dates">{children({ inputProps })}</div>;
};

export default DatePicker;
