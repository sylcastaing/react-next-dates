import React, { FC } from 'react';
import { DateChangeHandler, Modifiers, ModifiersClassNames } from '../../../index';
import { computeModifierClassNames, mergeModifiers } from '../../../utils/modifiers';
import { isThisYear } from 'date-fns';
import classNames from 'classnames';

interface CalendarYearProps {
  year: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  onSelect: DateChangeHandler;
}

const CalendarYear: FC<CalendarYearProps> = ({ year, modifiers: receivedModifiers, modifiersClassNames, onSelect }) => {
  const handleClick = () => onSelect(year);

  const modifiers = mergeModifiers(
    {
      today: date => isThisYear(date),
    },
    receivedModifiers,
  );

  const yearClassNames = computeModifierClassNames(modifiers, modifiersClassNames)(year);

  return (
    <span className={classNames('year', yearClassNames)} onClick={handleClick}>
      {year.getFullYear()}
    </span>
  );
};

export default CalendarYear;
