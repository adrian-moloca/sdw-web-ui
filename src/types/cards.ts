import type { OverridableComponent } from '@mui/material/OverridableComponent';
import type { SvgIconTypeMap, SxProps, TypographyVariant } from '@mui/material';
import type { ReactNode } from 'react';
import { Nullable } from 'models';

type ImageHeight = {
  xs?: number | string;
  md?: number | string;
  lg?: number | string;
};

export type ButtonConfig = {
  text: string;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  route?: string;
  href?: string;
  onClick?: () => void;
  sx?: SxProps;
  startIcon?: ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
};

export type CardVariantData = {
  data?: any;
  background: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
  borderRadius?: string;
  subTitle?: string;
  direction: 'up' | 'down';
  filter?: string;
  content: string[];
  imageHeight?: ImageHeight;
  buttons: ButtonConfig[];
  icon?: OverridableComponent<SvgIconTypeMap>;
};

export type CardType = 'light' | 'primary' | 'secondary' | 'tertiary' | 'quaternary';

export interface IIconChipProps {
  id?: string;
  code: string;
  hideTitle: boolean;
  title?: string;
  prefix?: string;
  typoSize?: TypographyVariant;
  size?: 'tiny' | 'small' | 'medium' | 'standard' | 'large' | 'xlarge';
  sizeNumber?: number | string;
  route?: Nullable<string>;
  onClick?: () => void;
}
