export type DeliveryStatus = {
  fullyReceived: {
    count: number;
    readinessPercentage: number;
  };
  notReceived: {
    count: number;
    readinessPercentage: number;
  };
  partiallyReceived: {
    count: number;
    readinessPercentage: number;
  };
  partiallyReceivedWithErrors: {
    count: number;
    readinessPercentage: number;
  };
};

export type StatusType =
  | 'fullyReceived'
  | 'partiallyReceived'
  | 'partiallyReceivedWithErrors'
  | 'notReceived'
  | 'notApplicable';

export enum ScopeTypeEnum {
  RESULTS = 'results',
  RANKING = 'ranking',
  MEDALLISTS = 'medallists',
  TEAM_MEMBERS = 'teamMembers',
  POOLS = 'pools',
  RESULTS_BREAKDOWN = 'resultsBreakdown',
  SEASONAL_STANDINGS = 'seasonalStandings',
  SEASONAL_RANKINGS = 'seasonalRankings',
  OVERALL_STANDINGS = 'overallStandings',
  RELAY = 'relay',
}

export type DeliveryStatusBreakDown = {
  competitionId?: string;
  competitionName?: string;
  disciplineName: string;
  disciplineCode?: string;
  competitionCategories: string[];
  fromYear?: string | number;
  toYear?: string | number;
  country?: string;
  frequency?: number;
  scopeType: ScopeTypeEnum[];
  readinessPercentage: number;
  status: StatusType;
  region?: string;
  lastDataReceivedOn?: string;
  comments?: string;
};

export type DeliveryDataScope = {
  packageDeliveryStatus: DeliveryStatus;
  competitionsDeliveryStatus: DeliveryStatus;
  packageDeliveryStatusBreakDown?: DeliveryStatusBreakDown[];
  competitionsDeliveryStatusBreakDown?: DeliveryStatusBreakDown[];
  edition: {
    id: string;
    name: string;
  };
};

export type DeliveryDataScopeResponse = {
  content: DeliveryDataScope[];
  pagination: { rows: number; start: number; total: number };
};

export type DeliveryDataScopePayload = {
  enablePagination: boolean;
  rows: number;
  start: number;
  editionId: string;
  parentId: string | null;
  disciplines: string[];
};
