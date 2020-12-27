import React, { FC, useMemo } from 'react';
import { differenceInDays, getDate, isSameMonth, isToday, startOfWeek } from 'date-fns';
import classNames from 'classnames';
import { DateChangeHandler, Modifiers, ModifiersClassNames, NullableDateChangeHandler } from '../../../index';
import { computeModifierClassNames, mergeModifiers } from '../../../utils/modifiers';

interface CalendarDayProps {
  locale: Locale;
  day: Date;
  month: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  onClick: DateChangeHandler;
  onHover: NullableDateChangeHandler;
}

const CalendarDay: FC<CalendarDayProps> = ({
  locale,
  day,
  month,
  modifiers: receivedModifiers,
  modifiersClassNames,
  onClick,
  onHover,
}) => {
  const dayNumber = getDate(day);

  const handleClick = () => onClick(day);

  const handleMouseEnter = () => onHover(day);

  const handleMouseLeave = () => onHover(null);

  const modifiers = mergeModifiers(
    {
      today: date => isToday(date),
      outside: date => !isSameMonth(date, month),
    },
    receivedModifiers,
  );

  const dayClassNames = computeModifierClassNames(modifiers, modifiersClassNames)(day);

  const gridColumnStart = useMemo(() => {
    if (getDate(day) === 1) {
      return differenceInDays(day, startOfWeek(day, { locale })) + 1;
    }

    return undefined;
  }, [day, locale]);

  return (
    <span
      className={classNames('day', dayClassNames)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ gridColumnStart }}>
      <span className="day-number">{dayNumber}</span>
    </span>
  );
};

export default CalendarDay;
