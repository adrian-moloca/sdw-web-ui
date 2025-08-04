export type ScopeEntry = {
  scopeType: string;
  status: string;
  readinessPercentage: number;
};

export type DeliveryBreakdownEntry = {
  competitionId: string;
  competitionName: string;
  disciplineName: string;
  competitionCategories: string[];
  fromYear: string | number;
  toYear: string | number;
  country?: string;
  frequency: number;
  scope: ScopeEntry[];
};

export type StatusType =
  | 'fullyReceived'
  | 'partiallyReceived'
  | 'partiallyReceivedWithErrors'
  | 'notReceived';

export interface FilterState {
  status: string[];
  scopeTypes: string[];
  country: string[];
  region: string[];
  season: string[];
  disciplineName: string[];
  competitionCategories: string[];
}

export interface AvailableFilters {
  statuses?: string[];
  scopeTypes?: string[];
  countries?: string[];
  regions?: string[];
  seasons?: string[];
  disciplines?: string[];
  categories?: string[];
}
