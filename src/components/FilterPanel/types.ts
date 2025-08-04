import { Codec } from '@toolpad/core';
import { ISortProps, IWhereProps } from 'models';

export enum FilterType {
  MedalsByCountry,
  MedalsByAthlete,
  AgeRecords,
  OlympicRecords,
  OlympicParticipation,
  Participation,
}
export type FilterKey = keyof FilterState;
export type FilterState = {
  categories?: string[];
  countries?: string[];
  city?: string[];
  sports?: string[];
  disciplines?: string[];
  eventGenders?: string[];
  genders?: string[];
  eventTypes?: string[];
  nocs?: string[];
  continents?: string[];
  competitorTypes?: string[];
  phaseTypes?: string[];
  unitTypes?: string[];
  rank?: number;
  isDemo?: boolean;
  awards?: string[];
  fromYear?: number;
  toYear?: number;
  filterModel?: IWhereProps[];
  sort?: ISortProps[];
};
export const defaultFilter: FilterState = {
  categories: ['CCAT$OLYMPIC_GAMES'],
  phaseTypes: ['RTYP$F'],
  fromYear: 1896,
};
const allFilterKeys: FilterKey[] = [
  'categories',
  'countries',
  'city',
  'sports',
  'disciplines',
  'genders',
  'eventGenders',
  'eventTypes',
  'competitorTypes',
  'nocs',
  'continents',
  'phaseTypes',
  'unitTypes',
  'rank',
  'awards',
  'fromYear',
  'toYear',
  'isDemo',
];
export const filtersByType: Record<FilterType, FilterKey[]> = {
  [FilterType.MedalsByCountry]: [
    'disciplines',
    'sports',
    'categories',
    'continents',
    'fromYear',
    'toYear',
    'eventGenders',
    'eventTypes',
  ],
  [FilterType.MedalsByAthlete]: [
    'disciplines',
    'sports',
    'categories',
    'nocs',
    'countries',
    'fromYear',
    'toYear',
    'genders',
  ],
  [FilterType.AgeRecords]: ['genders', 'disciplines', 'fromYear', 'toYear'],
  [FilterType.OlympicRecords]: ['categories', 'nocs', 'countries', 'genders', 'fromYear', 'toYear'],
  [FilterType.OlympicParticipation]: [
    'categories',
    'sports',
    'disciplines',
    'nocs',
    'countries',
    'genders',
    'fromYear',
    'toYear',
  ],
  [FilterType.Participation]: allFilterKeys,
};
export const codecFilterState: Codec<FilterState> = {
  parse: (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return defaultFilter;
    }
  },
  stringify: (value) => JSON.stringify(value),
};
