import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useQuery } from '@tanstack/react-query';
import { defaultFilter, StyledIconButton } from 'components';
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

export const MedalAthleteTable: React.FC = () => {
  const apiService = useApiService();
  const navigate = useNavigate();
  const { getConfig } = useModelConfig();
  const config = getConfig(EntityType.Award);
  const url = `${config.apiNode}/person?start=0&rows=10`;
  const { data, isLoading } = useQuery({
    queryKey: ['person', config.apiNode, defaultFilter, 'main'],
    queryFn: () => apiService.post(url, defaultFilter),
  });

  const dataContent = isLoading ? [] : (data?.content ?? []);
  const rowsWithOrder = dataContent.map((row: any, index: number) => ({
    ...row,
    order: index + 1,
  }));
  const columns: ColumnData[] = [
    { width: 280, label: t('general.name'), dataKey: 'athlete' },
    { width: 90, label: t('general.nocs'), dataKey: 'nocs' },
    { width: 80, label: t('general.golden'), dataKey: 'golden-number', align: 'right' },
    { width: 80, label: t('general.silver'), dataKey: 'silver-number', align: 'right' },
    { width: 80, label: t('general.bronze'), dataKey: 'bronze-number', align: 'right' },
    { width: 80, label: t('general.total'), dataKey: 'total-number', align: 'right' },
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
      title={t('general.top-medal-winners')}
      secondary={
        <StyledIconButton
          title={t('actions.see-more')}
          aria-label={t('actions.see-more')}
          size="small"
          onClick={() => navigate('/explorer/statistics#target="medals-by-athlete"')}
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
        hideFooter
        columnHeaderHeight={baseConfig.defaultColumnHeaderHeight}
        rowHeight={baseConfig.defaultRowHeight}
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
