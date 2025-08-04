import { useQuery } from '@tanstack/react-query';
import { MainCard, VerticalStripedDataGridBase } from 'components';
import type { IPanelTabProps } from 'types/views';
import useApiService from 'hooks/useApiService';
import { useModelConfig } from 'hooks';
import orderBy from 'lodash/orderBy';
import {
  generateCalendarColumns,
  generateCalendarRows,
  getAllCalendarDates,
} from '../utils/calendar';
import { useState } from 'react';
import { GridRowId } from '@mui/x-data-grid-pro';
import useAppRoutes from 'hooks/useAppRoutes';
import baseConfig from 'baseConfig';

export const CompetitionScheduleTab = ({ parameter }: IPanelTabProps) => {
  const apiService = useApiService();
  const { getConfig } = useModelConfig();
  const { getDetailRoute } = useAppRoutes();
  const config = getConfig(parameter.type);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<GridRowId | null>(null);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  const handleHover = (rowIndex: GridRowId | null, field: string | null) => {
    setHoveredRowIndex(rowIndex);
    setHoveredField(field);
  };
  const url = `${config.apiNode}/${parameter.id}/calendar`;
  const { data, isLoading } = useQuery({
    queryKey: [parameter.id, 'calendar'],
    queryFn: () => apiService.fetch(url),
  });
  const dataContent = isLoading ? [] : (data?.data ?? []);
  const rowsWithOrder = orderBy(dataContent, 'discipline.title');
  const allDates = getAllCalendarDates(rowsWithOrder);
  const columns = generateCalendarColumns(
    allDates,
    getDetailRoute(parameter.type, parameter.id),
    hoveredRowIndex,
    hoveredField,
    handleHover
  );
  const rows = generateCalendarRows(rowsWithOrder, allDates);
  return (
    <MainCard>
      <VerticalStripedDataGridBase
        rows={rows}
        columns={columns}
        loading={isLoading}
        disableColumnMenu
        disableColumnFilter
        disableRowSelectionOnClick
        getRowId={(row) => row.discipline.id}
        density="compact"
        getRowHeight={() => 'auto'}
        columnHeaderHeight={baseConfig.defaultColumnHeaderHeight ?? 60}
        initialState={{ pinnedColumns: { left: ['discipline'] } }}
        hideFooter
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
