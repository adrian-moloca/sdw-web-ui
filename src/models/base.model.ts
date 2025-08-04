import { EditionMode, EntityType } from 'models';

export interface IBookMark {
  link: string;
  title: string;
  category: string;
}

export interface ColumnData {
  dataKey: string;
  label: string;
  command?: boolean;
  width?: number;
  minWidth?: number;
  flex?: number;
  align?: 'left' | 'center' | 'right';
}

export interface DrawerFormProps {
  data: any;
  type: EntityType;
  editionMode: EditionMode;
  onClose: () => void;
}

export const medalColors = {
  golden: 'rgb(252, 200, 97)',
  silver: 'rgb(229, 229, 229)',
  bronze: 'rgb(220, 179, 134)',
  total: '#4CBB17',
};
export type MedalColor = 'golden' | 'silver' | 'bronze';
export const medalMap: Record<string, 'golden' | 'silver' | 'bronze'> = {
  AWSB$ME_GOLD: 'golden',
  AWSB$GOLD: 'golden',
  AWSB$ME_SILVER: 'silver',
  AWSB$SILVER: 'silver',
  AWSB$ME_BRONZE: 'bronze',
  AWSB$BRONZE: 'bronze',
};
export type ExtendedResultMetric = {
  field: string;
  label: string;
  width?: number;
};
