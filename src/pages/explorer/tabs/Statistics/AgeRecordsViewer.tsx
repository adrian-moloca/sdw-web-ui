import { Grid } from '@mui/system';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useQuery } from '@tanstack/react-query';
import {
  FilterState,
  FilterPanel,
  FilterType,
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
  TopNocsPerAgeChart,
  TopSeasonPerAgeChart,
} from 'pages/explorer/components';
import { useState } from 'react';

interface Props {
  direction: 'ASC' | 'DESC';
}
export const AgeRecordsViewer: React.FC<Props> = ({ direction }) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Participant);
  const ageDefaultFilter: FilterState = {
    ...defaultFilter,
    sort: [{ column: 'age_at_first_competition', operator: 'ASC' }],
  };
  const [filters, setFilters] = useState<FilterState>(ageDefaultFilter);
  const url = `${config.apiNode}/olympic-age-stats?direction=${direction}`;
  const { data, isLoading } = useQuery({
    queryKey: ['olympic-age-stats', config.apiNode, filters, direction],
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
    { width: 130, label: t('common.dateOfBirth'), dataKey: 'dateOfBirth', align: 'right' },
    { width: 80, label: t('general.gender'), dataKey: 'gender' },
    { width: 100, label: t('general.nocs'), dataKey: 'organisationCodes' },
    { width: 240, label: t('general.disciplines'), dataKey: 'disciplines' },
    {
      width: 100,
      label: t('common.age'),
      dataKey: direction == 'ASC' ? 'ageAtFirstCompetition' : 'ageAtLastCompetition',
      align: 'right',
    },
    { width: 110, label: t('general.seasons'), dataKey: 'dateRange', align: 'right' },
    { width: 130, label: t('common.dateOfDeath'), dataKey: 'dateOfDeath', align: 'right' },
    { width: 130, label: t('common.roles'), dataKey: 'roles' },
    { width: 260, label: t('general.competitionCategories'), dataKey: 'competitionCategories' },
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
        onFilterChange={setFilters}
        onClean={() => setFilters(ageDefaultFilter)}
      />
      <Grid size={{ md: 6, xs: 12 }}>
        <TopSeasonPerAgeChart data={rowsWithOrder} topN={15} direction={direction} />
      </Grid>
      <Grid size={{ md: 6, xs: 12 }}>
        <TopNocsPerAgeChart data={rowsWithOrder} topN={10} direction={direction} />
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
