import React, { FC } from 'react';

interface CalendarYearProps {
  year: Date;
  onSelect: (year: Date) => void;
}

const CalendarYear: FC<CalendarYearProps> = ({ year, onSelect }) => {
  const handleClick = () => onSelect(year);

  return (
    <span className="year" onClick={handleClick}>
      {year.getFullYear()}
    </span>
  );
};

export default CalendarYear;
