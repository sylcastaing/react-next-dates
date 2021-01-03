import React, { FC, useMemo } from 'react';
import { eachYearOfInterval, getYear, setYear } from 'date-fns';
import CalendarYear from './CalendarYear';
import { DateChangeHandler, Modifiers, ModifiersClassNames } from '../../../index';

interface CalendarYearGridProps {
  month: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  onYearChange: DateChangeHandler;
}

const CalendarYearGrid: FC<CalendarYearGridProps> = ({ month, modifiers, modifiersClassNames, onYearChange }) => {
  const years = useMemo(() => {
    const gridStartYear = Math.floor(getYear(month) / 24) * 24;

    return eachYearOfInterval({
      start: setYear(month, gridStartYear),
      end: setYear(month, gridStartYear + 23),
    });
  }, [month]);

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
