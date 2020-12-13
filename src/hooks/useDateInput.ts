import React, { ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';

import { isValid, Locale } from 'date-fns';

import { formatDate, getDefaultDateFormat, isDateInRange, parseDate } from '../utils/date';

import { NullableDateChangeHandler, DatePredicate } from '../index';

export interface UseDateInputParams {
  locale: Locale;
  date?: Date | null;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  validate?: DatePredicate;
  onChange?: NullableDateChangeHandler;
}

export type UseDateInputValue = Pick<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'type' | 'value' | 'placeholder' | 'onChange' | 'onBlur' | 'onFocus'
>;

function isDateValid(date?: Date | null, minDate?: Date, maxDate?: Date, validate?: (date: Date) => boolean): boolean {
  if (date) {
    return isValid(date) && isDateInRange(date, minDate, maxDate) && (validate ? validate(date) : true);
  }

  return false;
}

export default function useDateInput({ locale, date, format, onChange }: UseDateInputParams): UseDateInputValue {
  const defaultFormat = useMemo(() => getDefaultDateFormat(locale, format), [locale, format]);

  const [value, setValue] = useState<string>(() =>
    date && isDateValid(date) ? formatDate(date, defaultFormat, locale) : '',
  );

  const [focused, setFocused] = useState<boolean>(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    const newValue = e.target.value;

    setValue(newValue);

    const parsedDate = parseDate(newValue, defaultFormat, locale);

    if (parsedDate !== null && isDateValid(parsedDate) && onChange) {
      onChange(parsedDate);
    }
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
    if (value) {
      const parsedDate = parseDate(value, defaultFormat, locale);

      if (parsedDate && isDateValid(parsedDate)) {
        setValue(formatDate(parsedDate, defaultFormat, locale));
      } else if (date && isDateValid(date)) {
        setValue(formatDate(date, defaultFormat, locale));
      } else {
        setValue('');
      }
    } else if (onChange) {
      onChange(null);
    }

    setFocused(false);
  };

  const handleFocus: FocusEventHandler<HTMLInputElement> = () => setFocused(true);

  useEffect(() => {
    if (!focused) {
      setValue(date && isDateValid(date) ? formatDate(date, defaultFormat, locale) : '');
    }
  }, [date, focused, defaultFormat, locale]);

  return {
    type: 'text',
    value,
    placeholder: defaultFormat,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
  };
}
