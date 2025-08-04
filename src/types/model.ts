import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';
import { ActionType, DataType, EnumType, MetadataModel } from '../models';
import React from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export enum ViewFlagEnum {
  Index = 0,
  View = 1 << 0,
  List = 1 << 1,
  Internal = 1 << 2,
  All = ~(~0 << 3),
}
export enum QueryTypeEnum {
  GetPagedList,
  GetList,
  GetDisplay,
  GetById,
}
export enum MutationTypeEnum {
  Create,
  Update,
  Duplicate,
  Sync,
}
export interface IFiedModelProps {
  name: string;
  type: DataType;
  mode: ViewFlagEnum;
  nullable: boolean;
  readOnly?: boolean;
  enum?: EnumType;
}
export interface IApiFieldProps {
  name: string;
  type: string;
}
export interface AppModelProps {
  getIconBase: (type: ActionType) => OverridableComponent<SvgIconTypeMap>;
  formatField: (
    fileName: string,
    value: string | undefined,
    metadata?: { [key: string]: MetadataModel }
  ) => React.ReactElement | string;
  formatEditField: (
    fileName: string,
    value: string | undefined,
    metadata?: { [key: string]: MetadataModel }
  ) => React.ReactElement | string;
}
