import { lighten, useTheme } from '@mui/material';
import { t } from 'i18next';
import get from 'lodash/get';
import React from 'react';

type Props = {
  data: any;
  code?: string;
  size?: number;
};
const uniformColorMap: Record<string, string> = {
  red: '#FF0000',
  r: '#FF0000',
  blue: '#0000FF',
  b: '#0000FF',
  green: '#008000',
  g: '#008000',
  yellow: '#FFFF00',
  y: '#FFFF00',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
  grey: '#808080',
  'dark red': '#8B0000',
  maroon: '#800000',
  burgundy: '#800020',
  'navy blue': '#000080',
  navy: '#000080',
  'royal blue': '#4169E1',
  'sky blue': '#87CEEB',
  teal: '#008080',
  'light blue': '#ADD8E6',
  'dark blue': '#000050',
  orange: '#FFA500',
  gold: '#FFD700',
  'dark green': '#006400',
  lime: '#00FF00',
  pink: '#FFC0CB',
  purple: '#800080',
  violet: '#8A2BE2',
  cyan: '#00FFFF',
  beige: '#F5F5DC',
  brown: '#A52A2A',
  'light gray': '#D3D3D3',
  'dark gray': '#A9A9A9',
  crimson: '#DC143C',
  silver: '#C0C0C0',
  charcoal: '#36454F',
  aqua: '#00FFFF',
};
export function hasUniform(data: any, code: string = 'uniform'): boolean {
  return Boolean(get(data, `result.extensions.extendedResult.${code}`));
}
export const UniformChip: React.FC<Props> = ({ data, size = 16, code = 'uniform' }) => {
  function parseColorName(raw: string): string {
    const normalized = raw.toLowerCase().trim();
    return uniformColorMap[normalized] || '#CCCCCC';
  }
  const color = get(data, `result.extensions.extendedResult.${code}`);
  const theme = useTheme();
  if (!color) return null;
  const normalizedColor = color.replace(/[/\s]+/g, '-');
  const colorParts = normalizedColor.split('-').map((c: string) => c.trim());
  const colors = colorParts
    .map((c: string) => parseColorName(c.trim().toLowerCase()))
    .filter((x: string) => x != '#CCCCCC');
  const background =
    colors.length === 1
      ? colors[0]
      : `linear-gradient(to right, ${colors[0]} 50%, ${colors[1]} 50%)`;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '20%',
        background,
        border: `1px solid ${lighten(theme.palette.text.primary, 0.5)}`,
      }}
      title={
        code === 'uniform'
          ? `${t('general.uniform')}: ${color}`
          : `${t('general.uniform')} ${t('general.goalkeeper')}: ${color}`
      }
    />
  );
};
