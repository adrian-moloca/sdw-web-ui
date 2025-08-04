import { FieldsSetup, IConfigProps, MetadataModel } from '../models';

export type EditFieldData = {
  field: string;
  hidden: boolean;
  data?: any;
};

export type EditProps = {
  id: string;
  name: string;
  data: any;
  config: IConfigProps;
  fieldSetup?: FieldsSetup;
  metadata?: { [key: string]: MetadataModel };
  onCallback: () => void;
};

export type ModelProps = {
  id: string;
  sort?: string;
  field: string;
  state: 'readonly' | 'hidden' | 'overwrite' | 'updated' | 'none';
  internal: string;
  consolidation: string;
  production: string;
};

export type FieldState = {
  hidden: Array<string>;
  fields?: any;
};

export type ReportParam = {
  code: string;
  discipline: string;
};

export interface IReportError extends ReportParam {
  error?: string;
}

export type Definition = {
  key: string;
  title: string;
};

export type BreadcrumbItem = {
  to?: string;
  color?: string;
  title: string;
};
