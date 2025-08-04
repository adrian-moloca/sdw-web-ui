import { ElementType } from 'react';
import { ISelectMenuItem } from './base.models';
export const EntityStatusEnum = {
  Active: 1,
  Inactive: 2,
  Disable: 4,
  All: 7,
};
export const EntityStatusType = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Disable: 'DISABLE',
} as const;
export type IEntityStatusType = (typeof EntityStatusType)[keyof typeof EntityStatusType];

export const EntityStatusMenu: ISelectMenuItem[] = [
  { title: 'Active' },
  { title: 'Inactive' },
  { title: 'Disable' },
];

export enum EditionFlagEnum {
  CanView = 0,
  CanCreate = 1 << 0,
  CanUpdate = 1 << 1,
  CanDelete = 1 << 2,
  CanDuplicate = 1 << 3,
  All = ~(~0 << 4),
}

export const EditionFlags = {
  AllowEditionWithDuplicate:
    EditionFlagEnum.CanCreate |
    EditionFlagEnum.CanView |
    EditionFlagEnum.CanUpdate |
    EditionFlagEnum.CanDelete |
    EditionFlagEnum.CanDuplicate,
  AllowEditionNoCreate:
    EditionFlagEnum.CanView | EditionFlagEnum.CanUpdate | EditionFlagEnum.CanDelete,
  AllowEdition:
    EditionFlagEnum.CanCreate |
    EditionFlagEnum.CanView |
    EditionFlagEnum.CanUpdate |
    EditionFlagEnum.CanDelete,
  AllowViewStatus: EditionFlagEnum.CanCreate | EditionFlagEnum.CanView | EditionFlagEnum.CanDelete,
  AllowView: EditionFlagEnum.CanView,
  AllowViewDelete: EditionFlagEnum.CanView | EditionFlagEnum.CanDelete,
};

export const asyncStates = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
} as const;
export type IAsyncState = keyof typeof asyncStates;

export enum ViewType {
  Index,
  View,
  List,
  Dashboard,
}
export enum EditionMode {
  Detail,
  Create,
  Update,
  Merge,
  Validate,
  SelectDialog,
  CreateDialog,
  UpdateDialog,
  None,
}
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
export enum ActionType {
  New,
  Cancel,
  Refresh,
  Edit,
  Detail,
  Delete,
  Disable,
  Preview,
  Download,
  Duplicate,
  Save,
  Connect,
  Sync,
  Calculate,
  Generate,
  Print,
  Filter,
  ClearFilters,
  HideFields,
  Validate,
  Merge,
  Execute,
}
export enum MutationTypeEnum {
  Create,
  Update,
  Duplicate,
  Sync,
}
export const OperatorType = {
  Contains: 'contains',
  StartsWith: 'startsWith',
  EndsWith: 'endsWith',
  Equal: 'equal',
  GreaterThan: 'greaterThan',
  GreaterThanOrEqual: 'greaterThanOrEqual',
  LessThan: 'lessThan',
  LessThanOrEqual: 'lessThanOrEqual',
  InList: 'inList',
  Empty: 'empty',
};
export enum MenuFlagEnum {
  None = 0,
  Explorer = 1,
  Ingest = 2,
  Consolidation = 4,
  Reports = 8,
  GamesTimeInfo = 16,
  ReportsSetup = 32,
  Extractor = 64,
  Biography = 128,
  Administrator = 256,
  All = Explorer |
    Ingest |
    Consolidation |
    Reports |
    GamesTimeInfo |
    ReportsSetup |
    Extractor |
    Reports |
    Biography |
    Administrator,
}
export const OpLogic = { AND: 'AND', OR: 'OR' };
export const DirectionType = { Asc: 'ASC', Desc: 'DESC' };
export interface IEnumProps {
  id: number;
  code: string;
  text: string;
  icon?: ElementType;
  color: string;
  shortText?: string;
}
export enum DataType {
  Integer,
  Long,
  Currency,
  Decimal,
  CheckBox,
  RadioButton,
  Date,
  DateRange,
  DateTime,
  Time,
  Switch,
  String,
  MaskedText,
  AreaText,
  DropDown,
  ComboBox,
  MultiSelect,
  MultiSelectList,
  AutoComplete,
  Slider,
  Color,
  FileUpload,
  RadioGroup,
  Email,
  NavigationKey,
  MultiSelectTree,
  List,
  Enum,
  IdDisplay,
  IdDisplayList,
  IdDisplayIso,
  IdEntity,
  Filter,
  SecurityInfo,
  AuditInfo,
}
export const LIGHT_MODE = 'light';
export const DARK_MODE = 'dark';
export const AuditFields = {
  CREATED_ON: 'createdOn',
  CREATED_BY: 'createdBy',
  MODIFY_ON: 'modifiedOn',
  MODIFY_BY: 'modifiedBy',
};
export enum TemplateType {
  Boolean,
  Date,
  DateTime,
  TextWithIcon,
  List,
  ListCountry,
  ListDiscipline,
  BlockDiscipline,
  Tags,
  Events,
  Team,
  Chip,
  ChipOutlined,
  Organization,
  RouteDirect,
  Country,
  Route,
  TextList,
  TextListPopup,
  ExternalIds,
  Email,
  Number,
  Html,
  HtmlPopUp,
  IsoCode,
  Image,
  TotalKeys,
  QueryStatus,
  Status,
  MasterData,
  TextLong,
  Category,
  Rating,
  Timestamp,
  Url,
  SocialMedia,
  Json,
  JsonPopUp,
  ElapsedTime,
  FileSize,
  Discipline,
  NoMappings,
  TextFormatted,
  ExpandableTags,
  SensitiveInfo,
  CompetitionCategory,
  CompetitionInfo,
}
