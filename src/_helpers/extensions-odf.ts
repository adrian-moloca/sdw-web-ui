import get from 'lodash/get';
import { formatMasterCode, getJson } from './utils';
import odfSportCodes from '_locales/sports_data/odfSportCodes-min';
import odfOtherCodes from '_locales/sports_data/odfOtherCodes-min';
import { getDisciplineCode } from './sports';
import { UnifiedStat } from 'types/explorer';
import { t } from 'i18next';

const formatCode = (code: string) => {
  return code
    .replace('_AVG', '')
    .replace('_GK', '')
    .replace('_PERCENT', '')
    .replace('_TEAMS', '')
    .replace('_MAX', '')
    .replace('_MIN', '')
    .replace('_TOT', '')
    .replace('_COACH', '')
    .replace('_MINS', '');
};

function formatOdfDefinition(code: string, value: IOdfDefinition | undefined) {
  if (!value) return undefined;

  if (code.endsWith('_AVG')) return { ...value, text: `${value.text} (Average)` };
  if (code.endsWith('_PERCENT')) return { ...value, text: `${value.text} %` };
  if (code.endsWith('_GK')) return { ...value, text: `${value.text} (${t('general.goalkeeper')})` };
  if (code.endsWith('_TEAM')) return { ...value, text: `Team ${value.text}` };
  if (code.endsWith('_COACH')) return { ...value, text: `Coach ${value.text}` };
  if (code.endsWith('_TOT')) return { ...value, text: `${t('general.total')} ${value.text}` };
  if (code.endsWith('_MAX')) return { ...value, text: `Maximum ${value.text}` };
  if (code.endsWith('_MIN')) return { ...value, text: `Minimum ${value.text}` };
  if (code.endsWith('_MINS')) return { ...value, text: `${value.text} (Minutes)` };

  return value;
}

interface IOdfDefinition {
  dsp: string;
  code: string;
  text: string;
}

export const filterOdfDefinition = (
  code: string,
  discipline?: string
): IOdfDefinition | undefined => {
  return (
    odfSportCodes.find((x: IOdfDefinition) => x.dsp === discipline && x.code === code) ??
    odfOtherCodes.find((x: IOdfDefinition) => x.dsp === discipline && x.code === code) ??
    odfSportCodes.find((x: IOdfDefinition) => x.dsp === 'GEN' && x.code === code) ??
    odfOtherCodes.find((x: IOdfDefinition) => x.dsp === 'GEN' && x.code === code) ??
    odfSportCodes.find((x: IOdfDefinition) => x.code === code) ??
    odfOtherCodes.find((x: IOdfDefinition) => x.code === code)
  );
};

export const getOdfDefinition = (code: string, discipline?: string): IOdfDefinition | undefined => {
  if (!code) return undefined;

  const filterCode = formatCode(code);
  if (!discipline) {
    const value = filterOdfDefinition(code, 'GEN') ?? filterOdfDefinition(filterCode, 'GEN');

    return formatOdfDefinition(code, value);
  }

  const filterDiscipline = getDisciplineCode(discipline);
  const value =
    filterOdfDefinition(code, filterDiscipline) ??
    filterOdfDefinition(filterCode, filterDiscipline);

  if (!value && filterCode.includes('_')) {
    const searchValues = filterCode.split('_');
    const value = filterOdfDefinition(searchValues[0], filterDiscipline);
    const value2 = filterOdfDefinition(searchValues[1], filterDiscipline);

    if (value && value2) {
      return { ...value, text: `${value2.text} ${value.text}` };
    }

    if (value || value2) {
      return value;
    }

    return undefined;
  }

  return formatOdfDefinition(code, value);
};

export const formatCompactValue = (row: any): string => {
  let formatValue = get(row, 'value') ?? '0';
  const percent = get(row, 'percent');
  const attempt = get(row, 'attempt');
  const avg = get(row, 'avg');

  if (attempt) {
    formatValue = formatValue ? `${formatValue} / ${attempt}` : attempt;
  }
  if (percent) {
    formatValue = formatValue ? `${formatValue} - ${percent}%` : `${percent}%`;
  }
  if (avg) {
    formatValue = `${formatValue} | ${avg}`;
  }

  return formatValue;
};

export const transformOdfExtensions = (data: any, field: string, subfield?: string) => {
  if (subfield) {
    let result = get(data, `${field}.${subfield}`);
    result ??= get(getJson(get(data, field)), subfield);

    if (result) {
      if (!Array.isArray(result)) {
        result = Object.values(result);
      }
    }

    return result;
  }
  let result = get(data, field);
  result ??= getJson(get(data, field));

  if (result) {
    if (!Array.isArray(result)) {
      result = Object.values(result);
    }
  }

  return result;
};

