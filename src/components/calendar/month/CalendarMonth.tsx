import React, { FC } from 'react';
import { formatDate } from '../../../utils/date';
import { Modifiers, ModifiersClassNames } from '../../../index';
import { computeModifierClassNames, mergeModifiers } from '../../../utils/modifiers';
import { isThisMonth } from 'date-fns';
import classNames from 'classnames';

interface CalendarMonthProps {
  locale: Locale;
  month: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  onSelect: (month: Date) => void;
}

const CalendarMonth: FC<CalendarMonthProps> = ({
  locale,
  month,
  modifiers: receivedModifiers,
  modifiersClassNames,
  onSelect,
}) => {
  const handleClick = () => onSelect(month);

  const modifiers = mergeModifiers(
    {
      today: date => isThisMonth(date),
    },
    receivedModifiers,
  );

  const monthClassNames = computeModifierClassNames(modifiers, modifiersClassNames)(month);

  return (
    <span className={classNames('month', monthClassNames)} onClick={handleClick}>
      {formatDate(month, 'LLLL', locale)}
    </span>
  );
};

export default CalendarMonth;
