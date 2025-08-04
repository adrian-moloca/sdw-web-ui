import { IDataGridProps, QueryOptionsProps } from 'types/datagrid';
import { useLocation } from 'react-router-dom';
import useDataGridHelper from 'hooks/useDataGridHelper';
import useApiService from 'hooks/useApiService';
import { usePersistedState } from 'hooks';
import { EntityType, ISortProps } from 'models';
import { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid-pro';
import { GridSortItem } from '@mui/x-data-grid/models/gridSortModel';
import appConfig from 'config/app.config';
import { useMemo, useState, useEffect } from 'react';
import { calculateCurrentFilter, executeQuery, getDataArray, getTotalCount } from 'utils/datagrid';
import { useQuery } from '@tanstack/react-query';
import has from 'lodash/has';
import { DataGridDisplay } from '../DataGridDisplay';
import { PageContainer } from '@toolpad/core';
import { BasicPageHeader } from 'layout/page.layout';
import Grid from '@mui/material/Grid';

export function DataGridPanel<T>({
  columns,
  config,
  dashboard,
  dataSource,
  disableColumnMenu,
  disablePagination,
  fixPageSize,
  flags,
  metadata,
  query,
  search,
  showHeader,
  sorting,
  tags,
  toolbar,
  toolbarType,
  where,
  onCreate,
  onOther,
  onSelect,
  onUpdate,
  refetchQueries,
  fontSize,
}: IDataGridProps<T>) {
  const location = useLocation();
  const { getColumns } = useDataGridHelper();
  const apiService = useApiService();

  const apiVersion = dataSource?.apiVersion ?? config.apiVersion;

  const [queryOptions, setQueryOptions] = usePersistedState<QueryOptionsProps>(
    {
      filterModel: { items: [], quickFilterValues: [search?.split(' ')] },
      sortModel: sorting?.map((e: ISortProps) => {
        const sortItem: GridSortItem = { field: e.column, sort: 'asc' };
        return sortItem;
      }),
    },
    `${config.entityName}${appConfig.forgeRockRealm}${dataSource?.queryKey}_queryOption`
  );

  const defaultPaginationModel: GridPaginationModel = {
    pageSize: fixPageSize ?? 25,
    page: 0,
  };

  const [paginationStateDefault, setPaginationStateDefault] = useState(defaultPaginationModel);
  const [paginationStateGrid, setPaginationStateGrid] = usePersistedState<GridPaginationModel>(
    defaultPaginationModel,
    `${config.entityName}${appConfig.forgeRockRealm}${dataSource?.queryKey}_paginationM`
  );

  const paginationModel = fixPageSize ? paginationStateDefault : paginationStateGrid;
  const setPaginationModel = fixPageSize ? setPaginationStateDefault : setPaginationStateGrid;

  const breadCrumbs = useMemo(
    () => [
      { title: config.area, path: '/' },
      { title: config.displayPlural, path: location.pathname },
    ],
    [location.pathname, config]
  );

  const currentFilter = useMemo(() => {
    return calculateCurrentFilter(queryOptions, paginationModel, config.apiVersion, {
      tags,
      query,
      sorting,
      metadata,
      where,
    });
  }, [queryOptions, paginationModel, config, tags, query, sorting, metadata, where]);

  const { data, error, isLoading } = useQuery({
    queryKey: [
      [
        `${config.entityName}${dataSource?.queryKey ?? ''}_index`,
        dataSource?.url,
        config.apiNode,
        currentFilter,
      ],
    ],
    queryFn: () => executeQuery(apiService, config, apiVersion, currentFilter, dataSource),
    refetchOnMount: true,
    refetchInterval: [
      EntityType.Report,
      EntityType.MergeRequest,
      EntityType.OdfIngest,
      EntityType.UsdfIngest,
    ].includes(config.type)
      ? 60 * 1000
      : undefined,
  });

  const gridData =
    isLoading || error
      ? { data: [], totalCount: undefined }
      : {
          data: getDataArray<T>(apiVersion, data, config.type),
          totalCount: getTotalCount(data),
        };

  const [rowCountState, setRowCountState] = useState(gridData?.totalCount ?? 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: any) => gridData?.totalCount ?? prevRowCountState);
  }, [gridData?.totalCount, setRowCountState]);

  const handleFilterChange = (filterModel: GridFilterModel) => {
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
  };

  const handleSortModelChange = (sortModel: GridSortModel) => {
    setPaginationModel(defaultPaginationModel);
    setQueryOptions({ ...queryOptions, sortModel: [...sortModel] });
  };

  const handleFilterClean = () => {
    setPaginationModel(defaultPaginationModel);
    setQueryOptions({
      filterModel: { items: [] },
      sortModel: sorting?.map((e: ISortProps) => {
        const sortItem: GridSortItem = { field: e.column, sort: 'asc' };
        return sortItem;
      }),
      search,
    });
  };

  const renderDataGrid = () => (
    <DataGridDisplay
      config={config}
      disablePagination={disablePagination}
      disableColumnMenu={disableColumnMenu}
      flags={flags}
      toolbar={toolbar}
      fontSize={fontSize}
      toolbarType={toolbarType}
      columns={columns ?? getColumns(config.type, metadata)}
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

  return showHeader ? (
    <PageContainer
      maxWidth={'xl'}
      title={config.displayPlural}
      breadcrumbs={breadCrumbs}
      slots={{ header: BasicPageHeader }}
    >
      {dashboard ? (
        <Grid container spacing={2}>
          <Grid size={12}>{dashboard}</Grid>
          <Grid size={12}>{renderDataGrid()}</Grid>
        </Grid>
      ) : (
        renderDataGrid()
      )}
    </PageContainer>
  ) : (
    renderDataGrid()
  );
}
