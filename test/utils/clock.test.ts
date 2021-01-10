import { format2Digits, getClockItemPosition } from '../../src/utils/clock';

describe('getClockItemPosition', () => {
  it('mock test', () => {
    expect(getClockItemPosition(2, 180, 100)).toEqual({
      top: 168,
      left: 268,
    });
  });
});

describe('format2Digits', () => {
  it('with number < 10', () => {
    expect(format2Digits(7)).toBe('07');
  });

  it('with number >= 10', () => {
    expect(format2Digits(12)).toBe('12');
  });
});
