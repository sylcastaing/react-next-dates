import { Meta, Story } from '@storybook/react';
import { Calendar, DatePicker, DatePickerProps, NullableDateChangeHandler } from '../src';
import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';
import { enUS } from 'date-fns/locale';

const meta: Meta<DatePickerProps> = {
  title: 'DatePicker',
  component: Calendar,
  argTypes: {
    locale: {
      defaultValue: enUS,
      control: false,
    },
  },
};

export default meta;

const DefaultTemplate: Story<DatePickerProps> = args => {
  const [date, setDate] = useState<Date | null>(null);

  const handleDateChange: NullableDateChangeHandler = d => {
    action('onChange')(d);
    setDate(d);
  }

  return (
    <DatePicker {...args} date={date} onChange={handleDateChange} className="story-calendar" portalContainer={document.body}>
      {({ inputProps }) => <input {...inputProps} />}
    </DatePicker>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Month = DefaultTemplate.bind({});
Month.args = {
  type: 'month',
  format: 'MM/yyyy'
}

export const Year = DefaultTemplate.bind({});
Year.args = {
  type: 'year',
  format: 'yyyy'
}
