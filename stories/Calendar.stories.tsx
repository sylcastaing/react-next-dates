import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Calendar, CalendarProps } from '../src';

import './calendar.scss';
import { enUS, fr } from 'date-fns/locale';

const meta: Meta<CalendarProps> = {
  title: 'Calendar',
  component: Calendar,
  argTypes: {
    locale: {
      defaultValue: enUS,
      control: false,
    },
    month: {
      control: false,
    },
    minDate: {
      control: false,
    },
    maxDate: {
      control: false,
    },
    onSelect: {
      action: 'onSelect',
    },
  },
};

export default meta;

const DefaultTemplate: Story<CalendarProps> = args => {
  return <Calendar {...args} className="story-calendar" />;
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Locale = DefaultTemplate.bind({});
Locale.args = { locale: fr };

export const Month = DefaultTemplate.bind({});
Month.args = { type: 'month' };

export const Year = DefaultTemplate.bind({});
Year.args = { type: 'year' };

export const MinDate = DefaultTemplate.bind({});
MinDate.args = { minDate: new Date() };

export const MaxDate = DefaultTemplate.bind({});
MaxDate.args = { maxDate: new Date() };
