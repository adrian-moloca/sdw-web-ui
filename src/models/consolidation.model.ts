import { EntityType } from 'models';
export const ValidMergeEntityTypes: EntityType[] = [
  EntityType.Person,
  EntityType.Horse,
  EntityType.Team,
  EntityType.Organization,
  EntityType.Venue,
];
export const ValidEditEntityTypes: EntityType[] = [
  EntityType.Noc,
  EntityType.Competition,
  EntityType.Discipline,
  EntityType.Event,
  ...ValidMergeEntityTypes,
];
export const ExcludedFields: string[] = [
  'ingestSystem',
  'ingestOrganisation',
  'id',
  'ts',
  'sources',
];
export const LongFields: string[] = [
  'information',
  'ambition',
  'injuries',
  'hobbies',
  'startedCompeting',
  'generalBiography',
  'competingBiography',
  'officialBiography',
  'officialAppointment',
  'coachingBiography',
  'coachingAppointment',
  'hero',
  'memorableAchievement',
  'milestones',
  'gallery',
];
export const HtmlFields: string[] = [...LongFields, 'summary', 'sportingDebut'];
export const canMerge = (type: EntityType): boolean => ValidMergeEntityTypes.includes(type);
export type MergeRequest = {
  id: string;
  title: string;
  type: string;
  conflictStatus: string;
  entityType: string;
  entitySubType?: string;
  status: string;
  dataSources: string[];
  workflowState: string;
  assignee: string;
  userId: string;
  createdTs: Date;
  dsRecords: any[];
  conflicts: any[];
  link?: string;
};

export type FieldValue = {
  field: string;
  value: string;
};

export type FieldsSetup = {
  enabled: boolean;
  state: 'none' | 'valid' | 'errorInternal' | 'errorProduction' | 'needReview';
  hidden: Array<string>;
  consolidationRecord?: any;
  internalRecord?: any;
  productionRecord?: any;
};
