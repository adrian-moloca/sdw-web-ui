import { Typography } from '@mui/material';
import { GridColDef, GridPaginationModel, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useQuery } from '@tanstack/react-query';
import baseConfig from 'baseConfig';
import { MainCard, StripedDataGrid } from 'components';
import dayjs from 'dayjs';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { t } from 'i18next';
import { ColumnData, EntityType } from 'models';
import { statsValueGetter, statsValueRender } from 'pages/explorer/components';
import { useEffect, useState } from 'react';

export const RecentDeathsTab: React.FC = () => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Person);
  const defaultPaginationModel: GridPaginationModel = { pageSize: 25, page: 0 };
  const [paginationModel, setPaginationModel] = useState(defaultPaginationModel);
  const filter = {
    enablePagination: true,
    rows: paginationModel.pageSize,
    start: paginationModel.page * paginationModel.pageSize,
    query: {
      operator: 'AND',
      where: [
        {
          column: 'date_of_death',
          operator: 'GTE',
          value: dayjs().subtract(8, 'month').format(baseConfig.generalDateFormat),
        },
        { column: 'sources', value: 'HORD' },
      ],
    },
    sort: [{ column: 'date_of_death', operator: 'DESC' }],
  };
  const url = `${config.apiNode}/search?start=${filter.start}&rows=${filter.rows}`;
  const { data, isLoading } = useQuery({
    queryKey: ['person', config.apiNode, filter],
    queryFn: () => apiService.post(url, filter),
  });

  const dataContent = isLoading ? [] : (data?.content ?? []);
  const [rowCountState, setRowCountState] = useState(data?.pagination?.total ?? 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: any) => data?.pagination?.total ?? prevRowCountState);
  }, [data, setRowCountState]);

  const columns: ColumnData[] = [
    { width: 280, label: t('general.name'), dataKey: 'athlete' },
    { width: 80, label: t('general.noc'), dataKey: 'countryOfBirth' },
    { width: 80, label: t('general.gender'), dataKey: 'gender' },
    { width: 80, label: t('common.age'), dataKey: 'age', align: 'right' },
    { width: 140, label: t('general.date-of-death'), dataKey: 'dateOfDeath', align: 'right' },
    { width: 140, label: t('general.date_of_birth'), dataKey: 'dateOfBirth', align: 'right' },
  ];
  const gridColumns: GridColDef[] = [];
  columns.forEach((column: ColumnData) => {
    gridColumns.push({
      field: column.dataKey,
      headerName: column.label,
      headerAlign: column.align,
      align: column.align,
      width: column.width,
      sortable: false,
      valueGetter: (_value, row) => statsValueGetter(column, row),
      renderCell: (params: GridRenderCellParams) => statsValueRender(column, params),
    });
  });
  return (
    <MainCard
      divider={false}
      border={false}
      title={
        <Typography variant="body2" color={'text.secondary'}>
          {`${data?.pagination?.total ?? 0} ${t('general.olympians-passed-away-recently')}`}
        </Typography>
      }
    >
      <StripedDataGrid
        loading={isLoading}
        rows={dataContent}
        columns={gridColumns}
        disableColumnMenu
        disableColumnFilter
        disableRowSelectionOnClick
        disableColumnSorting
        density="compact"
        rowCount={rowCountState}
        pagination={true}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        getRowHeight={() => 'auto'}
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'linear-progress',
          },
        }}
      />
    </MainCard>
  );
};
