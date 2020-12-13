import React, { FC, useMemo } from 'react';
import { addYears, eachYearOfInterval, subYears } from 'date-fns';
import CalendarYear from './CalendarYear';

interface CalendarYearGridProps {
  month: Date;
  onYearChange: (date: Date) => void;
}

const CalendarYearGrid: FC<CalendarYearGridProps> = ({ month, onYearChange }) => {
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
        <CalendarYear key={year.getFullYear()} year={year} onSelect={onYearChange} />
      ))}
    </div>
  );
};

export default CalendarYearGrid;
