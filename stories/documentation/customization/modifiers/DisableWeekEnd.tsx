import React, { FC, useState } from 'react';
import { CalendarModifiers, DatePicker } from '../../../../src';
import { isSaturday, isSunday } from 'date-fns';

import { enUS } from 'date-fns/locale';

const modifiers: CalendarModifiers = {
  day: {
    disabled: date => isSunday(date) || isSaturday(date),
  },
};

const DisableWeekEnd: FC = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker locale={enUS} date={date} onChange={setDate} modifiers={modifiers} portalContainer={document.body}>
      {({ inputProps }) => <input {...inputProps} />}
    </DatePicker>
  );
};

export default DisableWeekEnd;
