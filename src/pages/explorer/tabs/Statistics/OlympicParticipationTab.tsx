import { Grid } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useQuery } from '@tanstack/react-query';
import {
  FilterState,
  FilterType,
  FilterPanel,
  StripedDataGrid,
  defaultFilter,
  MainCard,
} from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { t } from 'i18next';
import { ColumnData, EntityType } from 'models';
import {
  getStatsGridHeight,
  statsValueGetter,
  statsValueRender,
  TopAthletesPerParticipationChart,
  TopNocsPerParticipationChart,
} from 'pages/explorer/components';
import { useState } from 'react';

export const OlympicParticipationTab: React.FC = () => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Participant);
  const [filters, setFilters] = useState<FilterState>(defaultFilter);
  const url = `${config.apiNode}/olympic-stats`;
  const { data, isLoading } = useQuery({
    queryKey: ['olympic-stats', config.apiNode, filters],
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
    { width: 80, label: t('general.gender'), dataKey: 'gender' },
    { width: 100, label: t('general.nocs'), dataKey: 'organisationCodes' },
    { width: 240, label: t('general.disciplines'), dataKey: 'disciplines' },
    { width: 80, label: t('general.events'), dataKey: 'totalOlympicEvents', align: 'right' },
    {
      width: 120,
      label: t('general.competitions'),
      dataKey: 'totalOlympicCompetitions',
      align: 'right',
    },
    { width: 110, label: t('general.seasons'), dataKey: 'dateRange', align: 'right' },
    { width: 110, label: t('general.ageRange'), dataKey: 'ageRange', align: 'right' },
    { width: 260, label: t('general.competitionCategories'), dataKey: 'competitionCategories' },
    { width: 130, label: t('common.dateOfBirth'), dataKey: 'dateOfBirth', align: 'right' },
    { width: 130, label: t('common.dateOfDeath'), dataKey: 'dateOfDeath', align: 'right' },
    { width: 130, label: t('common.roles'), dataKey: 'roles' },
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
      <FilterPanel
        type={FilterType.OlympicParticipation}
        filters={filters}
        onClean={() => setFilters(defaultFilter)}
        onFilterChange={setFilters}
      />
      <Grid size={{ md: 6, xs: 12 }}>
        <TopAthletesPerParticipationChart data={rowsWithOrder} topN={10} />
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <TopNocsPerParticipationChart data={rowsWithOrder} topN={10} />
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
