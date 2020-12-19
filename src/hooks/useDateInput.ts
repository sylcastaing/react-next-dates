import React, { ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';

import { isValid, Locale } from 'date-fns';

import { formatDate, getDefaultDateFormat, isDateInRange, parseDate } from '../utils/date';

import { DatePredicate, NullableDateChangeHandler } from '../index';
import { constVoid } from '../utils/function';

export interface UseDateInputParams {
  locale: Locale;
  date?: Date | null;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  validate?: DatePredicate;
  placeholder?: string;
  onChange?: NullableDateChangeHandler;
}

export interface UseDateInputValue
  extends Pick<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type' | 'value' | 'placeholder' | 'onChange' | 'onBlur' | 'onFocus' | 'readOnly'
  > {
  onFocus: () => void;
}

function isDateValid(date?: Date | null, minDate?: Date, maxDate?: Date, validate?: (date: Date) => boolean): boolean {
  if (date) {
    return isValid(date) && isDateInRange(date, minDate, maxDate) && (validate ? validate(date) : true);
  }

  return false;
}

export default function useDateInput({
  locale,
  date,
  format,
  minDate,
  maxDate,
  validate,
  placeholder,
  onChange = constVoid,
}: UseDateInputParams): UseDateInputValue {
  const defaultFormat = useMemo(() => getDefaultDateFormat(locale, format), [locale, format]);

  const [value, setValue] = useState<string>(() =>
    date && isDateValid(date) ? formatDate(date, defaultFormat, locale) : '',
  );

  const [focused, setFocused] = useState<boolean>(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    const newValue = e.target.value;

    setValue(newValue);

    const parsedDate = parseDate(newValue, defaultFormat, locale);

    if (parsedDate !== null && isDateValid(parsedDate, minDate, maxDate, validate)) {
      onChange(parsedDate);
    }
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
    if (value) {
      const parsedDate = parseDate(value, defaultFormat, locale);

      if (parsedDate && isDateValid(parsedDate, minDate, maxDate, validate)) {
        setValue(formatDate(parsedDate, defaultFormat, locale));
      } else if (date && isDateValid(date, minDate, maxDate, validate)) {
        setValue(formatDate(date, defaultFormat, locale));
      } else {
        setValue('');
      }
    } else {
      onChange(null);
    }

    setFocused(false);
  };

  const handleFocus = () => setFocused(true);

  useEffect(() => {
    if (!focused) {
      setValue(date && isDateValid(date, minDate, maxDate, validate) ? formatDate(date, defaultFormat, locale) : '');
    }
  }, [date, focused, defaultFormat, locale, minDate, maxDate, validate]);

  return {
    type: 'text',
    value,
    placeholder: placeholder ?? defaultFormat,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
  };
}
