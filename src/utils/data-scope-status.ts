import { GridFilterModel, GridSortModel } from '@mui/x-data-grid-pro';
import { FilterItem, SortItem } from 'types/delivery-data-scope';
import has from 'lodash/has';

export const transformFilters = (filterModel?: GridFilterModel): FilterItem[] => {
  if (!filterModel?.items.length) return [];

  return filterModel.items
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '')
    .map((item) => {
      if (item.operator === 'isAnyOf') {
        if (Array.isArray(item.value)) {
          return {
            column: item.field,
            operator: 'inList',
            values: item.value,
            isNot: false,
          };
        }

        if (has(item.value, 'code')) {
          return {
            column: item.field,
            operator: 'inList',
            value: item.value.code,
            isNot: false,
          };
        }
      }

      return {
        column: item.field,
        operator: mapOperator(item.operator),
        value: String(item.value),
        isNot: item.operator?.includes('not') || false,
      };
    });
};

const mapOperator = (muiOperator?: string): string => {
  const operatorMap: Record<string, string> = {
    contains: 'contains',
    equals: 'equal',
    '=': 'equal',
    startsWith: 'startsWith',
    endsWith: 'endsWith',
    isEmpty: 'empty',
    isNotEmpty: 'empty',
    '>': 'greaterThan',
    '>=': 'greaterThanOrEqual',
    '<': 'lessThan',
    '<=': 'lessThanOrEqual',
    '!=': 'equal',
    isAnyOf: 'inList',
    not: 'not',
    is: 'equal',
  };
  return operatorMap[muiOperator || ''] || 'contains';
};

export const transformSort = (sortModel?: GridSortModel): SortItem[] => {
  if (!sortModel?.length) return [];

  return sortModel.map((sort) => ({
    column: sort.field,
    operator: sort.sort?.toUpperCase() || 'ASC',
  }));
};
