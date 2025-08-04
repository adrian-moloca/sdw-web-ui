import {
  EditionFlagEnum,
  EntityType,
  GridActionProps,
  IConfigProps,
  IQueryProps,
  ISortProps,
  IWhereProps,
  MetadataModel,
  Nullable,
  QueryExtendFilter,
  QueryFilterValue,
  SearchQuery,
} from '../models';
import {
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridSortModel,
} from '@mui/x-data-grid-pro';
import React from 'react';

export type ToolbarType = 'none' | 'default' | 'search' | 'custom' | 'default-custom';

export interface IDataGridProps<T> {
  config: IConfigProps;
  type?: EntityType;
  flags: EditionFlagEnum;
  showHeader: boolean;
  toolbar?: GridActionProps[];
  toolbarType: ToolbarType;
  metadata?: { [key: string]: MetadataModel };
  dataSource?: IQueryProps;
  data?: Array<any>;
  tags?: QueryExtendFilter;
  query?: SearchQuery;
  search?: string;
  filters?: Array<QueryFilterValue>;
  where?: IWhereProps[];
  sorting?: Array<ISortProps>;
  fixPageSize?: number;
  disablePagination?: boolean;
  disableColumnMenu?: boolean;
  columns?: GridColDef[];
  refetchQueries?: (id: Nullable<string>) => Array<string>;
  onCreate?: () => void;
  onUpdate?: (e: T) => void;
  onOther?: (e: T) => void;
  onSelect?: (e: T) => void;
  selectedId?: string;
  dashboard?: React.ReactNode | undefined;
  secondary?: React.ReactElement;
  fontSize?: string | number;
}

export type QueryOptionsProps = {
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
};

export type RenderProps = {
  params: GridRenderCellParams<any>;
  type: EntityType;
  field: string;
  fieldId: string;
};

export type AutocompleteCell = {
  // params: GridRenderEditCellParams | GridFilterInputValueProps;
  options: any[] | undefined;
  loading: boolean;
  freeSolo?: boolean;
  multiple?: boolean;
  keyField?: string;
  textField?: string;
  onChange?: (newValue: any) => void;
  getValue?: () => any;
};

export enum RenderTemplate {
  MetadataField,
  MetadataEntity,
  SecurityEntity,
  ForeignKey,
}
