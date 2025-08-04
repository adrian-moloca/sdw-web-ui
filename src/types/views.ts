import {
  EditionMode,
  IDisplayProps,
  EntityType,
  ActionType,
  IConfigProps,
  IQueryProps,
  IWhereProps,
  IDisplayBoxProps,
  MetadataModel,
  QueryFilterValue,
  Nullable,
} from 'models';
import { DialogProps } from 'types/dialog';
import { PageHeaderProps } from '@toolpad/core';

export interface IFormPageProps<T> {
  editionMode: EditionMode;
  initialValues: T;
  callBackSubmit: (dataItem: any) => void;
  callBackSubmitSelect?: (dataItem: any) => void;
  callBackCancel: () => void;
  parameter?: IParameter;
}

export interface IParameter extends IDisplayProps {
  type: EntityType;
}
export interface IParameterAccessor {
  accessor: string;
  name: string;
}
export interface IParameterList {
  name: string;
  value: any;
}

export interface IPanelTabProps {
  data: any;
  parameter: IParameter;
  parameters?: IParameterList[];
  readOnly?: boolean;
  includeHeader?: boolean;
}
export interface IToolbarPanelProps<T> {
  title: string;
  type: ActionType;
  handleClick: (dataItem: T) => void;
  condition?: (dataItem: T) => boolean;
}
export interface IViewPanelTabProps<T> {
  title: string;
  showTitle?: boolean;
  component: React.FC<IPanelTabProps>;
  condition?: (dataItem: T) => boolean;
  readOnly?: (dataItem: T) => boolean;
  parameters?: IParameterAccessor[];
}
export interface IViewPanelProps<T> {
  config: IConfigProps;
  query?: IQueryProps;
  mutation?: IQueryProps;
  filter?: IWhereProps[];
  displayBoxes: IDisplayBoxProps[];
  toolbar?: IToolbarPanelProps<T>[];
  tabs?: IViewPanelTabProps<T>[];
  metadata?: { [key: string]: MetadataModel };
  tags?: Array<QueryFilterValue>;
  dataSource?: IQueryProps;
  expandInfo: boolean;
  refetchQueries?: (id: Nullable<string>) => Array<string>;
  overrideViewPanel?: (dataItem: T, setup: any, type: EntityType) => any;
  component?: (props: IFormPageProps<T>) => React.ReactElement<IFormPageProps<T>>;
  subcomponent?: IViewPanelTabProps<T>;
  getMutation?: (dataItem: T, mode: EditionMode) => any;
  onClickEdit?: (dataItem: any, isDefault: () => void) => void;
}
export interface IUpdateDialogProps extends DialogProps {
  dataItem: any;
  width?: number;
}

export interface ViewHeaderProps extends PageHeaderProps {
  config: IConfigProps;
  element: any;
  setup: any;
  canEdit?: boolean;
  toolbar?: IToolbarPanelProps<any>[];
  handleOnClickEdit: () => void;
}
