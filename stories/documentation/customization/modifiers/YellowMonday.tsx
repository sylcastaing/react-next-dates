import React, { FC, useState } from 'react';
import { CalendarModifiers, CalendarModifiersClassNames, DatePicker } from '../../../../src';

import { enUS } from 'date-fns/locale';
import { isMonday } from 'date-fns';

const modifiers: CalendarModifiers = {
  day: {
    yellow: date => isMonday(date),
  },
};

const modifiersClassNames: CalendarModifiersClassNames = {
  day: {
    yellow: '--yellow',
  }
};

const YellowMonday: FC = () => {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker locale={enUS} date={date} onChange={setDate} modifiers={modifiers} modifiersClassNames={modifiersClassNames} portalContainer={document.body}>
      {({ inputProps }) => <input {...inputProps} />}
    </DatePicker>
  );
};

export default YellowMonday;
