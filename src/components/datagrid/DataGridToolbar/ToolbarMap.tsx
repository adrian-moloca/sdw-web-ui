import React from 'react';
import { GridToolbarProps, ToolbarPropsOverrides } from '@mui/x-data-grid-pro';
import { BaseToolbar } from './BaseToolbar';
import { ToolbarType } from 'types/datagrid';

export const DisplayToolbar = (
  props: Readonly<GridToolbarProps & ToolbarPropsOverrides>
): React.ReactElement => <BaseToolbar {...props} />;

export const CustomToolbar = (
  props: Readonly<GridToolbarProps & ToolbarPropsOverrides>
): React.ReactElement => <BaseToolbar {...props} showCreateButton={false} />;

export const toolbarMap: {
  [key in ToolbarType]: React.FC<Readonly<GridToolbarProps & ToolbarPropsOverrides>> | undefined;
} = {
  none: undefined,
  default: DisplayToolbar,
  search: DisplayToolbar,
  custom: CustomToolbar,
  'default-custom': CustomToolbar,
};
