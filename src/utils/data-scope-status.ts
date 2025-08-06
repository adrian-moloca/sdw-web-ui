import { GridFilterModel, GridSortModel } from '@mui/x-data-grid-pro';
import { FilterItem, SortItem } from 'types/delivery-data-scope';

export const transformFilters = (filterModel?: GridFilterModel): FilterItem[] => {
  if (!filterModel?.items.length) return [];

  return filterModel.items
    .filter((item) => item.value !== undefined && item.value !== null && item.value !== '')
    .map((item) => {
      if (item.operator === 'isAnyOf' && Array.isArray(item.value)) {
        return {
          column: item.field,
          operator: 'in',
          values: item.value,
          isNot: false,
        };
      }

      console.log('map = ', mapOperator(item.operator));
      console.log('operator = ', item.operator);

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
    equals: 'eq',
    '=': 'eq',
    startsWith: 'startsWith',
    endsWith: 'endsWith',
    isEmpty: 'isEmpty',
    isNotEmpty: 'isNotEmpty',
    '>': 'gt',
    '>=': 'gte',
    '<': 'lt',
    '<=': 'lte',
    '!=': 'neq',
    isAnyOf: 'in',
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
