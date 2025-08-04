import { FormikProps } from 'formik';
import {
  DataType,
  EntityArea,
  EntityType,
  EnumType,
  IEnumProps,
  ManagerDataCategory,
  MasterDataCategory,
  MetadataModel,
  MetadataOption,
  TemplateType,
} from 'models';
import { DateView } from '@mui/x-date-pickers-pro';
import React, { ElementType } from 'react';

export type ThemeType = 'light' | 'dark' | 'system' | undefined;
export type Nullable<T> = T | null | undefined;

export type IConfigurationProps = {
  [key in EntityType]: IConfigProps;
};

export type ApiVersion = 'search' | 'filter' | 'master' | 'direct';
export interface IConfigProps {
  type: EntityType;
  category: EntityArea;
  area: string;
  display: string;
  displayPlural: string;
  entityName: string;
  apiNode: string;
  apiVersion: ApiVersion;
  path: string;
  displayAccessor: string;
  parentPath?: string;
  parentIdAccessor?: string;
  parentDisplayAccessor?: string;
}
export interface IResponseProps {
  isError: boolean;
  message?: string;
  totalRecords?: number;
}
export interface IDisplayProps {
  id: string;
  display: string | undefined;
}
export interface ISelectMenuItem {
  title: string;
  value?: string | null;
}
export interface IRadioEnumProps {
  label: string;
  value: string;
}
export interface IPaginationProps {
  start: number;
  rows: number;
}
export interface ISortProps {
  column: string;
  operator: string;
}
export interface IQueryProps {
  queryKey: string;
  url: string;
  apiVersion: ApiVersion;
}
export interface IWhereProps {
  column: string;
  operator: string;
  value?: string | null | boolean;
  values?: string[];
  isNot?: boolean;
}
export interface IBreadcrumbItem {
  to?: string;
  color?: string;
  icon?: React.ElementType;
  title: string;
}

export interface IDisplayBoxProps {
  field: string;
  title?: string;
  hint?: string;
  type?: DataType;
  format?: string;
  mask?: string;
  dataSource?: IQueryProps;
  icon?: ElementType;
  route?: string;
  metadata?: MetadataModel;
  enum?: EnumType;
  template?: TemplateType;
}
export interface IInputFieldProps {
  field: string;
  label?: string;
  hint?: string;
  mask?: string;
  format?: string;
  formik: FormikProps<any>;
  required?: boolean;
  disabled?: boolean;
  sticky?: boolean;
  placeholder?: string;
  rows?: number;
  height?: string;
  template?: TemplateType;
  type?: DataType;
  disablePortal?: boolean;
  onChange?: (event: any) => void;
  size?: 'small' | 'medium';
  yearsOrder?: 'desc' | 'asc';
  findByKey?: boolean;
  anonymous?: boolean;
}
export interface IDateFieldProps extends IInputFieldProps {
  views?: DateView[];
  openTo?: DateView;
  disableFuture?: boolean;
}
export interface IEnumFieldProps extends IInputFieldProps {
  options: Array<IEnumProps>;
  findByKey?: boolean;
}
export interface IOptionFieldProps extends IInputFieldProps {
  options: Array<MetadataOption>;
}
export interface IEnumGroupFieldProps extends IEnumFieldProps {
  direction: 'row' | 'column';
}
export interface ISelectFieldProps extends IInputFieldProps {
  filters?: IWhereProps[];
  dataSource: IQueryProps;
  variables?: any;
  route?: string;
  icon?: ElementType;
  mode?: 'direct' | 'where' | 'simple';
  size?: 'small' | 'medium';
  itemRender?: any;
  valueRender?: any;
  mutateData?: any;
  keyField?: string;
  textField?: string;
  orderByField?: string[];
  findByKey?: boolean;
  groupBy?: (option: any) => string;
  where?: IWhereProps[];
}

export interface ISelectDataFieldProps extends IInputFieldProps {
  route?: string;
  variables?: any;
  dataSource: IQueryProps;
  mutateData?: any;
  filters?: IWhereProps[];
  itemRender?: any;
  valueRender?: any;
  mode?: 'direct' | 'where';
}
export interface ILabelValue {
  label: string;
  value: string;
}
export interface IRadioFieldProps extends IInputFieldProps {
  options: Array<ILabelValue>;
  direction?: 'row' | 'column';
}
export interface IServiceResponse<T> {
  isError: boolean;
  message?: string;
  type?: string;
  totalRecords?: number;
  data: T | null;
}
export interface ICoreEntityProps {
  id: string;
  title: string;
  systemId: string;
  createdTS: Date;
  versionTs: Date;
  digest: number;
  externalId: string;
}
export interface IScheduledEntityProps extends ICoreEntityProps {
  finishDate: string;
  startDate: string;
  scheduleStatus: string;
}

export type MessageType = 0 | 1 | 2 | 3 | 4;
export type MessageStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export interface IMessageProps {
  id: string;
  title?: string;
  message?: any;
  type: MessageType;
  status: MessageStatus;
  progress: number;
  dateOccurred: string;
}
export interface ISystemInfoProps {
  applicationName: string;
  version?: string;
  server?: string;
  environment: string;
  supportEmail?: string;
}
export type QueryFilterValue = {
  field: string;
  value: any;
};
export type QueryExtendFilter = {
  [key: string]: Array<string> | any;
};
export type QuerySortValue = {
  field: string;
  order: 'ASC' | 'DESC' | string;
};
export interface QueryResponse<T> {
  content: Array<T>;
  pagination?: QueryPagination;
  filters: Array<QueryFilterValue>;
  sorting: Array<QuerySortValue>;
}

export type QueryPagination = {
  total: number;
  rows: number;
  start: number;
};

export type SearchQueryOperator = 'LESS' | 'GREATER' | 'AND' | 'OR' | 'RANGE' | 'GTE' | 'LTE';

export type SearchQueryWhere = {
  column?: string;
  exclude?: boolean;
  operator?: SearchQueryOperator;
  subQuery?: SearchQuery;
  value?: any;
};

export type SearchQueryReference = {
  column: string;
  name: string;
  alias?: string;
};
export type SearchQueryJoin = {
  reference: SearchQueryReference;
  table: SearchQueryReference;
  where?: Array<SearchQueryWhere>;
};

export type SearchQueryLogicOperator = 'AND' | 'OR';

export type SearchQuery = {
  columns?: Array<string>;
  where?: Array<SearchQueryWhere>;
  join?: Array<SearchQueryJoin>;
  operator: SearchQueryLogicOperator;
};

export type SearchPayload = {
  nocs?: Array<string>;
  disciplines?: Array<string>;
  countries?: Array<string>;
  categories?: Array<string>;
  search?: string;
  query?: SearchQuery;
  extendedFilters?: QueryExtendFilter;
  sort?: Array<ISortProps>;
  pagination: QueryPagination;
};

export enum GridActionType {
  Button,
  Enum,
  MasterData,
  ToggleButton,
  SwitchButton,
  LoadingButton,
  MappingFilter,
  ManagerData,
}
export interface GridActionProps {
  icon?: React.ReactNode;
  className?: string;
  type: GridActionType;
  label?: string;
  tooltip?: string;
  visible: boolean;
  disabled?: boolean;
  loading?: boolean;
  enum?: EnumType;
  data?: any;
  value?: any;
  values?: Array<any>;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  action?: () => void;
  onChange?: (dataItem: any) => void;
  dataSource?: IQueryProps;
  category?: MasterDataCategory | ManagerDataCategory;
  where?: IWhereProps[];
}
export interface PrevNext<T> {
  prev: T;
  next: T;
}
