import { LabelKeyMap } from 'hooks';

export const disciplineLabelKeyOverrides: Record<string, Partial<LabelKeyMap>> = {
  SDIS$BTH: {
    value2: 'general.section-time',
    value: 'general.time',
  },
  SDIS$OWS: {
    value: 'general.section-time',
    value2: 'general.accumulated-time',
  },
  SDIS$LUG: {
    value: 'general.section-time',
  },
  SDIS$CLB: {
    value2: 'general.class',
    value: 'general.points',
  },
  SDIS$SKB: {
    value: 'general.points',
    value2: 'general.best-score',
  },
  SDIS$SSK: {
    value: 'general.time',
    value2: 'general.split-time',
    totalValue: 'general.accumulated-time',
  },
  SDIS$STK: {
    value2: 'general.split-time',
    value: 'general.accumulated-time',
  },
  SDIS$ATH: {
    value2: 'general.time',
    value: 'general.accumulated-time',
  },
  SDIS$CTR: {
    value: 'general.time',
  },
  SDIS$CRD: {
    value: 'general.time',
  },
  SDIS$TRI: {
    value: 'general.time',
  },
  SDIS$SWM: {
    value2: 'general.split-time',
    value: 'general.accumulated-time',
  },
  SDIS$BMX: {
    value: 'general.accumulated-time',
  },
  SDIS$CSL: {
    value: 'general.accumulated-time',
  },
  SDIS$SHO: {
    value: 'general.points',
  },
  SDIS$GLF: {
    value: 'general.score',
    value2: 'general.score-to-par',
  },
  'SDIS$ARC-O': {
    value: 'general.score',
    value2: 'general.competitor',
  },
};
