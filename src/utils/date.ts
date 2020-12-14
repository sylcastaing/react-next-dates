import { isValid, parse, format, isBefore, startOfDay, isAfter, set } from 'date-fns';

export function getDefaultDateFormat(locale: Locale, formatString?: string): string {
  return formatString ?? locale.formatLong?.date({ width: 'short' }) ?? 'yyyy-MM-dd';
}

export function parseDate(value: string, formatString: string, locale: Locale): Date | null {
  const parsedDate = parse(value, formatString, new Date(), { locale });

  if (isValid(parsedDate)) {
    return parsedDate;
  }

  return null;
}

export function formatDate(date: Date, formatString: string, locale: Locale): string {
  return format(date, formatString, { locale });
}

export function isDateInRange(date: Date, minDate?: Date, maxDate?: Date): boolean {
  return !(minDate ? isBefore(date, startOfDay(minDate)) : false) && !(maxDate ? isAfter(date, maxDate) : false);
}

export function setTime(date: Date, dateWithTime: Date): Date {
  return set(date, {
    hours: dateWithTime.getHours(),
    minutes: dateWithTime.getMinutes(),
    seconds: dateWithTime.getSeconds(),
    milliseconds: dateWithTime.getMilliseconds(),
  });
}

export function setTimeOrRemoveTime(date: Date, dateWithTime?: Date | null): Date {
  return dateWithTime ? setTime(date, dateWithTime) : startOfDay(date);
}
