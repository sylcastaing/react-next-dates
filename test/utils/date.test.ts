import {
  formatDate,
  getDefaultDateFormat,
  isDateInRange,
  isRangeLengthValid,
  parseDate,
  setTime,
  setTimeOrRemoveTime,
} from '../../src/utils/date';
import { enUS } from 'date-fns/locale';
import { addDays, getDate, getMonth, getYear, subDays } from 'date-fns';

describe('getDefaultDateFormat', () => {
  it('with format', () => {
    expect(getDefaultDateFormat(enUS, 'dd-MM-yyyy')).toBe('dd-MM-yyyy');
  });

  it('with locale', () => {
    expect(getDefaultDateFormat(enUS)).toBe('MM/dd/yyyy');
  });

  it('with no default locale', () => {
    expect(getDefaultDateFormat({})).toBe('MM/dd/yyyy');
  });
});

describe('parseDate', () => {
  it('with valid input', () => {
    const formatDate = parseDate('10/12/1993', 'MM/dd/yyyy', enUS);

    expect(formatDate).not.toBe(null);

    if (formatDate != null) {
      expect(getDate(formatDate)).toBe(12);
      expect(getMonth(formatDate)).toBe(9);
      expect(getYear(formatDate)).toBe(1993);
    }
  });

  it('with invalid input', () => {
    expect(parseDate('q', 'MM/dd/yyyy', enUS)).toBe(null);
  });
});

describe('formatDate', () => {
  it('common format', () => {
    expect(formatDate(new Date(1993, 9, 12), 'MM/dd/yyyy', enUS)).toBe('10/12/1993');
  });

  it('locale format', () => {
    expect(formatDate(new Date(1993, 9, 12), 'LLLL', enUS)).toBe('October');
  });
});

describe('isDateInRange', () => {
  it('with only date', () => {
    expect(isDateInRange(new Date())).toBe(true);
  });

  it('with min date', () => {
    expect(isDateInRange(new Date(), subDays(new Date(), 1))).toBe(true);
    expect(isDateInRange(new Date(), addDays(new Date(), 1))).toBe(false);
  });

  it('with max date', () => {
    expect(isDateInRange(new Date(), undefined, addDays(new Date(), 1))).toBe(true);
    expect(isDateInRange(new Date(), undefined, subDays(new Date(), 1))).toBe(false);
  });

  it('with min date and max date', () => {
    expect(isDateInRange(new Date(), subDays(new Date(), 1), addDays(new Date(), 1))).toBe(true);
    expect(isDateInRange(new Date(), addDays(new Date(), 1), addDays(new Date(), 2))).toBe(false);
  });
});

describe('setTime', () => {
  it('should update time', () => {
    const dateWithTime = new Date(2000, 2, 24, 12, 32, 24, 56);

    const result = setTime(new Date(), dateWithTime);

    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(32);
    expect(result.getSeconds()).toBe(24);
    expect(result.getMilliseconds()).toBe(56);
  });
});

describe('setTimeOrRemoveTime', () => {
  it('with no date with time', () => {
    const result = setTimeOrRemoveTime(new Date());

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('with date with time', () => {
    const dateWithTime = new Date(2000, 2, 24, 12, 32, 24, 56);

    const result = setTimeOrRemoveTime(new Date(), dateWithTime);

    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(32);
    expect(result.getSeconds()).toBe(24);
    expect(result.getMilliseconds()).toBe(56);
  });
});

describe('isRangeLengthValid', () => {
  it('with min length = 0', () => {
    expect(isRangeLengthValid(new Date(), new Date(), 0)).toBe(true);
    expect(isRangeLengthValid(new Date(), subDays(new Date(), 1), 0)).toBe(false);
  });

  it('with min length = 2', () => {
    expect(isRangeLengthValid(new Date(), new Date(), 2)).toBe(false);
    expect(isRangeLengthValid(new Date(), addDays(new Date(), 1), 2)).toBe(false);
    expect(isRangeLengthValid(new Date(), addDays(new Date(), 2), 2)).toBe(true);
  });

  it('with min length = 0, max length = 2', () => {
    expect(isRangeLengthValid(new Date(), new Date(), 0, 2)).toBe(true);
    expect(isRangeLengthValid(new Date(), addDays(new Date(), 3), 0, 2)).toBe(false);
  });
});
