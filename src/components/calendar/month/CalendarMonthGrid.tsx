import React, { FC, useMemo } from 'react';
import { setMonth } from 'date-fns';
import CalendarMonth from './CalendarMonth';
import { Modifiers, ModifiersClassNames } from '../../../index';

interface CalendarMonthGridProps {
  locale: Locale;
  month: Date;
  modifiers?: Modifiers;
  modifiersClassNames?: ModifiersClassNames;
  onMonthChange: (month: Date) => void;
}

const CalendarMonthGrid: FC<CalendarMonthGridProps> = ({
  locale,
  month,
  modifiers,
  modifiersClassNames,
  onMonthChange,
}) => {
  const months = useMemo(
    () =>
      Array(12)
        .fill('')
        .map((_, i) => setMonth(month, i), locale),
    [locale, month],
  );

  return (
    <div className="month-grid">
      {months.map(m => (
        <CalendarMonth
          key={m.toISOString()}
          locale={locale}
          month={m}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          onSelect={onMonthChange}
        />
      ))}
    </div>
  );
};

export default CalendarMonthGrid;
