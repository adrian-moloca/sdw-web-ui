import { GridFilterItem } from '@mui/x-data-grid-pro';
import { GridSortItem } from '@mui/x-data-grid/models/gridSortModel';
import { QueryOptionsProps } from 'types/datagrid';
import { isValidDate } from '_helpers';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import dayjs from 'dayjs';
import {
  ApiVersion,
  EntityType,
  IConfigProps,
  IQueryProps,
  ISortProps,
  IWhereProps,
  MetadataModel,
  OperatorType,
  QueryExtendFilter,
  SearchPayload,
  SearchQuery,
  SearchQueryLogicOperator,
  SearchQueryOperator,
  SearchQueryWhere,
} from '../models';

const mapDataContent = (content: any[], mappingFunction: (item: any) => any) => {
  return content?.map(mappingFunction) ?? [];
};

export const executeQuery = (
  apiService: any,
  config: IConfigProps,
  apiVersion: ApiVersion,
  currentFilter: any,
  dataSource?: IQueryProps
) => {
  switch (apiVersion) {
    case 'master':
      return apiService.getMasterData(dataSource?.url ?? config.apiNode, currentFilter);
    case 'filter':
      return apiService.filter(dataSource?.url ?? config.apiNode, currentFilter);
    case 'search':
      return apiService.search(dataSource?.url ?? `${config.apiNode}/search`, currentFilter);
    case 'direct':
      return apiService.fetch(dataSource?.url ?? `${config.apiNode}/search`);
    default:
      return apiService.search(dataSource?.url ?? `${config.apiNode}/search`, currentFilter);
  }
};

const calculateMasterFilter = (paginationModel: any, queryOptions: QueryOptionsProps) => {
  const variables: any = {
    enablePagination: true,
    rows: paginationModel?.pageSize ?? 25,
    start: (paginationModel?.page ?? 0) * (paginationModel?.pageSize ?? 0),
  };

  if (
    queryOptions.filterModel?.quickFilterValues &&
    queryOptions.filterModel?.quickFilterValues?.length > 0
  ) {
    set(variables, 'search', queryOptions.filterModel?.quickFilterValues.join(' '));
  } else if (queryOptions.filterModel) {
    const validFilters = queryOptions.filterModel.items.filter((e: any) => has(e, 'value'));

    if (validFilters && validFilters.length > 0) {
      validFilters.forEach((e: GridFilterItem) => {
        set(variables, 'search', e.value);
      });
    }
  }
  return variables;
};

const calculateFilterApiVersionFilter = (
  paginationModel: any,
  queryOptions: QueryOptionsProps,
  where: IWhereProps[] | undefined,
  tags: QueryExtendFilter | undefined
) => {
  const variables = {
    enablePagination: true,
    rows: paginationModel?.pageSize ?? 25,
    start: (paginationModel?.page ?? 0) * (paginationModel?.pageSize ?? 0),
    filters: where,
    extendedFilters: tags,
  };

  if (
    queryOptions.filterModel?.quickFilterValues &&
    queryOptions.filterModel?.quickFilterValues?.length > 0
  )
    set(variables, 'search', queryOptions.filterModel?.quickFilterValues.join(' '));

  if (queryOptions?.sortModel && queryOptions.sortModel.length > 0) {
    const orderBy: ISortProps[] = [];
    queryOptions.sortModel.forEach((e: GridSortItem) =>
      orderBy.push({
        column: parseFilterField(e.field),
        operator: e.sort != undefined ? e.sort.toUpperCase() : 'ASC',
      })
    );

    set(variables, 'sort', orderBy);
  }

  if (queryOptions.filterModel) {
    const validFilters = queryOptions.filterModel.items.filter((e: any) => has(e, 'value'));

    if (validFilters && validFilters.length > 0) {
      const gridFilters: IWhereProps[] = [];
      validFilters.forEach((e: GridFilterItem) => {
        const filter = parseFilter(e);
        if (filter) gridFilters.push(filter);
      });

      set(variables, 'filters', gridFilters);
    }
  }
  return variables;
};

const initializeSearchPayload = (
  paginationModel: any,
  sorting?: ISortProps[],
  query?: SearchQuery,
  tags?: QueryExtendFilter
): SearchPayload => ({
  pagination: {
    rows: paginationModel?.pageSize ?? 25,
    start: (paginationModel?.page ?? 0) * (paginationModel?.pageSize ?? 0),
    total: 0,
  },
  sort: sorting,
  query,
  extendedFilters: tags,
});

