import { CalendarModifiers, CalendarType, DefaultModifiers, Modifiers, ModifiersClassNames } from '../index';
import { DEFAULT_MODIFIERS_CLASS_NAMES } from '../constants';

export function mergeModifiers(baseModifiers: Modifiers = {}, extendsModifiers: Modifiers = {}): Modifiers {
  const newModifiers = Object.keys(extendsModifiers).reduce(
    (modifiers, key) => ({
      ...modifiers,
      [key]: baseModifiers[key]
        ? date => baseModifiers[key](date) || extendsModifiers[key](date)
        : extendsModifiers[key],
    }),
    {} as Modifiers,
  );

  return {
    ...baseModifiers,
    ...newModifiers,
  };
}

export function mergeCalendarModifiers(
  baseModifiers: CalendarModifiers = {},
  extendsModifiers: CalendarModifiers = {},
): CalendarModifiers {
  const newModifiers = Object.keys(extendsModifiers).reduce(
    (calendarModifiers, curr) => ({
      ...calendarModifiers,
      [curr]: mergeModifiers(baseModifiers[curr as CalendarType], extendsModifiers[curr as CalendarType]),
    }),
    {} as CalendarModifiers,
  );

  return {
    ...baseModifiers,
    ...newModifiers,
  };
}

export function computeModifierClassNames(
  modifiers: Modifiers = {},
  modifiersClassNames: ModifiersClassNames = {},
): (date: Date) => Record<DefaultModifiers | string, boolean> {
  const allClassNames: ModifiersClassNames = { ...DEFAULT_MODIFIERS_CLASS_NAMES, ...modifiersClassNames };

  return date =>
    Object.keys(modifiers).reduce((acc, curr) => {
      const className = allClassNames[curr];
      const predicate = modifiers[curr];

      if (className && predicate) {
        return {
          ...acc,
          [className]: predicate(date),
        };
      }

      return acc;
    }, {} as Record<DefaultModifiers | string, boolean>);
}
