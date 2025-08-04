import disciplines from '../_locales/sports_data/disciplines-min';
import { formatMasterCode } from './utils';
import orderBy from 'lodash/orderBy';

export const formatDisciplineList = (input?: any[]) => {
  if (!input) return [];
  const data = input.map(
    (x: any) => ({
      ...x,
      display: `${getDisciplineDirectCode(x.sportDisciplineId, x.title)} - ${x.title}`,
    }),
    'display'
  );
  return orderBy(data, 'display');
};

export const getDisciplineDirectCode = (code: string, title?: string) => {
  let result = formatMasterCode(code);
  const discipline = disciplines.sports.find((x: any) => x.code === result);
  if (discipline) return result;

  if (result.startsWith('SDC-')) {
    result = disciplines.sports.find((x: any) => x.name === title)?.code ?? 'ATH';
  }

  return result;
};
export const getDisciplineTitle = (code: string) => {
  const result = formatMasterCode(code);
  const discipline = disciplines.sports.find((x: any) => x.code === result);
  return discipline?.name;
};
export const getDisciplineCode = (code: string, title?: string) => {
  let result = formatMasterCode(code);

  const discipline = disciplines.sports.find((x: any) => x.code === result);

  const mapping: { [key: string]: string } = {
    GYM: 'GAR',
    ART: 'GAR',
    MIX: 'ATH',
    DSR: 'ATH',
    AAT: 'ATH',
    'ARC-O': 'ARC',
    'ARC-F': 'ARC',
    'ARC-I': 'ARC',
    'ARC-D': 'ARC',
    EDR: 'EQU',
    EDV: 'EQU',
    EVE: 'EQU',
    EVA: 'EQU',
    RHK: 'HOC',
    HK5: 'HOC',
    IH3: 'IHO',
    ISS: 'IHO',
    BWL: 'HBL',
    JDP: 'HBL',
    RGS: 'RU7',
    AFB: 'RU7',
    BLN: 'BOB',
    BLS: 'BOB',
    KFB: 'BOB',
    BTL: 'MPN',
    LSR: 'MPN',
    TTL: 'MPN',
    API: 'SBD',
    CRO: 'CRI',
    MSP: 'SMT',
    BDY: 'IHO',
    MCS: 'BMX',
    SUM: 'WRE',
    KYU: 'KEN',
    FFG: 'SHO',
    SPS: 'SSK',
    FSH: 'SWM',
    AUT: 'BMF',
    CMA: 'CSP',
    GLM: 'WRE',
    WSK: 'SRF',
    KEN: 'TKW',
    WUS: 'TKW',
    ACB: 'WRE',
    ARF: 'FBL',
    FTS: 'FBL',
    SOF: 'BSB',
  };

  if (mapping[result]) {
    return mapping[result];
  }

  if (result?.startsWith('SDC-')) {
    result = disciplines.sports.find((x: any) => x.name === title)?.code ?? 'ATH';
  }

  if (discipline) return result;

  return 'ATH';
};
