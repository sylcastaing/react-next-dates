import { Meta, Story } from '@storybook/react';
import { CalendarProps, DatePickerProps, DateRangeInputType, DateRangePickerCalendar } from '../src';

import { enUS } from 'date-fns/locale';
import React, { useState } from 'react';

import './date-range-picker-calendar.scss';

const meta: Meta<DatePickerProps> = {
  title: 'DateRangePickerCalendar',
  component: DateRangePickerCalendar,
  argTypes: {
    locale: {
      defaultValue: enUS,
      control: false,
    },
  },
};

export default meta;

const DefaultTemplate: Story<CalendarProps> = args => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [focus, setFocus] = useState<DateRangeInputType>('startDate');

  const handleFocusChange = (focus: DateRangeInputType | null) => setFocus(focus ?? 'startDate');

  return (
    <DateRangePickerCalendar
      {...args}
      focus={focus}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onFocusChange={handleFocusChange}
      className="story-date-range-picker-calendar"
    />
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {};
