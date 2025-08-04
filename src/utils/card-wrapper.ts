import { Theme } from '@mui/material';
import { CardType } from 'types/cards';

export const getColorByMode = (
  theme: Theme,
  mode: CardType,
  variant: 'main' | 'light' | 'dark'
) => {
  const colorMap = {
    light: theme.palette.warning,
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    tertiary: theme.palette.success,
    quaternary: theme.palette.info,
  };

  return colorMap[mode][variant];
};

export const generateRadialGradient = (
  theme: Theme,
  mode: CardType,
  angle: number,
  stopOpacity: number = 0
) => {
  const color = getColorByMode(theme, mode, 'dark');

  return `linear-gradient(${angle}deg, ${color} -50.94%, rgba(144, 202, 249, ${stopOpacity}) 83.49%)`;
};
