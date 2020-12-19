import './style.scss';
import { UseDateInputValue } from './hooks/useDateInput';
import { MutableRefObject } from 'react';

export * from './components';
export * from './hooks';

export type DateChangeHandler = (date: Date) => void;
export type NullableDateChangeHandler = (date: Date | null) => void;
export type DatePredicate = (date: Date) => boolean;

export type CalendarType = 'day' | 'month' | 'year';

export type BaseModifiersKey =
  | 'disabled'
  | 'selected'
  | 'today'
  | 'outside'
  | 'selectedStart'
  | 'selectedMiddle'
  | 'selectedEnd';

export type Modifiers = { [key in BaseModifiersKey | string]: DatePredicate };
export type ModifiersClassNames = { [key in BaseModifiersKey | string]: string };

export type CalendarModifiers = { [key in CalendarType]?: Modifiers };
export type CalendarModifiersClassNames = { [key in CalendarType]?: ModifiersClassNames };

export type DateRangeInputType = 'startDate' | 'endDate';

export interface DatePickerInputProps extends UseDateInputValue {
  ref: MutableRefObject<HTMLInputElement | null>;
}
