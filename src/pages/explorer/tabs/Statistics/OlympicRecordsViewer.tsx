import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { defaultFilter, FilterState, MainCard, StripedDataGrid } from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { ColumnData, EntityType } from 'models';
import { useState } from 'react';
import { getStatsGridHeight, statsValueGetter, statsValueRender } from 'pages/explorer/components';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { t } from 'i18next';

interface Props {
  discipline: string;
}
export const OlympicRecordsViewer: React.FC<Props> = ({ discipline }) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Record);
  const [filters] = useState<FilterState>({ ...defaultFilter, disciplines: [discipline] });
  const url = `${config.apiNode}/olympic`;
  const { data, isLoading } = useQuery({
    queryKey: ['olympic', config.apiNode, filters],
    queryFn: () => apiService.post(url, filters),
  });

  const dataContent = isLoading ? [] : (data?.content ?? []);
  const currentRowsWithOrder = dataContent
    .filter((x: any) => x.current)
    .map((row: any, index: number) => ({
      ...row,
      order: index + 1,
    }));
  const rowsWithOrder = dataContent
    .filter((x: any) => !x.current)
    .map((row: any, index: number) => ({
      ...row,
      order: index + 1,
    }));
  const columns: ColumnData[] = [
    { width: 30, label: '#', dataKey: 'order' },
    { width: 300, label: t('general.name'), dataKey: 'participant' },
    { width: 420, label: t('general.event-record'), dataKey: 'recordType' },
    { width: 80, label: t('general.gender'), dataKey: 'participationGender' },
    { width: 100, label: t('general.noc'), dataKey: 'organisation' },
    { width: 160, label: t('general.recordDate'), dataKey: 'recordDate', align: 'right' },
    { width: 120, label: t('general.result'), dataKey: 'resultValue', align: 'right' },
    { width: 90, label: t('general.rank'), dataKey: 'rank', align: 'right' },
    { width: 280, label: t('general.competition'), dataKey: 'competition' },
  ];
  const gridColumns: GridColDef[] = [];
  columns.forEach((column: ColumnData) => {
    gridColumns.push({
      field: column.dataKey,
      headerName: column.label,
      headerAlign: column.align,
      align: column.align,
      width: column.width,
      sortable: true,
      valueGetter: (_value, row) => statsValueGetter(column, row),
      renderCell: (params: GridRenderCellParams) => statsValueRender(column, params),
    });
  });
  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid size={12}>
        <Typography variant="h6">{t('general.current-olympic-records')}</Typography>
      </Grid>
      <Grid size={12} sx={{ height: getStatsGridHeight(currentRowsWithOrder) }}>
        <MainCard>
          <StripedDataGrid
            rows={currentRowsWithOrder}
            columns={gridColumns}
            loading={isLoading}
            disableColumnMenu
            disableColumnFilter
            disableRowSelectionOnClick
            density="compact"
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            getRowHeight={() => 'auto'}
            hideFooter
            slotProps={{
              loadingOverlay: {
                variant: 'linear-progress',
                noRowsVariant: 'linear-progress',
              },
            }}
          />
        </MainCard>
      </Grid>
      <Grid size={12} sx={{ mt: 1 }}>
        <Typography variant="h6">{t('no-current-olympic-records')}</Typography>
      </Grid>
      <Grid size={12} sx={{ height: getStatsGridHeight(rowsWithOrder) }}>
        <MainCard>
          <StripedDataGrid
            rows={rowsWithOrder}
            columns={gridColumns}
            loading={isLoading}
            disableColumnMenu
            disableColumnFilter
            disableRowSelectionOnClick
            density="compact"
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            getRowHeight={() => 'auto'}
            hideFooter
            slotProps={{
              loadingOverlay: {
                variant: 'linear-progress',
                noRowsVariant: 'linear-progress',
              },
            }}
          />
        </MainCard>
      </Grid>
    </Grid>
  );
};
