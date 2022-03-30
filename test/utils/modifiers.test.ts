import { computeModifierClassNames, mergeCalendarModifiers, mergeModifiers } from '../../src/utils/modifiers';
import { Modifiers } from '../../src';
import { addDays, isToday, isTomorrow, isYesterday, subDays } from 'date-fns';

describe('mergeModifiers', () => {
  it('no parameters', () => {
    expect(mergeModifiers()).toStrictEqual({});
  });

  it('no extends', () => {
    const modifiers: Modifiers = {
      foo: isToday,
    };

    const merged = mergeModifiers(modifiers);

    expect(merged).toStrictEqual(modifiers);
    expect(merged['foo']).toBeDefined();
    expect(merged['foo'](new Date())).toBeTruthy();
  });

  it('with extends', () => {
    const modifiers: Modifiers = {
      foo: isToday,
    };

    const newModifiers: Modifiers = {
      bar: isYesterday,
    };

    const merged = mergeModifiers(modifiers, newModifiers);

    expect(Object.keys(merged).length).toBe(2);

    expect(merged['foo']).toBeDefined();
    expect(merged['foo'](new Date())).toBeTruthy();

    expect(merged['bar']).toBeDefined();
    expect(merged['bar'](subDays(new Date(), 1))).toBeTruthy();
  });

  it('with override', () => {
    const modifiers: Modifiers = {
      foo: isToday,
    };

    const newModifiers: Modifiers = {
      foo: isTomorrow,
      bar: isYesterday,
    };

    const merged = mergeModifiers(modifiers, newModifiers);

    expect(Object.keys(merged).length).toBe(2);

    expect(merged['foo']).toBeDefined();
    expect(merged['foo'](new Date())).toBeTruthy();
    expect(merged['foo'](addDays(new Date(), 1))).toBeTruthy();

    expect(merged['bar']).toBeDefined();
  });
});

describe('mergeCalendarModifiers', () => {
  it('no parameters', () => {
    expect(mergeCalendarModifiers()).toStrictEqual({});
  });

  it('with extends', () => {
    const merged = mergeCalendarModifiers({ day: {} }, { month: {} });

    expect(Object.keys(merged).length).toBe(2);
  });
});

describe('computeModifierClassNames', () => {
  it('empty args', () => {
    const fn = computeModifierClassNames();

    expect(fn).toBeDefined();

    const result = fn(new Date());

    expect(result).toStrictEqual({});
  });

  it('with default classes', () => {
    const fn = computeModifierClassNames({
      today: isToday,
      selected: isYesterday,
    });

    expect(fn).toBeDefined();

    const result = fn(new Date());

    expect(Object.keys(result).length).toBe(2);

    expect(result['-today']).toBeTruthy();
    expect(result['-selected']).toBeFalsy();
  });

  it('override classes', () => {
    const fn = computeModifierClassNames(
      {
        today: isToday,
        selected: isYesterday,
      },
      { today: '-foo' },
    );

    expect(fn).toBeDefined();

    const result = fn(new Date());

    expect(Object.keys(result).length).toBe(2);

    expect(result['-foo']).toBeTruthy();
    expect(result['-selected']).toBeFalsy();
  });

  it('custom classes', () => {
    const fn = computeModifierClassNames(
      {
        today: isToday,
        selected: isYesterday,
        foo: isTomorrow,
      },
      { foo: '-foo' },
    );

    expect(fn).toBeDefined();

    const result = fn(new Date());

    expect(Object.keys(result).length).toBe(3);

    expect(result['-today']).toBeTruthy();
    expect(result['-selected']).toBeFalsy();
    expect(result['-foo']).toBeFalsy();
  });

  it('missing className or modifiers', () => {
    const fn = computeModifierClassNames(
      {
        today: isToday,
        selected: isYesterday,
        foo: isTomorrow,
      },
      { bar: '-bar' },
    );

    expect(fn).toBeDefined();

    const result = fn(new Date());

    expect(Object.keys(result).length).toBe(2);

    expect(result['-today']).toBeTruthy();
    expect(result['-selected']).toBeFalsy();
  });
});
