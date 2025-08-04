import { SearchQuery } from '../models';

export type BuildFilter = {
  search?: string;
  filters: SearchQuery;
};

export type FilterMode = {
  date: boolean;
  country: boolean;
  gender: boolean;
  name: boolean;
  type: boolean;
  discipline: boolean;
  [key: string]: boolean;
};
