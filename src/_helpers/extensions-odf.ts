import get from 'lodash/get';
import { getJson } from './utils';

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
