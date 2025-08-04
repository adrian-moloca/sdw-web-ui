export type TimeData = {
  avg: string;
  max: string;
  mix: string;
};

export type GFilter = {
  event?: string;
  stage?: string;
  phase?: string;
  unit?: string;
};

export type GraphFilterProps = {
  data: any[];
  setGraphData: (filters: GFilter) => void;
};

export type RuleProps = {
  data: any;
  expanded: boolean;
  onClick: (e: any) => void;
};

export type StructureView = 'output' | 'rules' | 'raw' | 'headers';

export type StructureType = 'event' | 'stage' | 'phase' | 'unit' | 'subunit';