export const getStatsValue = (data: any) => {
  let result = get(data, 'stats.odfStatsTournament.stats');

  if (!result) {
    result = get(getJson(get(data, 'stats.odfStatsTournament')), 'stats');

    if (!result) {
      result = get(data, 'stats.odfStatsTournament');
      result ??= get(getJson(get(data, 'stats')), 'odfStatsTournament');
    }
  }

  if (result) {
    if (!Array.isArray(result)) {
      result = Object.values(result);
    }
  }

  return result;
};

export const extractValueByCode = (
  data: any,
  code: string,
  field?: string,
  type?: string,
  emptyPosition: boolean = false
): string | null => {
  if (!data || typeof data !== 'object') return null;
  const fieldValue = field ?? 'value';
  if (Array.isArray(data)) {
    for (const item of data) {
      if (emptyPosition) {
        if (
          item.code === code &&
          item.value &&
          (!Object.prototype.hasOwnProperty.call(item, 'pos') || item.pos === 0) &&
          !Object.prototype.hasOwnProperty.call(item, 'ext')
        ) {
          if (!type) return get(item, fieldValue); // Return the value when the code matches
          if (item.type === type) return get(item, fieldValue);
        }
        const result = extractValueByCode(item, code, field, type, emptyPosition);
        if (result) return result;
      } else {
        if (item.code === code && item.value) {
          if (!type) return get(item, fieldValue); // Return the value when the code matches
          if (item.type === type) return get(item, fieldValue);
        }
        const result = extractValueByCode(item, code, field, type, emptyPosition);
        if (result) return result;
      }
    }
  }
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const result = extractValueByCode(data[key], code, field, type, emptyPosition);
      if (result) return result;
    }
  }
  return null; // Return null if code not found
};

export const unifyStats = (competitors: any[], discipline: string): UnifiedStat[] => {
  const map = new Map<string, UnifiedStat>();
  const masterCode = formatMasterCode(discipline);

  const getStatsFromCompetitor = (competitor: any) =>
    get(competitor, 'extendedInfo.odfExtensions.stats') ??
    get(competitor, 'extendedInfo.stats') ??
    [];

  const getFinalStats = (stats: any[]) => {
    const filteredStats = stats.filter((x: any) => !x.pos || x.pos === 'TOT');
    return filteredStats.length > 0 ? filteredStats : stats;
  };

  const getDefinition = (code: string) =>
    filterOdfDefinition(code, masterCode) ?? getOdfDefinition(code, masterCode);

  const parseValue = (stat: any) => {
    const raw = get(stat, 'value') ?? get(stat, 'percent');
    const parsed = parseFloat(raw);
    return isNaN(parsed) ? null : parsed;
  };

  const buildCompetitorStat = (
    stat: any,
    competitor: any,
    definition: any,
    valueNum: number | null
  ) => ({
    code: stat.code,
    description: definition?.text ?? formatCode(stat.code),
    value: formatCompactValue(stat) ?? '0',
    valueNum,
    id: competitor.id,
    name: competitor.name,
  });

  for (const competitor of competitors) {
    const stats = getStatsFromCompetitor(competitor);
    const finalStats = getFinalStats(stats);

    for (const stat of finalStats) {
      if (!map.has(stat.code)) {
        map.set(stat.code, {
          code: stat.code,
          competitors: [],
        });
      }
      const unified = map.get(stat.code)!;
      const definition = getDefinition(stat.code);
      const valueNum = parseValue(stat);
      const competitorStat = buildCompetitorStat(stat, competitor, definition, valueNum);

      unified.competitors.push(competitorStat);
    }
  }

  return Array.from(map.values());
};

export const formatExtendedValue = (row: any): string => {
  const value = get(row, 'value');
  if (value === undefined || value === null) return '';

  const percent = get(row, 'percent');
  const attempt = get(row, 'attempt');
  const avg = get(row, 'avg');
  const totalValue = get(row, 'totalValue');
  const diff = get(row, 'diff');

  let formatValue = `${value}`;
  if (diff !== undefined) formatValue += ` ${diff}`;
  if (attempt !== undefined) formatValue += `/${attempt}`;
  if (percent !== undefined) formatValue += ` - ${percent}%`;
  if (avg !== undefined) formatValue += ` | Avg: ${avg}`;
  if (totalValue !== undefined) formatValue += ` | 🚩 ${totalValue}`;

  return formatValue;
};
