import React, { FC, useMemo } from 'react';
import { formatDate } from '../../../utils/date';
import { addMonths, addYears, startOfMonth, subMonths, subYears } from 'date-fns';
import { CalendarType } from '../../../index';

interface CalendarNavigationProps {
  locale: Locale;
  month: Date;
  mode: CalendarType;
  onChangeMonth: (month: Date) => void;
  onChangeMode: (mode: CalendarType) => void;
}

const CalendarNavigation: FC<CalendarNavigationProps> = ({ locale, month, mode, onChangeMonth, onChangeMode }) => {
  const title = useMemo(() => {
    switch (mode) {
      case 'day':
        return formatDate(month, 'LLLL yyyy', locale);
      case 'month':
        return formatDate(month, 'yyyy', locale);
      default:
        return null;
    }
  }, [month, mode, locale]);

  const handlePrev = () => {
    switch (mode) {
      case 'day':
        onChangeMonth(startOfMonth(subMonths(month, 1)));
        break;
      case 'month':
        onChangeMonth(startOfMonth(subYears(month, 1)));
        break;
      case 'year':
        onChangeMonth(startOfMonth(subYears(month, 24)));
        break;
    }
  };
  const handleNext = () => {
    switch (mode) {
      case 'day':
        onChangeMonth(startOfMonth(addMonths(month, 1)));
        break;
      case 'month':
        onChangeMonth(startOfMonth(addYears(month, 1)));
        break;
      case 'year':
        onChangeMonth(startOfMonth(addYears(month, 24)));
        break;
    }
  };

  const handleTitleClick = () => {
    switch (mode) {
      case 'day':
        onChangeMode('month');
        break;
      case 'month':
        onChangeMode('year');
        break;
    }
  };

  return (
    <div className="navigation">
      <div>{title && <p onClick={handleTitleClick}>{title}</p>}</div>

      <button type="button" className="prev" onClick={handlePrev} />

      <button type="button" className="next" onClick={handleNext} />
    </div>
  );
};

export default CalendarNavigation;
