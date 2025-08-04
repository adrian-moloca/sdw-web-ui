import { Grid } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useQuery } from '@tanstack/react-query';
import baseConfig from 'baseConfig';
import {
  defaultFilter,
  ErrorPanel,
  FilterPanel,
  FilterState,
  FilterType,
  MainCard,
  StripedDataGrid,
} from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { t } from 'i18next';
import get from 'lodash/get';
import { ColumnData, EntityType } from 'models';
import {
  statsValueGetter,
  statsValueRender,
  getStatsGridHeight,
  TopNocByMedalChart,
  ContinentMedalChart,
} from 'pages/explorer/components';
import { useState } from 'react';

export const MedalsByCountryTab: React.FC = () => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Award);
  const [filters, setFilters] = useState<FilterState>(defaultFilter);
  const url = `${config.apiNode}/noc`;
  const { data, error, isLoading } = useQuery({
    queryKey: ['noc', config.apiNode, filters],
    queryFn: () => apiService.post(url, filters),
  });

  const dataContent = isLoading ? [] : (data?.data ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const columns: ColumnData[] = [
    { width: 30, label: '#', dataKey: 'order' },
    { width: 320, label: t('general.noc'), dataKey: 'noc' },
    { width: 120, label: '', dataKey: 'organisation' },
    { width: 120, label: t('general.continent'), dataKey: 'continent' },
    { width: 120, label: t('general.golden'), dataKey: 'golden' },
    { width: 120, label: t('general.silver'), dataKey: 'silver' },
    { width: 120, label: t('general.bronze'), dataKey: 'bronze' },
    { width: 120, label: t('general.total'), dataKey: 'total' },
  ];
  const gridColumns: GridColDef[] = [];
  columns.forEach((column: ColumnData) => {
    gridColumns.push({
      field: column.dataKey,
      headerName: column.label,
      width: column.width,
      sortable: true,
      valueGetter: (_value, row) => statsValueGetter(column, row),
      renderCell: (params: GridRenderCellParams) => statsValueRender(column, params),
    });
  });
  if (error) return <ErrorPanel error={error} />;
  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <FilterPanel
        type={FilterType.MedalsByCountry}
        filters={filters}
        onClean={() => setFilters(defaultFilter)}
        onFilterChange={setFilters}
      />
      <Grid size={{ md: 6, xs: 12 }}>
        <TopNocByMedalChart data={rowsWithOrder} topN={20} />
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <ContinentMedalChart data={rowsWithOrder} />
      </Grid>
      <Grid size={12} sx={{ height: getStatsGridHeight(rowsWithOrder) }}>
        <MainCard>
          <StripedDataGrid
            rows={rowsWithOrder}
            columns={gridColumns}
            loading={isLoading}
            getRowId={(row) => get(row, 'organisation.id')}
            disableColumnMenu
            disableColumnFilter
            disableRowSelectionOnClick
            density="compact"
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            rowHeight={baseConfig.defaultRowHeight ?? 36}
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
