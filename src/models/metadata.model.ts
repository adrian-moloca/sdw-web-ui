export type MetaFieldType =
  | 'Enum'
  | 'String'
  | 'Collection'
  | 'Date'
  | 'Number'
  | 'Boolean'
  | 'Map';
export type MetaFieldSpecial = 'Type' | 'Extension' | 'Binary' | 'Reference' | 'Id';
export type MetaFieldEntity = 'Person' | 'Horse';
export type MetadataOption = {
  value: string;
  displayName: string;
};
export type IMetaType = { [key: string]: MetadataModel };
export type MetadataModel = {
  name: string;
  displayName: string;
  fieldType: string;
  type: MetaFieldType;
  options: MetadataOption[];
  special: MetaFieldSpecial[];
  readonly: boolean;
  system: boolean;
  required: boolean;
  isSearchable: boolean;
  hidable: boolean;
  allowFiltering: boolean;
  constraints: any[];
  unit?: string;
  entity?: string;
  reference?: string;
  dbName?: string;
};
