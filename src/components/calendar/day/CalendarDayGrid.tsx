import React, { FC, useMemo } from 'react';
import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import CalendarDay from './CalendarDay';
import CalendarDayHeader from './CalendarDayHeader';
import { DateChangeHandler, Modifiers, ModifiersClassNames, NullableDateChangeHandler } from '../../../index';

interface CalendarDayGridProps {
  locale: Locale;
  month: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  onSelect: DateChangeHandler;
  onHover: NullableDateChangeHandler;
}

const CalendarDayGrid: FC<CalendarDayGridProps> = ({
  locale,
  month,
  modifiers,
  modifiersClassNames,
  onSelect,
  onHover,
}) => {
  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month),
      }),
    [month],
  );

  return (
    <div className="day-grid">
      <CalendarDayHeader locale={locale} />

      <div className="day-grid-content">
        {days.map(day => (
          <CalendarDay
            key={day.toISOString()}
            locale={locale}
            day={day}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            onClick={onSelect}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarDayGrid;
