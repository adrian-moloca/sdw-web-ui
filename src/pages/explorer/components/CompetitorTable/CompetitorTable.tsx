import React from 'react';
import {
  DataGridProProps,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  GridColDef,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { Stack, useMediaQuery } from '@mui/material';
import { StripedDataGrid, StripedDataGridBase } from 'components';
import { ColumnData } from 'models';
import { useResults } from 'hooks';
import { numericPrefixSortComparator, valueGetter, valueRender } from './utils';
import { CompetitorExtendedPanel } from './CompetitorExtendedPanel';
import { DetailPanelToggle } from './DetailPanelToggle';
import baseConfig from 'baseConfig';
import { OfficialsDisplay } from '../OfficialsDisplay';
import uniqBy from 'lodash/uniqBy';

type Props = {
  data: Array<any>;
  discipline: string;
  officials?: Array<any>;
  ranking?: boolean;
};

export const CompetitorTable: React.FC<Props> = ({ data, discipline, officials, ranking }) => {
  const {
    buildResultColumnData,
    buildExtendedColumnData,
    hasExpandedResultsPanel,
    extendedResultMetrics,
  } = useResults();
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  const hasOfficials = officials && officials.length > 0;
  const hasData = data && data.length > 0;
  const withExpandedResults = hasExpandedResultsPanel(data, isMobile);
  const getDetailPanelContent = React.useCallback<
    NonNullable<DataGridProProps['getDetailPanelContent']>
  >(({ row }) => <CompetitorExtendedPanel row={row} discipline={discipline} />, []);
  const apiRef = useGridApiRef();

  const rowsWithOrder =
    data?.map((row, index) => ({
      ...row,
      order: index + 1,
    })) ?? [];
  const columns: GridColDef[] = [];

  const extraColumns: ColumnData[] = [
    ...buildResultColumnData(data ?? [], discipline, undefined, undefined, false),
    ...buildExtendedColumnData(data ?? []),
  ];
  extraColumns.forEach((col) => {
    columns.push({
      field: col.dataKey,
      headerName: col.label,
      width: col.width,
      minWidth: col.minWidth,
      sortable: true,
      flex: col.flex,
      headerAlign: col.align,
      valueGetter: (_value, row) => valueGetter(col, row, extendedResultMetrics) ?? '',
      renderCell: (params: GridRenderCellParams) =>
        valueRender(col, params.row, discipline, extendedResultMetrics),
      sortComparator:
        col.dataKey == 'rank' || col.dataKey == 'bib' ? numericPrefixSortComparator : undefined,
    });
  });
  if (withExpandedResults) {
    columns.push({
      ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
      renderCell: (params) => <DetailPanelToggle row={params.row} />,
    });
  }
  if (!hasData && !hasOfficials) return null;
  if (ranking === true)
    return (
      <Stack sx={{ mb: hasOfficials ? 3 : 0 }} spacing={1}>
        {hasData && (
          <StripedDataGrid
            apiRef={apiRef}
            rows={uniqBy(rowsWithOrder, 'id').filter((row) => row?.result?.rank)}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            disableColumnMenu
            hideFooter
            columnHeaderHeight={baseConfig.defaultColumnHeaderHeight ?? 60}
            rowHeight={baseConfig.defaultRowHeight ?? 40}
            density="compact"
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            }
            getDetailPanelHeight={() => 'auto'}
            getDetailPanelContent={withExpandedResults ? getDetailPanelContent : undefined}
          />
        )}
        {hasOfficials && <OfficialsDisplay data={{ officials: officials }} />}
      </Stack>
    );
  return (
    <Stack sx={{ mb: hasOfficials ? 3 : 0 }} spacing={1}>
      {hasData && (
        <StripedDataGridBase
          apiRef={apiRef}
          rows={uniqBy(rowsWithOrder, 'id')}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          disableColumnMenu
          hideFooter
          columnHeaderHeight={baseConfig.defaultColumnHeaderHeight ?? 60}
          rowHeight={baseConfig.defaultRowHeight ?? 40}
          density="compact"
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          getDetailPanelHeight={() => 'auto'}
          getDetailPanelContent={withExpandedResults ? getDetailPanelContent : undefined}
        />
      )}
      {hasOfficials && <OfficialsDisplay data={{ officials: officials }} />}
    </Stack>
  );
};
