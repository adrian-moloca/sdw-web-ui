import { IDataGridProps, QueryOptionsProps } from 'types/datagrid';
import useDataGridHelper from 'hooks/useDataGridHelper';
import useApiService from 'hooks/useApiService';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid-pro';
import { calculateCurrentFilter } from 'utils/datagrid';
import { useQuery } from '@tanstack/react-query';
import { toolbarMap } from '../DataGridToolbar';
import { StripedDataGridBase } from 'components/datagrid/styles';
import { GridActionProps, EditionFlagEnum } from 'models';

interface Props<T> extends Readonly<IDataGridProps<T>> {
  readonly id: string;
  readonly pageSize?: number;
  readonly onSelectMultiple: (items: Array<T>) => void;
}
declare module '@mui/x-data-grid-pro' {
  interface ToolbarPropsOverrides {
    showCreateButton?: boolean;
    toolbar?: GridActionProps[];
    flags: EditionFlagEnum;
    onClickCreate?: () => void;
    onFilterClean?: () => void;
    queryOptions?: QueryOptionsProps;
  }
}
export function DataGridSelectionPanel<T>({
  id,
  config,
  disablePagination,
  query,
  tags,
  sorting,
  metadata,
  flags,
  toolbar,
  where,
  pageSize,
  onSelectMultiple,
}: Props<T>) {
  const { getColumns } = useDataGridHelper();
  const apiService = useApiService();

  const [queryOptions, setQueryOptions] = useState<QueryOptionsProps>({
    filterModel: undefined,
    sortModel: undefined,
  });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize ?? 100,
    page: 0,
  });

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

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
    queryKey: [`${config.apiNode}_candidates`, currentFilter],
    queryFn: () => apiService.search(`${config.apiNode}/search`, currentFilter),
  });

  const gridData =
    isLoading || error
      ? { data: [], totalCount: 0 }
      : {
          data: data?.content?.filter((e: any) => e.id !== id) ?? [],
          totalCount: data?.pagination?.total ?? data?.content?.length ?? 0,
        };

  const [rowCountState, setRowCountState] = React.useState(gridData?.totalCount ?? 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: any) =>
      gridData?.totalCount !== undefined ? gridData?.totalCount : prevRowCountState
    );
  }, [gridData?.totalCount, setRowCountState]);

  const onSortModelChange = useCallback((sortModel: GridSortModel) => {
    setQueryOptions({ ...queryOptions, sortModel: [...sortModel] });
  }, []);

  const onFilterClean = useCallback(() => {
    setQueryOptions({
      filterModel: { items: [], quickFilterValues: [] },
      sortModel: undefined,
    });
  }, []);

  const slots = {
    toolbar: toolbarMap.default ?? undefined,
  };

  return (
    <StripedDataGridBase
      loading={isLoading}
      rows={gridData.data}
      columns={getColumns(config.type, metadata)}
      disableColumnMenu={true}
      rowCount={rowCountState}
      getRowHeight={() => 'auto'}
      density="compact"
      checkboxSelection={true}
      pagination={!disablePagination}
      paginationMode="server"
      pageSizeOptions={[10, 25, 50, 100, 200]}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      sortingMode="server"
      sortModel={queryOptions?.sortModel}
      keepNonExistentRowsSelected
      disableRowSelectionOnClick
      rowSelectionModel={rowSelectionModel}
      onSortModelChange={onSortModelChange}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      onRowSelectionModelChange={(newRowSelectionModel) => {
        setRowSelectionModel(newRowSelectionModel);
        const selectedData = gridData.data.filter((e: any) =>
          Array.from(newRowSelectionModel.ids).includes(e.id)
        );
        onSelectMultiple(selectedData);
      }}
      showToolbar={true}
      slots={slots}
      slotProps={{
        toolbar: {
          flags,
          toolbar,
          queryOptions,
          onFilterClean,
        },
      }}
    />
  );
}
