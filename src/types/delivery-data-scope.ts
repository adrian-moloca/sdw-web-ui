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

export type DeliveryStatusBreakDownScope = {
  readinessPercentage: number;
  scopeType: string;
  status: string;
};

export type DeliveryStatusBreakDown = {
  competitionCategories: string[];
  competitionId: string;
  competitionName: string;
  disciplineCode: string;
  disciplineName: string;
  country: string;
  frequency: number;
  fromYear: string;
  scope: DeliveryStatusBreakDownScope[];
  toYear: string;
  region?: string;
  lastDataReceivedOn?: string;
  comments?: string;
};

export type DeliveryDataScope = {
  ingestionDeliveryStatus: DeliveryStatus;
  competitionsDeliveryStatus: DeliveryStatus;
  deliveryStatusBreakDown: DeliveryStatusBreakDown[];
  ingestionDeliveryStatusBreakDown?: DeliveryStatusBreakDown[];
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