const calculateDefaultFilters = (
  queryOptions: QueryOptionsProps,
  paginationModel: any,
  tags?: QueryExtendFilter,
  query?: SearchQuery,
  sorting?: ISortProps[],
  metadata?: { [p: string]: MetadataModel }
) => {
  const variables: SearchPayload = initializeSearchPayload(paginationModel, sorting, query, tags);

  if (
    queryOptions.filterModel?.quickFilterValues &&
    queryOptions.filterModel?.quickFilterValues?.length > 0
  ) {
    set(variables, 'search', queryOptions.filterModel?.quickFilterValues.join(' '));
  }

  if (queryOptions?.sortModel && queryOptions.sortModel.length > 0) {
    const orderBy: ISortProps[] = [];
    queryOptions.sortModel.forEach((e: GridSortItem) =>
      orderBy.push({
        column: get(metadata, e.field)?.dbName ?? e.field,
        operator: e.sort != undefined ? e.sort.toUpperCase() : 'ASC',
      })
    );
    variables.sort = orderBy;
  }

  const { filterModel } = queryOptions;

  if (filterModel) {
    const validFilters = filterModel.items.filter((e: any) => has(e, 'value'));

    if (validFilters.length > 0) {
      let gridFilters: Array<SearchQueryWhere> = [];
      validFilters.forEach((e: GridFilterItem) => {
        const filters = parseSearchFilter(e, metadata);
        if (filters.length > 0) gridFilters = [...gridFilters, ...filters];
      });

      const where = variables.query?.where;
      const operator = (
        filterModel?.logicOperator ? filterModel.logicOperator.toUpperCase() : 'AND'
      ) as SearchQueryLogicOperator;

      variables.query = {
        operator,
        where: where ? [...where, ...gridFilters] : gridFilters,
      };
    }
  }
  return variables;
};

export const calculateCurrentFilter = (
  queryOptions: QueryOptionsProps,
  paginationModel: any,
  apiVersion: ApiVersion,
  options: {
    tags?: QueryExtendFilter;
    query?: SearchQuery;
    sorting?: Array<ISortProps>;
    metadata?: { [key: string]: MetadataModel };
    where?: IWhereProps[];
  }
) => {
  const { tags, query, sorting, metadata, where } = options;

  switch (apiVersion) {
    case 'master': {
      return calculateMasterFilter(paginationModel, queryOptions);
    }
    case 'filter': {
      return calculateFilterApiVersionFilter(paginationModel, queryOptions, where, tags);
    }
    default: {
      return calculateDefaultFilters(queryOptions, paginationModel, tags, query, sorting, metadata);
    }
  }
};

export function getDataArray<T>(apiVersion: ApiVersion, data: any, entityType: EntityType): T[] {
  switch (apiVersion) {
    case 'master':
      if (entityType === EntityType.Translation) {
        return mapDataContent(data?.content, (item: any) => ({
          id: `${item.key}${item.languageCode}`,
          ...item,
        }));
      }
      return mapDataContent(data?.content, (item: any) => ({ id: item.key, ...item }));
    case 'direct':
      return data?.data ?? [];
    default: {
      if (entityType === EntityType.MergeRequest) {
        return mapDataContent(data?.content, (item: any) => ({ id: item.requestId, ...item }));
      }
      return data?.content ?? [];
    }
  }
}

export const getTotalCount = (data: any): number => {
  return data?.pagination?.total ?? data?.content?.length ?? 0;
};

export const parseFilterField = (field: string): string => {
  if (field.endsWith('.code')) {
    return field.replace('.code', 'Id');
  }

  switch (field) {
    case 'opponent1':
      return 'opponent1_participationName';
    case 'opponent2':
      return 'opponent2_participationName';
    case 'errorFlag':
      return 'errFlag';
    default:
      return field;
  }
};

const handleDefaultLogicFilter = (value: any, filterField: string) => {
  if (!value) return null;

  if (typeof value === 'string') {
    return { column: filterField, values: [value], operator: OperatorType.InList };
  }

  if (isValidDate(value)) {
    return {
      column: filterField,
      values: [dayjs(value).format('YYYY-MM-DD')],
      operator: OperatorType.Equal,
    };
  }

  if (value instanceof Array) {
    return {
      column: filterField,
      values: value.map((x: any) => (typeof x === 'string' ? x : x.code)),
      operator: OperatorType.InList,
    };
  }
  return {
    column: filterField,
    values: [value.code.toString()],
    operator: OperatorType.InList,
  };
};

