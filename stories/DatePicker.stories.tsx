import { Meta, Story } from '@storybook/react';
import { Calendar, DatePicker, DatePickerProps } from '../src';
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

  return (
    <DatePicker {...args} date={date} onChange={setDate} className="story-calendar" portalContainer={document.body}>
      {({ inputProps }) => <input {...inputProps} />}
    </DatePicker>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {};
