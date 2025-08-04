import { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid-pro';
import has from 'lodash/has';
import { IDataGridProps, QueryOptionsProps } from 'types/datagrid';
import useDataGridHelper from 'hooks/useDataGridHelper';
import useApiService from 'hooks/useApiService';
import { calculateCurrentFilter, executeQuery, getDataArray, getTotalCount } from 'utils/datagrid';
import { DataGridDisplay } from '../DataGridDisplay';

interface Props<T> extends Readonly<IDataGridProps<T>> {
  readonly pageSize?: number;
  readonly onSelectMultiple?: (items: Array<T>) => void;
}

export function EmbeddedDataGrid<T>({
  dataSource,
  config,
  filters,
  flags,
  pageSize,
  query,
  tags,
  sorting,
  metadata,
  toolbar,
  toolbarType,
  where,
  onSelect,
  onCreate,
  onUpdate,
  onOther,
  refetchQueries,
}: Props<T>) {
  const { getColumns } = useDataGridHelper();
  const apiService = useApiService();
  const apiVersion = dataSource?.apiVersion ?? config.apiVersion;
  const defaultPaginationModel: GridPaginationModel = {
    pageSize: pageSize ?? 25,
    page: 0,
  };
  const [queryOptions, setQueryOptions] = useState<QueryOptionsProps>({
    filterModel: { items: [], quickFilterValues: [] },
    sortModel: undefined,
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize ?? 25,
    page: 0,
  });

  const [rowCountState, setRowCountState] = useState(0);

  const currentFilter = useMemo(() => {
    return calculateCurrentFilter(queryOptions, paginationModel, config.apiVersion, {
      tags,
      query,
      sorting,
      metadata,
      where,
    });
  }, [apiVersion, filters, tags, where, sorting, query, metadata, paginationModel, queryOptions]);

  const { data, error, isLoading } = useQuery({
    queryKey: [`${config.entityName}_index`, dataSource?.url, config.apiNode, currentFilter],
    queryFn: () => executeQuery(apiService, config, apiVersion, currentFilter, dataSource),
    refetchOnMount: true,
  });

  const gridData =
    isLoading || error
      ? { data: [], totalCount: undefined }
      : {
          data: getDataArray<T>(apiVersion, data, config.type),
          totalCount: getTotalCount(data),
        };

  useEffect(() => {
    setRowCountState((prevRowCountState: any) => gridData?.totalCount ?? prevRowCountState);
  }, [gridData?.totalCount, setRowCountState]);

  const handleFilterChange = useCallback((filterModel: GridFilterModel) => {
    const validFilters = filterModel.items.filter((e: any) => has(e, 'value'));
    if (
      (validFilters && validFilters.length > 0) ||
      (filterModel.quickFilterValues && filterModel.quickFilterValues?.length > 0)
    ) {
      setPaginationModel(defaultPaginationModel);
      setQueryOptions({ ...queryOptions, filterModel: { ...filterModel } });
    } else {
      handleFilterClean();
    }
  }, []);

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    setQueryOptions({ ...queryOptions, sortModel: [...sortModel] });
  }, []);

  const handleFilterClean = useCallback(() => {
    setQueryOptions({
      filterModel: { items: [], quickFilterValues: [] },
      sortModel: undefined,
    });
  }, []);

  return (
    <DataGridDisplay
      config={config}
      flags={flags}
      toolbar={toolbar}
      toolbarType={toolbarType}
      columns={getColumns(config.type, metadata)}
      loading={isLoading}
      initialRows={gridData.data}
      rowCount={rowCountState}
      paginationModel={paginationModel}
      queryOptions={queryOptions}
      onFilterClean={handleFilterClean}
      onFilterModelChange={handleFilterChange}
      onSortModelChange={handleSortModelChange}
      onSelect={onSelect}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onOther={onOther}
      onPaginationModelChange={setPaginationModel}
      refetchQueries={refetchQueries}
    />
  );
}
