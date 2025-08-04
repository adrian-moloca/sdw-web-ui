export type MedalType = 'golden' | 'silver' | 'bronze';

export type KpiDataProps = {
  value: string;
  title: string;
};

export type Participant = {
  phaseId: string;
  opponentId1: string;
  opponentId2: string;
  order: number;
};

export type PhaseBrackets = {
  mappings: Participant[];
  competitors: any[];
};

export type Link = {
  href: string;
  method: string;
  rel: 'phase_units' | 'phase';
};

export type TCardProps = {
  data: any;
  discipline: string;
  showTitle: boolean;
  defaultExpanded?: boolean;
};
export interface ResultProps {
  data: any;
  dataset: Array<any>;
  field?: string;
  direct?: boolean;
}

export interface RCProps {
  data: any;
  discipline: string;
  frames?: Array<any>;
}
export interface MedalProps {
  element: any;
  medals: Array<any>;
}
export type UsdmType = 'stage' | 'phase' | 'unit' | 'phase-units';
export type CompetitorStat = {
  code: string;
  description: string;
  value: string | null;
  valueNum: number | null;
  name: string;
  id: string;
};
export type UnifiedStat = {
  code: string;
  competitors: CompetitorStat[];
};