export const parseFilter = (e: GridFilterItem): IWhereProps | null => {
  const filterField = parseFilterField(e.field);
  const { value } = e;

  if (e.operator === 'isEmpty') {
    return { column: filterField, value, operator: OperatorType.Empty };
  }

  if (e.operator === 'isNotEmpty') {
    return { column: filterField, value, operator: OperatorType.Empty, isNot: true };
  }

  if (e.operator === 'isAnyOf') {
    return handleDefaultLogicFilter(value, filterField);
  }

  const operatorMap: Record<string, { operator: string; isNot?: boolean }> = {
    startsWith: { operator: OperatorType.StartsWith },
    '<': { operator: OperatorType.LessThan },
    before: { operator: OperatorType.LessThan },
    '<=': { operator: OperatorType.LessThanOrEqual },
    onOrBefore: { operator: OperatorType.LessThanOrEqual },
    '>': { operator: OperatorType.GreaterThan },
    after: { operator: OperatorType.GreaterThan },
    '>=': { operator: OperatorType.GreaterThanOrEqual },
    onOrAfter: { operator: OperatorType.GreaterThanOrEqual },
    '!=': { operator: OperatorType.Equal, isNot: true },
    not: { operator: OperatorType.Equal, isNot: true },
    endsWith: { operator: OperatorType.EndsWith },
    contains: { operator: OperatorType.Contains },
    equals: { operator: OperatorType.Equal },
    '=': { operator: OperatorType.Equal },
    is: { operator: OperatorType.Equal },
  };

  const operatorConfig = operatorMap[e.operator];

  if (operatorConfig) {
    return value
      ? {
          column: filterField,
          value,
          operator: operatorConfig.operator,
          ...(operatorConfig.isNot ? { isNot: true } : {}),
        }
      : null;
  }

  return handleDefaultLogicFilter(value, filterField);
};

export const parseSearchFilter = (
  e: GridFilterItem,
  metadata?: { [key: string]: MetadataModel }
): Array<SearchQueryWhere> => {
  const columnName = get(metadata, e.field)?.dbName ?? e.field;
  const { operator, value } = e;

  if (value === undefined || (value === null && !['isEmpty', 'isNotEmpty'].includes(operator))) {
    return [];
  }

  const getStringSearchQuery = (val: any, prefix = '', suffix = '') => {
    return val ? [{ column: columnName, value: `${prefix}${val}${suffix}` }] : [];
  };

  const getDateSearchQuery = (val: any, op: SearchQueryOperator) => {
    if (isValidDate(val)) {
      return [{ column: columnName, value: dayjs(val).format('YYYY-MM-DD'), operator: op }];
    }
    return val ? [{ column: columnName, value: val, operator: op }] : [];
  };

  const getEqualsSearchQuery = (val: any): SearchQueryWhere[] => {
    if (isValidDate(val)) {
      return [{ column: columnName, value: dayjs(val).format('YYYY-MM-DD') }];
    }
    return val ? [{ column: columnName, value: val }] : [];
  };

  const stringOperators: { [key: string]: (val: any) => SearchQueryWhere[] } = {
    startsWith: (val) => getStringSearchQuery(val, '', '*'),
    endsWith: (val) => getStringSearchQuery(val, '*', ''),
    contains: (val) => getStringSearchQuery(val, '*', '*'),
    '!=': (val) => (val ? [{ column: columnName, value: val, exclude: true }] : []),
    not: (val) => (val ? [{ column: columnName, value: val, exclude: true }] : []),
    equals: (val) => {
      if (isValidDate(val)) {
        return [{ column: columnName, value: dayjs(val).format('YYYY-MM-DD') }];
      } else if (val) {
        return [{ column: columnName, value: val }];
      }

      return [];
    },
    is: (val) => {
      if (isValidDate(val)) {
        return [{ column: columnName, value: dayjs(val).format('YYYY-MM-DD') }];
      } else if (val) {
        return [{ column: columnName, value: val }];
      }

      return [];
    },
    '=': (val) => {
      if (isValidDate(val)) {
        return [{ column: columnName, value: dayjs(val).format('YYYY-MM-DD') }];
      } else if (val) {
        return [{ column: columnName, value: val }];
      }

      return [];
    },
  };

  const dateOperators: { [key: string]: (val: any) => SearchQueryWhere[] } = {
    '<': (val) => getDateSearchQuery(val, 'LESS'),
    before: (val) => getDateSearchQuery(val, 'LESS'),
    '<=': (val) => getDateSearchQuery(val, 'LTE'),
    onOrBefore: (val) => getDateSearchQuery(val, 'LTE'),
    '>': (val) => getDateSearchQuery(val, 'GREATER'),
    after: (val) => getDateSearchQuery(val, 'GREATER'),
    '>=': (val) => getDateSearchQuery(val, 'GTE'),
    onOrAfter: (val) => getDateSearchQuery(val, 'GTE'),
  };

  if (stringOperators[operator]) {
    return stringOperators[operator](value);
  }

  if (dateOperators[operator]) {
    return dateOperators[operator](value);
  }

  switch (operator) {
    case 'isEmpty':
      return [{ column: columnName, value: null }];
    case 'isNotEmpty':
      return [{ column: columnName, value: null, exclude: true }];
    case 'isAnyOf':
    default:
      if (!value) return [];

      if (typeof value === 'string' || isValidDate(value)) {
        return getEqualsSearchQuery(value);
      }

      if (value instanceof Array) {
        return [
          {
            column: columnName,
            value: value.map((x: any) => (typeof x === 'string' ? x : x.code)),
            operator: 'OR',
          },
        ];
      }

      return [{ column: columnName, value: value.code.toString(), operator: 'OR' }];
  }
};
