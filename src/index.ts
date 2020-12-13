import './style.scss';

export * from './components';
export * from './hooks';

export type DateChangeHandler = (date: Date) => void;
export type NullableDateChangeHandler = (date: Date | null) => void;
export type DatePredicate = (date: Date) => boolean;

export type CalendarType = 'day' | 'month' | 'year';

export type DefaultModifiers = 'disabled' | 'selected' | 'today' | 'outside';

export type Modifiers = { [key in DefaultModifiers | string]: DatePredicate };
export type ModifiersClassNames = { [key in DefaultModifiers | string]: string };

export type CalendarModifiers = { [key in CalendarType]?: Modifiers };
export type CalendarModifiersClassNames = { [key in CalendarType]?: ModifiersClassNames };
