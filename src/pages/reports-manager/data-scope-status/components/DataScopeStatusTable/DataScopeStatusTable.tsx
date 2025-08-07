import React, { JSX, useCallback } from 'react';
import {
  GridValidRowModel,
  useGridApiRef,
  GridFilterModel,
  GridPaginationModel,
  GridColDef,
  GridSortModel,
  GridCallbackDetails,
} from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';
import { StyledDataGridPro } from './StyledDataGridPro';
import { CustomToolbarStatusScope } from './CustomToolbarStatusScope';
import { colors } from 'themes/colors';

interface DataScopeStatusTableProps {
  rows: GridValidRowModel[];
  columns: GridColDef[];
  isLoading?: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel, details: GridCallbackDetails) => void;
  onFilterModelChange: (model: GridFilterModel, details: GridCallbackDetails<'filter'>) => void;
  onSortModelChange: (model: GridSortModel, details: GridCallbackDetails) => void;
  onSearchChange?: (searchQuery: string) => void;
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
  rowCount?: number;
}

export const DataScopeStatusTable: React.FC<DataScopeStatusTableProps> = ({
  rows,
  columns,
  isLoading,
  paginationModel,
  onPaginationModelChange,
  onFilterModelChange,
  onSortModelChange,
  onSearchChange,
  filterModel,
  sortModel,
  rowCount = 0,
}) => {
  const apiRef = useGridApiRef();

  const clearFilters = useCallback((): void => {
    if (apiRef.current) {
      apiRef.current.setFilterModel({ items: [] });
      apiRef.current.setQuickFilterValues([]);
      onFilterModelChange({ items: [] }, {} as GridCallbackDetails<'filter'>);
      if (onSearchChange) {
        onSearchChange('');
      }
    }
  }, [apiRef, onFilterModelChange, onSearchChange]);

  return (
    <Box
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: colors.neutral['200'],
        borderRadius: '8px',
      }}
    >
      <StyledDataGridPro
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.id || row.competitionId || `${row.competition}-${row.scopeType}`}
        disableRowSelectionOnClick
        checkboxSelection={false}
        density="compact"
        paginationMode="server"
        pagination
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        rowCount={rowCount}
        filterMode="server"
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        getRowClassName={(params: any) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        getRowHeight={() => 'auto'}
        showToolbar
        slots={{
          toolbar: (): JSX.Element => (
            <CustomToolbarStatusScope clearFilters={clearFilters} onSearchChange={onSearchChange} />
          ),
        }}
        slotProps={{
          toolbar: {
            showCreateButton: false,
            flags: 0,
            onFilterClean: clearFilters,
          },
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              frequency: true,
            },
          },
          pinnedColumns: {
            left: [],
            right: [],
          },
        }}
        sx={{
          backgroundColor: '#fff',
          padding: '8px 16px 0 16px',
          border: 'none',
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-row': {
            minHeight: 'auto !important',
            height: 'auto !important',
            maxHeight: 'none !important',
          },
          '& .MuiDataGrid-virtualScroller': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
        }}
      />
    </Box>
  );
};
