import { t } from 'i18next';

export enum EntityType {
  Person,
  Horse,
  Event,
  Competition,
  Discipline,
  Venue,
  Stage,
  Phase,
  Team,
  Unit,
  SubUnit,
  Result,
  Participant,
  Competitor,
  ParticipantCompetition,
  Organization,
  Noc,
  Record,
  Official,
  Category,
  Entry,
  Mapping,
  Translation,
  OdfIngest,
  UsdfIngest,
  ScheduleItem,
  MergeRequest,
  DataIngest,
  HeadToHead,
  Esl,
  QualifiedAthlete,
  QualifiedTeam,
  QualifiedHorse,
  Award,
  PersonBiography,
  HorseBiography,
  TeamBiography,
  NocBiography,
  BiographyQuota,
  Edition,
  ReportCategory,
  ReportSection,
  ReportBlock,
  ReportField,
  ReportFilter,
  ReportVariation,
  ReportSource,
  Report,
  ReportDelivery,
  DeliveryPlan,
  DeliveryDataScope,
  CompetitionStructure,
  ExtractorParticipant,
  GlobalSetup,
  SecurityUser,
  SecurityClient,
  AccessRequest,
  GdsDashboard,
}
export enum EntityArea {
  Explorer = 'explorer',
  ReportsManager = 'reports-manager',
  Tools = 'tools',
  BiographiesManager = 'biographies-manager',
  Ingestion = 'ingestion',
  Admin = 'administration',
}
export type ManagerDataCategory =
  | EntityType.Edition
  | EntityType.Discipline
  | EntityType.ReportVariation
  | EntityType.ReportCategory
  | EntityType.ReportSection
  | EntityType.ReportSource
  | EntityType.ReportField
  | EntityType.ReportFilter
  | EntityType.ReportBlock
  | EntityType.Report
  | EntityType.DeliveryPlan;
type IManagerDataProps = {
  [key in string]: ManagerDataCategory;
};

export const ManagerData: IManagerDataProps = {
  Edition: EntityType.Edition,
  Discipline: EntityType.Discipline,
  Variation: EntityType.ReportVariation,
  Category: EntityType.ReportCategory,
  Section: EntityType.ReportSection,
};

type IManagerDataDisplayProps = {
  [key in ManagerDataCategory]: string;
};
export const ManagerDataDisplay: IManagerDataDisplayProps = {
  [EntityType.Edition]: t('general.editions'),
  [EntityType.Discipline]: t('general.disciplines'),
  [EntityType.ReportVariation]: t('general.reportVariations'),
  [EntityType.ReportCategory]: t('general.reportCategories'),
  [EntityType.ReportSection]: t('general.sections'),
  [EntityType.ReportBlock]: t('general.blocks'),
  [EntityType.ReportField]: t('general.fields'),
  [EntityType.ReportFilter]: t('general.filters'),
  [EntityType.ReportSource]: t('general.reportSources'),
  [EntityType.Report]: t('general.reports'),
  [EntityType.DeliveryPlan]: t('general.deliverables'),
};
