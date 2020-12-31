export const CLOCK_ITEM_WIDTH = 24;

export const HOUR_ANGLE = 30; // 360 / 12
export const MINUTE_ANGLE = 6; // 360 / 50

export function getClockItemPosition(
  index: number,
  containerRadius: number,
  radius: number,
): { top: number; left: number } {
  return {
    top: radius * Math.sin(HOUR_ANGLE * (index - 2) * (Math.PI / 180)) + containerRadius - CLOCK_ITEM_WIDTH / 2,
    left: radius * Math.cos(HOUR_ANGLE * (index - 2) * (Math.PI / 180)) + containerRadius - CLOCK_ITEM_WIDTH / 2,
  };
}

export function format2Digits(val: number): string {
  return `${val < 10 ? '0' : ''}${val}`;
}
