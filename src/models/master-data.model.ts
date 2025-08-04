export type MasterDataKey = 'key' | 'upstreamKey';
export type MasterDataValue = 'value' | 'upstreamTitle' | 'longValue';
/**
 * Master data dictionary reference
 */
export type MasterDataDictionaryRef = {
  /**
   * In URL response Dropdown.value will be as a 'key'
   * In out system it is a Dropdown.value
   */
  key: MasterDataKey;
  /**
   *  * In URL response Dropdown.displayName will be as a 'value'
   * In our system it is a Dropdown.displayName
   */
  value: MasterDataValue;
  /** Url for Master Data mapping */
  url: string;
};

export type CategoryBase = {
  id: number;
  key: string;
  value: string;
  parentKey?: string;
  categoryKey: string;
};

export type CategoryLong = CategoryBase & {
  longValue: string;
};

export type CategoryUpstream = {
  upstreamKey: string;
  upstreamTitle: string;
};

export type Category = CategoryBase | CategoryLong | CategoryUpstream;

export type Entry = {
  id: string;
  abbreviation?: string;
  description?: string;
  key: string;
  longValue?: string;
  parentKey?: string;
  value: string;
  childItems?: number;
  childCategories?: Category[];
  categoryKey: string;
};
export type DisplayEntry = {
  id?: string;
  parentId?: string;
  code?: string;
  title: string;
};
export type MetaField = {
  code: string;
  title: string;
  dataType: 'string' | 'date' | 'number';
  type: 'all' | 'reportVariation' | 'reportSection' | 'reportBlock';
};
export type MasterDataCategory =
  | 'CNTR'
  | 'SDIS'
  | 'SGEN'
  | 'ORGT'
  | 'FUNC'
  | 'EVNT'
  | 'NOC'
  | 'CCAT'
  | 'PGEN'
  | 'SPRT'
  | 'RTYP'
  | 'CNTN'
  | 'UTYP'
  | 'RCTP'
  | 'RCLV'
  | 'AWSB'
  | 'TTYP'
  | 'STYP'
  | 'PTYP'
  | 'HRSX'
  | 'HRCL'
  | 'HRBR'
  | 'SCTP'
  | 'SC_QUMARK'
  | 'SC_REST'
  | 'SC_IRM'
  | 'RCST'
  | 'ROLE'
  | 'SC_WLT'
  | 'SCST';
export type MasterDataInnerKey =
  | 'Country'
  | 'Discipline'
  | 'SportGender'
  | 'OrganisationType'
  | 'Noc'
  | 'EventType'
  | 'CompetitionCategory'
  | 'Function'
  | 'Sport'
  | 'RoundType'
  | 'Continent'
  | 'UnitType'
  | 'PersonGender'
  | 'RecordType'
  | 'RecordLevel'
  | 'TeamType'
  | 'StageType'
  | 'PhaseType'
  | 'HorseGender'
  | 'HorseColor'
  | 'HorseBreed'
  | 'ScheduleType'
  | 'ResultType'
  | 'ScheduleStatus'
  | 'QualificationMark'
  | 'Irm'
  | 'Wlt'
  | 'Role'
  | 'ResultStatus'
  | 'AwardSubClass';
type IMasterDataProps = {
  [key in MasterDataInnerKey]: MasterDataCategory;
};

export const MasterData: IMasterDataProps = {
  AwardSubClass: 'AWSB',
  CompetitionCategory: 'CCAT',
  Continent: 'CNTN',
  Country: 'CNTR',
  Discipline: 'SDIS',
  EventType: 'EVNT',
  Function: 'FUNC',
  HorseBreed: 'HRBR',
  HorseColor: 'HRCL',
  HorseGender: 'HRSX',
  Irm: 'SC_IRM',
  Noc: 'NOC',
  OrganisationType: 'ORGT',
  PersonGender: 'PGEN',
  PhaseType: 'PTYP',
  QualificationMark: 'SC_QUMARK',
  RecordLevel: 'RCLV',
  RecordType: 'RCTP',
  ResultStatus: 'RCST',
  ResultType: 'SC_REST',
  Role: 'ROLE',
  RoundType: 'RTYP',
  ScheduleStatus: 'SCST',
  ScheduleType: 'SCTP',
  Sport: 'SPRT',
  SportGender: 'SGEN',
  StageType: 'STYP',
  TeamType: 'TTYP',
  UnitType: 'UTYP',
  Wlt: 'SC_WLT',
};

export const masterDataCategories: MasterDataCategory[] = [
  MasterData.AwardSubClass,
  MasterData.CompetitionCategory,
  MasterData.Continent,
  MasterData.Country,
  MasterData.Discipline,
  MasterData.EventType,
  MasterData.Function,
  MasterData.HorseBreed,
  MasterData.HorseColor,
  MasterData.HorseGender,
  MasterData.Irm,
  MasterData.Noc,
  MasterData.OrganisationType,
  MasterData.PersonGender,
  MasterData.PhaseType,
  MasterData.QualificationMark,
  MasterData.RecordLevel,
  MasterData.RecordType,
  MasterData.ResultStatus,
  MasterData.ResultType,
  MasterData.Role,
  MasterData.RoundType,
  MasterData.ScheduleStatus,
  MasterData.ScheduleType,
  MasterData.Sport,
  MasterData.SportGender,
  MasterData.StageType,
  MasterData.TeamType,
  MasterData.UnitType,
  MasterData.Wlt,
];
