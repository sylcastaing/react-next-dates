import { addons } from '@storybook/addons';
import { create} from '@storybook/theming';

import logo from './logo.svg';

const theme = create({
  base: 'light',
  colorPrimary: '#2979ff',
  brandTitle: 'React Next Dates',
  brandUrl: 'https://github.com/sylcastaing/react-next-dates',
  brandImage: logo,
});

addons.setConfig({
  theme,
});
