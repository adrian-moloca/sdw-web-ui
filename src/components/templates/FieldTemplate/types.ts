import { Nullable, TemplateType } from '../../../models';
import { ElementType } from 'react';

export interface ITemplateProps {
  type: TemplateType;
  value: any;
  size?: 'xs' | 'sm' | '1x' | 'large';
  title?: string;
  icon?: Nullable<ElementType>;
  color?: Nullable<string>;
  route?: Nullable<string>;
  withText?: Nullable<boolean>;
}
export interface ITemplateIconProps {
  display: string;
  size?: 'xs' | 'sm' | '1x' | 'large';
  icon: ElementType;
  color?: string;
}
