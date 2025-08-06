import { JSX } from 'react';

export type DeliveryDataScopeResponse = {
  content: DeliveryDataScope[];
  pagination: { rows: number; start: number; total: number };
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

export type DeliveryStatusBreakDown = {
  competitionId?: string;
  competitionName?: string;
  disciplineName: string;
  disciplineCode?: string;
  competitionCategories: string[];
  startDate?: string | number;
  finishDate?: string | number;
  country?: string;
  frequency?: number;
  scope: ScopeTypeEnum[];
  completionRate: number;
  overallStatus: StatusType;
  region?: string;
  lastDataReceivedOn?: string;
  comments?: string;
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

export interface TransformedRow {
  id: string;
  competitionId?: string;
  status: StatusType;
  readiness: number;
  disciplineName: string;
  competitionName?: string;
  competitionCategories: string[];
  fromYear: string;
  toYear: string;
  frequency: number;
  country: string;
  region: string;
  season: string;
  scopeTypes: string[];
  lastDataReceivedOn: string;
  comments: string;
  expectedCompetitions: number;
  successfullyReceived: number;
}

export interface FilterState {
  status: string[];
  scopeTypes: string[];
  country: string[];
  region: string[];
  season: string[];
  disciplineName: string[];
  competitionCategories: string[];
  readiness: number[];
}

export interface AvailableFilters {
  statuses?: string[];
  scopeTypes?: string[];
  countries?: string[];
  regions?: string[];
  seasons?: string[];
  disciplines?: string[];
  categories?: string[];
  readinessRanges?: number[];
}

export interface DataScopeMetrics {
  fullyReceived: {
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
  notReceived: {
    count: number;
    readinessPercentage: number;
  };
}

export interface TableColumn {
  field: string;
  headerName: string;
  flex?: number;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (params: any) => JSX.Element | string | null;
  valueFormatter?: (params: any) => string;
  sortComparator?: (v1: any, v2: any) => number;
}

export interface ScopeStatusInfo {
  scopeType: string;
  status: StatusType;
  readinessPercentage: number;
  label?: string;
  icon?: JSX.Element;
}

export type TabType = 'ingestion' | 'competitions';

export interface DataScopeStatusTableProps {
  rows: TransformedRow[];
  columns: TableColumn[];
  isLoading?: boolean;
  onFilterChange?: (filters: FilterState) => void;
  availableFilters?: AvailableFilters;
}

export interface CustomToolbarProps {
  clearFilters: () => void;
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  availableFilters?: AvailableFilters;
}

export interface MetricsCardProps {
  status: StatusType;
  count: number;
  percentage: number;
  isSelected: boolean;
  onClick: () => void;
}

export interface PaginationState {
  pageSize: number;
  page: number;
}

export interface SortingState {
  field: string;
  sort: 'asc' | 'desc' | null;
}

export interface ScopeTypeConfiguration {
  [key: string]: {
    label: string;
    icon: JSX.Element;
    color?: string;
  };
}
