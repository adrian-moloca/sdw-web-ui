import { Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useQuery } from '@tanstack/react-query';
import { getSameDayAndMonthSinceYear } from '_helpers';
import { StyledIconButton } from 'components';
import { useModelConfig } from 'hooks';
import useApiService from 'hooks/useApiService';
import { t } from 'i18next';
import { ColumnData, EntityType } from 'models';
import { statsValueGetter, statsValueRender } from 'pages/explorer/components';
import { useNavigate } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import baseConfig from 'baseConfig';
import { StatsDataGrid } from './StatsDataGrid';
import { StatsCard } from './StatsCard';

export const BornTodayTable: React.FC = () => {
  const apiService = useApiService();
  const navigate = useNavigate();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Person);
  const url = `${config.apiNode}/search?start=0&rows=10`;
  const filter = {
    query: {
      operator: 'AND',
      where: [
        {
          column: 'date_of_birth',
          operator: 'OR',
          value: getSameDayAndMonthSinceYear(),
        },
        { column: 'sources', value: 'HORD' },
      ],
    },
    sort: [{ column: 'date_of_birth', operator: 'DESC' }],
  };
  const { data, isLoading } = useQuery({
    queryKey: ['person', config.apiNode, filter],
    queryFn: () => apiService.post(url, filter),
  });

  const dataContent = isLoading ? [] : (data?.content ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const columns: ColumnData[] = [
    { width: 290, label: t('general.name'), dataKey: 'athlete', flex: 1, minWidth: 200 },
    { width: 90, label: t('general.noc'), dataKey: 'countryOfBirth' },
    { width: 160, label: t('general.date_of_birth'), dataKey: 'dateOfBirth', align: 'right' },
    { width: 80, label: t('common.age'), dataKey: 'age', align: 'right' },
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
    <StatsCard
      title={t('general.born-today')}
      subHeader={
        <Typography variant="body2" color={'text.secondary'}>
          {`${data?.pagination.total ?? 0} ${t('general.athletes-were-born-today')}`}
        </Typography>
      }
      secondary={
        <StyledIconButton
          title={t('actions.see-more')}
          aria-label={t('actions.see-more')}
          size="small"
          onClick={() => navigate('/explorer/statistics#target="born-today"')}
        >
          <MoreHorizOutlinedIcon fontSize="small" />
        </StyledIconButton>
      }
    >
      <StatsDataGrid
        rows={rowsWithOrder.slice(0, 10)}
        columns={gridColumns}
        loading={isLoading}
        disableColumnMenu
        disableColumnFilter
        disableColumnSorting
        disableRowSelectionOnClick
        density="compact"
        columnHeaderHeight={baseConfig.defaultColumnHeaderHeight}
        rowHeight={baseConfig.defaultRowHeight}
        hideFooter
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'linear-progress',
          },
        }}
      />
    </StatsCard>
  );
};
