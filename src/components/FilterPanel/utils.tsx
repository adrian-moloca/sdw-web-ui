import { FilterState } from './types';

export const countActiveFilters = (filters: FilterState): number => {
  return Object.entries(filters).reduce((count, [value]) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? count + 1 : count;
    } else if (value !== undefined && value !== null) {
      return count + 1;
    }
    return count;
  }, 0);
};
