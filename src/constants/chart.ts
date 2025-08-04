import { deepOrange, cyan, deepPurple, pink, lightBlue } from '@mui/material/colors';

export const legendDefaultProps: any = {
  direction: 'row',
  position: { vertical: 'top', horizontal: 'middle' },
  padding: 8,
  labelStyle: { fontFamily: 'Olympic Sans', fontSize: '14px', fontWeight: 300 },
};

export const basicChartColors = [
  deepOrange[500], // Calm light blue
  cyan[500], // Refreshing lime
  deepPurple[300], // Gentle purple
  pink[300], // Cool cyan
];

export const basicLightChartColors = [
  lightBlue[300], // Calm light blue
  deepOrange[200], // Refreshing lime
  deepPurple[200],
  cyan[200],
  pink[300],
];
