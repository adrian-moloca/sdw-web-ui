interface DataRowResult {
  value?: string;
  value2?: string;
  totalValue?: string;
  pos?: string;
  arrive?: string;
}

interface DataColumn {
  cells: { result: DataRowResult; text?: string; frameCompetitorId?: string }[];
  frameId: string;
  header: { title: string; type?: string };
}

export interface FrameTable {
  pivotTable: {
    headers: { title: string; type?: string; duration?: string }[];
    properties: { name: string; title: string }[];
    rows: {
      [key: string]: DataRowResult[];
    };
  };
  table: {
    columns: DataColumn[];
    properties: { name: string; title: string }[];
  };
}
export interface FrameChartData {
  header: string;
  value: number;
  isTime?: boolean; // Indicates if the value is a time in seconds
}

export interface FrameChartSeriesData {
  label: string;
  data: (number | null)[];
  valueFormatter?: (value: any) => string | number; // Optional formatter for tooltip
}
