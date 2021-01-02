import React, { FC } from 'react';
import { formatDate } from '../../../utils/date';
import { ClockSelection } from '../Clock';

interface ClockNavigationProps {
  locale: Locale;
  date: Date | null;
  showNav: boolean;
  selection: ClockSelection;
  onSelectionChange: (selection: ClockSelection) => void;
}

const ClockNavigation: FC<ClockNavigationProps> = ({ locale, date, showNav, selection, onSelectionChange }) => {
  const handlePrev = () => onSelectionChange('hours');
  const handleNext = () => onSelectionChange('minutes');

  return (
    <div className="navigation">
      {showNav && selection === 'minutes' && <button type="button" className="prev" onClick={handlePrev} />}

      <p>{date ? formatDate(date, 'HH:mm', locale) : '--:--'}</p>

      {showNav && selection === 'hours' && <button type="button" className="next" onClick={handleNext} />}
    </div>
  );
};

export default ClockNavigation;
