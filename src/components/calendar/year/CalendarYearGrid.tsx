import React, { FC, useMemo } from 'react';
import { addYears, eachYearOfInterval, subYears } from 'date-fns';
import CalendarYear from './CalendarYear';
import { DateChangeHandler, Modifiers, ModifiersClassNames } from '../../../index';

interface CalendarYearGridProps {
  month: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  onYearChange: DateChangeHandler;
}

const CalendarYearGrid: FC<CalendarYearGridProps> = ({ month, modifiers, modifiersClassNames, onYearChange }) => {
  const years = useMemo(
    () =>
      eachYearOfInterval({
        start: subYears(month, 11),
        end: addYears(month, 12),
      }),
    [month],
  );

  return (
    <div className="year-grid">
      {years.map(year => (
        <CalendarYear
          key={year.getFullYear()}
          year={year}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          onSelect={onYearChange}
        />
      ))}
    </div>
  );
};

export default CalendarYearGrid;
