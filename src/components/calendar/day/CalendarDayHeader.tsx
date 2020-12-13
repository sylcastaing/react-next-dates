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
    }).map(date => formatDate(date, 'eee', locale));
  }, [locale]);

  return (
    <div className="day-header">
      {weekDays.map(day => (
        <span key={day}>{day}</span>
      ))}
    </div>
  );
};

export default CalendarDayHeader;
