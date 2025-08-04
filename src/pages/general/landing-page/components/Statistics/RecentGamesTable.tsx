import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useQuery } from '@tanstack/react-query';
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
import dayjs from 'dayjs';

export const RecentGamesTable: React.FC = () => {
  const apiService = useApiService();
  const navigate = useNavigate();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Competition);
  const url = `${config.apiNode}/search?start=0&rows=10`;
  const filter = {
    query: {
      operator: 'AND',
      where: [
        { column: 'sources', value: 'HORD' },
        {
          column: 'start_date',
          operator: 'GTE',
          value: dayjs().subtract(100, 'year').format(baseConfig.generalDateFormat).toUpperCase(),
        },
      ],
    },
    sort: [{ column: 'start_date', operator: 'DESC' }],
  };
  const { data, isLoading } = useQuery({
    queryKey: ['competition', config.apiNode, filter],
    queryFn: () => apiService.post(url, filter),
  });

  const dataContent = isLoading ? [] : (data?.content ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const columns: ColumnData[] = [
    { width: 290, label: t('general.name'), dataKey: 'competitionItem', flex: 1, minWidth: 200 },
    { width: 160, label: t('general.startDate'), dataKey: 'startDate', align: 'right' },
    { width: 160, label: t('general.finishDate'), dataKey: 'finishDate', align: 'right' },
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
      title={t('general.recent-games')}
      secondary={
        <StyledIconButton
          title={t('actions.see-more')}
          aria-label={t('actions.see-more')}
          size="small"
          onClick={() => navigate('/explorer/competitions')}
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
