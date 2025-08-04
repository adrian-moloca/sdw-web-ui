import { Grid } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useQuery } from '@tanstack/react-query';
import {
  ErrorPanel,
  FilterPanel,
  FilterType,
  FilterState,
  StripedDataGrid,
  defaultFilter,
  MainCard,
} from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { t } from 'i18next';
import { ColumnData, EntityType } from 'models';
import {
  statsValueGetter,
  statsValueRender,
  getStatsGridHeight,
  TopMedalistsChart,
  TopMedalistsPerDisciplineChart,
} from 'pages/explorer/components';
import { useState } from 'react';

export const MedalsByAthleteTab: React.FC = () => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Award);
  const [filters, setFilters] = useState<FilterState>(defaultFilter);

  const url = `${config.apiNode}/person`;
  const { data, error, isLoading } = useQuery({
    queryKey: ['person', config.apiNode, filters],
    queryFn: () => apiService.post(url, filters),
  });

  const dataContent = isLoading ? [] : (data?.content ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const columns: ColumnData[] = [
    { width: 30, label: '#', dataKey: 'order' },
    { width: 320, label: t('general.name'), dataKey: 'athlete' },
    { width: 100, label: t('general.nocs'), dataKey: 'nocs' },
    { width: 240, label: t('general.disciplines'), dataKey: 'disciplineCodes' },
    { width: 120, label: t('general.golden'), dataKey: 'golden' },
    { width: 120, label: t('general.silver'), dataKey: 'silver' },
    { width: 120, label: t('general.bronze'), dataKey: 'bronze' },
    { width: 120, label: t('general.total'), dataKey: 'total' },
    { width: 120, label: t('general.seasons'), dataKey: 'yearRange' },
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
        type={FilterType.MedalsByAthlete}
        filters={filters}
        onClean={() => setFilters(defaultFilter)}
        onFilterChange={setFilters}
      />
      <Grid size={{ md: 6, xs: 12 }}>
        <TopMedalistsChart data={rowsWithOrder} topN={10} />
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <TopMedalistsPerDisciplineChart data={rowsWithOrder} topN={10} />
      </Grid>
      <Grid size={12} sx={{ height: getStatsGridHeight(rowsWithOrder) }}>
        <MainCard>
          <StripedDataGrid
            loading={isLoading}
            rows={rowsWithOrder}
            columns={gridColumns}
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
