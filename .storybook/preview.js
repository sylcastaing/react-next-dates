// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
import '../src/style.scss';
import '../stories/stories.scss';

export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
  options: {
    storySort: {
      method: '',
      order: [
        'Documentation',
        ['Installation', 'Theming', 'Customization', ['Locale', 'Input', 'Format']],
        'Components',
        ['DatePicker', 'DateRangePicker', 'TimePicker', 'DateTimePicker', 'Calendar', 'Clock', 'DatePickerCalendar', 'DateRangePickerCalendar'],
        'Hooks'
      ],
    },
  },
};
