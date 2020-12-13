import { Meta, Story } from '@storybook/react';
import { Calendar, CalendarProps } from "../src";
import fr from "date-fns/locale/fr";

import './calendar.scss';
import { enUS } from 'date-fns/locale';

const meta: Meta = {
  title: 'Calendar',
  component: Calendar,
  argTypes: {
    locale: {
      description: 'date-fns locale',
      defaultValue: fr,
      control: false
    }
  },
};

export default meta;

const Template: Story<CalendarProps> = args => <Calendar {...args} className="story-calendar"/>;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
