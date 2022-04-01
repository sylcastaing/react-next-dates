import React, { ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';

import { isValid, Locale } from 'date-fns';

import { formatDate, getDefaultDateFormat, parseDate } from '../utils/date';

import { NullableDateChangeHandler } from '../index';
import { constVoid } from '../utils/function';

export interface UseDateInputParams {
  locale: Locale;
  date?: Date | null;
  format?: string;
  placeholder?: string;
  onChange?: NullableDateChangeHandler;
}

export type UseDateInputValue = Required<
  Pick<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type' | 'value' | 'placeholder' | 'onChange' | 'onBlur' | 'onFocus'
  >
> & { readOnly?: boolean };

function isDateValid(date?: Date | null): date is Date {
  return date != null && isValid(date);
}

export default function useDateInput({
  locale,
  date,
  format,
  placeholder,
  onChange = constVoid,
}: UseDateInputParams): UseDateInputValue {
  const defaultFormat = useMemo(() => getDefaultDateFormat(locale, format), [locale, format]);

  const [value, setValue] = useState<string>(() =>
    date != null && isDateValid(date) ? formatDate(date, defaultFormat, locale) : '',
  );

  const [focused, setFocused] = useState<boolean>(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    const newValue = e.target.value;

    setValue(newValue);

    const parsedDate = parseDate(newValue, defaultFormat, locale);

    if (isDateValid(parsedDate)) {
      onChange(parsedDate);
    }
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = () => {
    if (value) {
      const parsedDate = parseDate(value, defaultFormat, locale);

      if (isDateValid(parsedDate)) {
        setValue(formatDate(parsedDate, defaultFormat, locale));
      } else if (isDateValid(date)) {
        setValue(formatDate(date, defaultFormat, locale));
      } else {
        setValue('');
      }
    } else {
      onChange(null);
    }

    setFocused(false);
  };

  const handleFocus: FocusEventHandler<HTMLInputElement> = () => setFocused(true);

  useEffect(() => {
    if (!focused) {
      setValue(isDateValid(date) ? formatDate(date, defaultFormat, locale) : '');
    }
  }, [focused, date, defaultFormat, locale]);

  return {
    type: 'text',
    value,
    placeholder: placeholder ?? defaultFormat,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
  };
}
