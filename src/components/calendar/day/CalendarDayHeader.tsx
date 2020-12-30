import React, { FC, useMemo } from 'react';
import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';
import { formatDate } from '../../../utils/date';

interface CalendarDayHeaderProps {
  locale: Locale;
}

const CalendarDayHeader: FC<CalendarDayHeaderProps> = ({ locale }) => {
  const weekDays = useMemo(() => {
    const today = new Date();

    return eachDayOfInterval({
      start: startOfWeek(today, { locale }),
      end: endOfWeek(today, { locale }),
    }).map(date => formatDate(date, 'eeeee', locale));
  }, [locale]);

  return (
    <div className="day-header">
      {weekDays.map((day, i) => (
        <span key={i}>{day}</span>
      ))}
    </div>
  );
};

export default CalendarDayHeader;
